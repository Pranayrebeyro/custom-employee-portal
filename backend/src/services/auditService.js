const db = require("../config/db");


async function createAuditLog({
    userId = null,
    action,
    resource = null,
    status,
    ipAddress = null,
    details = {}
}) {
    try {
        await db.query(
            `
            INSERT INTO AuditLogs
                (
                    user_id,
                    action,
                    resource,
                    status,
                    ip_address,
                    details
                )
            VALUES
                ($1, $2, $3, $4, $5, $6)
            `,
            [
                userId,
                action,
                resource,
                status,
                ipAddress,
                details
            ]
        );
    } catch (error) {
        console.error("Audit log error:", error);
    }
}


async function getAuditLogs() {
    const result = await db.query(
        `
        SELECT
            al.id,
            al.user_id,
            u.name AS user_name,
            u.email AS user_email,
            al.action,
            al.resource,
            al.status,
            al.ip_address,
            al.details,
            al.created_at
        FROM AuditLogs al
        LEFT JOIN Users u
            ON u.id = al.user_id
        ORDER BY al.created_at DESC
        `
    );

    return result.rows;
}


module.exports = {
    createAuditLog,
    getAuditLogs
};