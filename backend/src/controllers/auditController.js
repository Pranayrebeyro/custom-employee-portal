const { getAuditLogs } = require("../services/auditService");


async function getLogs(req, res) {
    try {
        const logs = await getAuditLogs();

        return res.status(200).json({
            message: "Audit logs retrieved successfully",
            logs
        });

    } catch (error) {
        console.error("Get audit logs error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


module.exports = {
    getLogs
};