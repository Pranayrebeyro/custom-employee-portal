const bcrypt = require("bcryptjs");

const db = require("../config/db");

const {
    generateToken
} = require("../utils/jwt");


// ============================================
// Get user with roles and permissions
// ============================================

async function getUserAuthorization(userId) {

    const result = await db.query(
        `
        SELECT
            u.id,
            u.name,
            u.email,
            u.is_active,

            COALESCE(
                ARRAY_AGG(DISTINCT r.name)
                FILTER (WHERE r.id IS NOT NULL),
                '{}'
            ) AS roles,

            COALESCE(
                ARRAY_AGG(DISTINCT p.name)
                FILTER (WHERE p.id IS NOT NULL),
                '{}'
            ) AS permissions

        FROM Users u

        LEFT JOIN UserRoles ur
            ON ur.user_id = u.id

        LEFT JOIN Roles r
            ON r.id = ur.role_id

        LEFT JOIN RolePermissions rp
            ON rp.role_id = r.id

        LEFT JOIN Permissions p
            ON p.id = rp.permission_id

        WHERE u.id = $1

        GROUP BY
            u.id,
            u.name,
            u.email,
            u.is_active
        `,
        [userId]
    );

    return result.rows[0];
}


// ============================================
// Login user
// ============================================

async function loginUser(email, password) {

    const result = await db.query(
        `
        SELECT
            id,
            name,
            email,
            password_hash,
            is_active

        FROM Users

        WHERE LOWER(email) = LOWER($1)
        `,
        [email]
    );


    // User does not exist
    if (result.rows.length === 0) {
        return null;
    }


    const user = result.rows[0];


    // User account disabled
    if (!user.is_active) {
        return null;
    }


    // Compare password with bcrypt hash
    const passwordMatch = await bcrypt.compare(
        password,
        user.password_hash
    );


    // Wrong password
    if (!passwordMatch) {
        return null;
    }


    // Get roles and permissions
    const authorization = await getUserAuthorization(
        user.id
    );


    // Generate JWT
    const token = generateToken({
        userId: authorization.id,
        email: authorization.email
    });


    return {
        token,
        user: authorization
    };
}


module.exports = {
    loginUser,
    getUserAuthorization
};