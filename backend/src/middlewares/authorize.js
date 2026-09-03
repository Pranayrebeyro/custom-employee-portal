const db = require("../config/db");

function authorizePermission(requiredPermission) {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.userId) {
                return res.status(401).json({
                    message: "Authentication required"
                });
            }

            const result = await db.query(
                `
                SELECT 1
                FROM UserRoles ur
                JOIN RolePermissions rp
                    ON rp.role_id = ur.role_id
                JOIN Permissions p
                    ON p.id = rp.permission_id
                WHERE ur.user_id = $1
                  AND p.name = $2
                LIMIT 1
                `,
                [req.user.userId, requiredPermission]
            );

            if (result.rows.length === 0) {
                return res.status(403).json({
                    message: "You do not have permission to access this resource"
                });
            }

            next();
        } catch (error) {
            console.error("Authorization error:", error);

            return res.status(500).json({
                message: "Internal server error"
            });
        }
    };
}

module.exports = authorizePermission;