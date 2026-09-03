const { loginUser } = require("../services/authService");
const { createAuditLog } = require("../services/auditService");


async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            await createAuditLog({
                action: "LOGIN",
                resource: "authentication",
                status: "FAILED",
                ipAddress: req.ip,
                details: {
                    reason: "Email and password are required"
                }
            });

            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const result = await loginUser(email, password);

        if (!result) {
            await createAuditLog({
                action: "LOGIN",
                resource: "authentication",
                status: "FAILED",
                ipAddress: req.ip,
                details: {
                    email
                }
            });

            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        await createAuditLog({
            userId: result.user.id,
            action: "LOGIN",
            resource: "authentication",
            status: "SUCCESS",
            ipAddress: req.ip,
            details: {
                email: result.user.email
            }
        });

        return res.status(200).json({
            message: "Login successful",
            token: result.token,
            user: result.user
        });

    } catch (error) {
        console.error("Login controller error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


module.exports = {
    login
};