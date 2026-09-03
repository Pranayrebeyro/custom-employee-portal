const db = require("../config/db");
const { createAuditLog } = require("../services/auditService");

async function getRoles(req, res) {
    try {
        const result = await db.query(`
            SELECT
                r.id,
                r.name,
                r.description,
                COALESCE(
                    ARRAY_AGG(p.name)
                    FILTER (WHERE p.id IS NOT NULL),
                    '{}'
                ) AS permissions
            FROM Roles r
            LEFT JOIN RolePermissions rp
                ON rp.role_id = r.id
            LEFT JOIN Permissions p
                ON p.id = rp.permission_id
            GROUP BY
                r.id,
                r.name,
                r.description
            ORDER BY r.id
        `);

        return res.status(200).json({
            message: "Roles retrieved successfully",
            roles: result.rows
        });

    } catch (error) {
        console.error("Get roles error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


async function getPermissions(req, res) {
    try {
        const result = await db.query(`
            SELECT
                id,
                name,
                description
            FROM Permissions
            ORDER BY id
        `);

        return res.status(200).json({
            message: "Permissions retrieved successfully",
            permissions: result.rows
        });

    } catch (error) {
        console.error("Get permissions error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


async function updateRolePermissions(req, res) {
    const roleId = Number(req.params.id);
    const { permissionIds } = req.body;

    if (!roleId) {
        return res.status(400).json({
            message: "Valid role ID is required"
        });
    }

    if (!Array.isArray(permissionIds)) {
        return res.status(400).json({
            message: "permissionIds must be an array"
        });
    }

    const client = await db.connect();

    try {
        await client.query("BEGIN");

        const roleResult = await client.query(
            `
            SELECT id, name
            FROM Roles
            WHERE id = $1
            `,
            [roleId]
        );

        if (roleResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Role not found"
            });
        }

        if (permissionIds.length > 0) {
            const permissionResult = await client.query(
                `
                SELECT id
                FROM Permissions
                WHERE id = ANY($1::int[])
                `,
                [permissionIds]
            );

            if (
                permissionResult.rows.length !==
                permissionIds.length
            ) {
                await client.query("ROLLBACK");

                return res.status(400).json({
                    message: "One or more permission IDs are invalid"
                });
            }
        }

        await client.query(
            `
            DELETE FROM RolePermissions
            WHERE role_id = $1
            `,
            [roleId]
        );

        if (permissionIds.length > 0) {

            await client.query(
                `
                INSERT INTO RolePermissions
                    (role_id, permission_id)
                SELECT
                    $1,
                    UNNEST($2::int[])
                `,
                [roleId, permissionIds]
            );
        }

        await client.query("COMMIT");

        await createAuditLog({
            userId: req.user.userId,
            action: "UPDATE_ROLE_PERMISSIONS",
            resource: `role:${roleId}`,
            status: "SUCCESS",
            ipAddress: req.ip,
            details: {
                roleId,
                roleName: roleResult.rows[0].name,
                permissionIds
            }
        });

        return res.status(200).json({
            message: "Role permissions updated successfully"
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "Update role permissions error:",
            error
        );

        await createAuditLog({
            userId: req.user?.userId || null,
            action: "UPDATE_ROLE_PERMISSIONS",
            resource: `role:${roleId}`,
            status: "FAILED",
            ipAddress: req.ip,
            details: {
                error: error.message
            }
        });

        return res.status(500).json({
            message: "Internal server error"
        });

    } finally {
        client.release();
    }
}


module.exports = {
    getRoles,
    getPermissions,
    updateRolePermissions
};