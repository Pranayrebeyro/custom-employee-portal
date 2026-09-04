const bcrypt = require("bcryptjs");
const db = require("../config/db");
const { createAuditLog } = require("../services/auditService");


async function getUsers(req, res) {
    try {
        const result = await db.query(`
            SELECT
                u.id,
                u.name,
                u.email,
                u.is_active,
                u.created_at,
                COALESCE(
                    ARRAY_AGG(r.name)
                    FILTER (WHERE r.id IS NOT NULL),
                    '{}'
                ) AS roles
            FROM Users u
            LEFT JOIN UserRoles ur
                ON ur.user_id = u.id
            LEFT JOIN Roles r
                ON r.id = ur.role_id
            GROUP BY
                u.id,
                u.name,
                u.email,
                u.is_active,
                u.created_at
            ORDER BY u.id
        `);

        return res.status(200).json({
            message: "Users retrieved successfully",
            users: result.rows
        });

    } catch (error) {
        console.error("Get users error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


async function createUser(req, res) {
    try {
        const {
            name,
            email,
            password,
            role
        } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "Name, email, password and role are required"
            });
        }

        const existingUser = await db.query(
            `
            SELECT id
            FROM Users
            WHERE LOWER(email) = LOWER($1)
            `,
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "User with this email already exists"
            });
        }

        const roleResult = await db.query(
            `
            SELECT id, name
            FROM Roles
            WHERE LOWER(name) = LOWER($1)
            `,
            [role]
        );

        if (roleResult.rows.length === 0) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const client = await db.connect();

        try {
            await client.query("BEGIN");

            const userResult = await client.query(
                `
                INSERT INTO Users
                    (name, email, password_hash)
                VALUES
                    ($1, $2, $3)
                RETURNING id, name, email, is_active, created_at
                `,
                [name, email, passwordHash]
            );

            const user = userResult.rows[0];

            await client.query(
                `
                INSERT INTO UserRoles
                    (user_id, role_id)
                VALUES
                    ($1, $2)
                `,
                [user.id, roleResult.rows[0].id]
            );

            await client.query("COMMIT");

            await createAuditLog({
                userId: req.user.userId,
                action: "CREATE_USER",
                resource: `user:${user.id}`,
                status: "SUCCESS",
                ipAddress: req.ip,
                details: {
                    createdUserId: user.id,
                    email: user.email,
                    role: roleResult.rows[0].name
                }
            });

            return res.status(201).json({
                message: "User created successfully",
                user: {
                    ...user,
                    role: roleResult.rows[0].name
                }
            });

        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error("Create user error:", error);

        await createAuditLog({
            userId: req.user?.userId || null,
            action: "CREATE_USER",
            resource: "user",
            status: "FAILED",
            ipAddress: req.ip,
            details: {
                error: error.message
            }
        });

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


async function updateUser(req, res) {
    try {
        const userId = Number(req.params.id);

        const {
            name,
            email,
            password,
            role,
            is_active
        } = req.body;

        if (!userId) {
            return res.status(400).json({
                message: "Valid user ID is required"
            });
        }

        const userResult = await db.query(
            `
            SELECT id, name, email, is_active
            FROM Users
            WHERE id = $1
            `,
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (password !== undefined && password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const client = await db.connect();

        try {
            await client.query("BEGIN");

            let roleName = null;

            if (role) {
                const roleResult = await client.query(
                    `
                    SELECT id, name
                    FROM Roles
                    WHERE LOWER(name) = LOWER($1)
                    `,
                    [role]
                );

                if (roleResult.rows.length === 0) {
                    await client.query("ROLLBACK");

                    return res.status(400).json({
                        message: "Invalid role"
                    });
                }

                roleName = roleResult.rows[0].name;

                await client.query(
                    `
                    DELETE FROM UserRoles
                    WHERE user_id = $1
                    `,
                    [userId]
                );

                await client.query(
                    `
                    INSERT INTO UserRoles
                        (user_id, role_id)
                    VALUES
                        ($1, $2)
                    `,
                    [userId, roleResult.rows[0].id]
                );
            }

            let passwordHash = null;

            if (password) {
                passwordHash = await bcrypt.hash(password, 10);
            }

            if (
                name ||
                email ||
                passwordHash ||
                typeof is_active === "boolean"
            ) {
                await client.query(
                    `
                    UPDATE Users
                    SET
                        name = COALESCE($1, name),
                        email = COALESCE($2, email),
                        password_hash = COALESCE($3, password_hash),
                        is_active = COALESCE($4, is_active),
                        updated_at = NOW()
                    WHERE id = $5
                    `,
                    [
                        name || null,
                        email || null,
                        passwordHash,
                        typeof is_active === "boolean"
                            ? is_active
                            : null,
                        userId
                    ]
                );
            }

            await client.query("COMMIT");

            await createAuditLog({
                userId: req.user.userId,
                action: "UPDATE_USER",
                resource: `user:${userId}`,
                status: "SUCCESS",
                ipAddress: req.ip,
                details: {
                    updatedUserId: userId,
                    name,
                    email,
                    role: roleName,
                    passwordChanged: Boolean(password),
                    is_active
                }
            });

            return res.status(200).json({
                message: "User updated successfully"
            });

        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error("Update user error:", error);

        await createAuditLog({
            userId: req.user?.userId || null,
            action: "UPDATE_USER",
            resource: `user:${req.params.id}`,
            status: "FAILED",
            ipAddress: req.ip,
            details: {
                error: error.message
            }
        });

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


async function deleteUser(req, res) {
    const userId = Number(req.params.id);

    try {
        if (!userId) {
            return res.status(400).json({
                message: "Valid user ID is required"
            });
        }

        // Protect the main Admin account
        if (userId === 1) {
            return res.status(403).json({
                message: "The main Admin account cannot be deleted"
            });
        }

        const userResult = await db.query(
            `
            SELECT id, name, email
            FROM Users
            WHERE id = $1
            `,
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = userResult.rows[0];

        const client = await db.connect();

        try {
            await client.query("BEGIN");

            // Remove role assignments first
            await client.query(
                `
                DELETE FROM UserRoles
                WHERE user_id = $1
                `,
                [userId]
            );

            // Remove the user permanently
            await client.query(
                `
                DELETE FROM Users
                WHERE id = $1
                `,
                [userId]
            );

            await client.query("COMMIT");

        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }

        // Record deletion in audit log
        await createAuditLog({
            userId: req.user.userId,
            action: "DELETE_USER",
            resource: `user:${userId}`,
            status: "SUCCESS",
            ipAddress: req.ip,
            details: {
                deletedUserId: userId,
                name: user.name,
                email: user.email
            }
        });

        return res.status(200).json({
            message: "User permanently deleted successfully"
        });

    } catch (error) {
        console.error("Delete user error:", error);

        await createAuditLog({
            userId: req.user?.userId || null,
            action: "DELETE_USER",
            resource: `user:${userId}`,
            status: "FAILED",
            ipAddress: req.ip,
            details: {
                error: error.message
            }
        });

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};