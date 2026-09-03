const {
    getZohoPeople,
    getZohoCRM,
    getZohoDesk,
    getZohoBooks
} = require("../../services/zoho/zohoApiService");

const { createAuditLog } = require("../../services/auditService");


async function getPeople(req, res) {
    try {
        const data = await getZohoPeople(
    "/people/api/forms/employee/getRecords"
);

        await createAuditLog({
            userId: req.user.userId,
            action: "ZOHO_PEOPLE_ACCESS",
            resource: "Zoho People",
            status: "SUCCESS",
            ipAddress: req.ip,
            details: {
                endpoint: "/people/api/forms/employee/getRecords"
            }
        });

        return res.status(200).json({
            message: "Zoho People data retrieved successfully",
            data
        });

    } catch (error) {
        console.error("Zoho People controller error:", error);

        await createAuditLog({
            userId: req.user?.userId || null,
            action: "ZOHO_PEOPLE_ACCESS",
            resource: "Zoho People",
            status: "FAILED",
            ipAddress: req.ip,
            details: {
                endpoint: "/people/api/forms",
                error: error.message
            }
        });

        return res.status(500).json({
            message: "Unable to retrieve Zoho People data"
        });
    }
}


async function getCRM(req, res) {
    try {
        const data = await getZohoCRM("/crm/v8/org");

        await createAuditLog({
            userId: req.user.userId,
            action: "ZOHO_CRM_ACCESS",
            resource: "Zoho CRM",
            status: "SUCCESS",
            ipAddress: req.ip,
            details: {
                endpoint: "/crm/v8/org"
            }
        });

        return res.status(200).json({
            message: "Zoho CRM data retrieved successfully",
            data
        });

    } catch (error) {
        console.error("Zoho CRM controller error:", error);

        await createAuditLog({
            userId: req.user?.userId || null,
            action: "ZOHO_CRM_ACCESS",
            resource: "Zoho CRM",
            status: "FAILED",
            ipAddress: req.ip,
            details: {
                endpoint: "/crm/v8/org",
                error: error.message
            }
        });

        return res.status(500).json({
            message: "Unable to retrieve Zoho CRM data"
        });
    }
}


async function getDesk(req, res) {
    try {
        const data = await getZohoDesk("/agents");

        await createAuditLog({
            userId: req.user.userId,
            action: "ZOHO_DESK_ACCESS",
            resource: "Zoho Desk",
            status: "SUCCESS",
            ipAddress: req.ip,
            details: {
                endpoint: "/agents"
            }
        });

        return res.status(200).json({
            message: "Zoho Desk data retrieved successfully",
            data
        });

    } catch (error) {
        console.error("Zoho Desk controller error:", error);

        await createAuditLog({
            userId: req.user?.userId || null,
            action: "ZOHO_DESK_ACCESS",
            resource: "Zoho Desk",
            status: "FAILED",
            ipAddress: req.ip,
            details: {
                endpoint: "/agents",
                error: error.message
            }
        });

        return res.status(500).json({
            message: "Unable to retrieve Zoho Desk data"
        });
    }
}


async function getBooks(req, res) {
    try {
        const data = await getZohoBooks("/books/v3/organizations");

        await createAuditLog({
            userId: req.user.userId,
            action: "ZOHO_BOOKS_ACCESS",
            resource: "Zoho Books",
            status: "SUCCESS",
            ipAddress: req.ip,
            details: {
                endpoint: "/books/v3/organizations"
            }
        });

        return res.status(200).json({
            message: "Zoho Books data retrieved successfully",
            data
        });

    } catch (error) {
        console.error("Zoho Books controller error:", error);

        await createAuditLog({
            userId: req.user?.userId || null,
            action: "ZOHO_BOOKS_ACCESS",
            resource: "Zoho Books",
            status: "FAILED",
            ipAddress: req.ip,
            details: {
                endpoint: "/books/v3/organizations",
                error: error.message
            }
        });

        return res.status(500).json({
            message: "Unable to retrieve Zoho Books data"
        });
    }
}


module.exports = {
    getPeople,
    getCRM,
    getDesk,
    getBooks
};