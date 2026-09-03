const axios = require("axios");
const { getZohoAccessToken } = require("./zohoAuthService");

require("dotenv").config();


async function zohoRequest({
    baseUrl,
    method = "GET",
    endpoint,
    params = {},
    data = {},
    headers = {}
}) {
    try {
        const accessToken = await getZohoAccessToken();

        const response = await axios({
            method,
            url: `${baseUrl}${endpoint}`,
            params,
            data,
            headers: {
                Authorization: `Zoho-oauthtoken ${accessToken}`,
                ...headers
            }
        });

        return response.data;

    } catch (error) {
        console.error(
            "Zoho API error:",
            error.response?.data || error.message
        );

        throw new Error("Zoho API request failed");
    }
}


/*
 * Zoho People
 */
async function getZohoPeople(endpoint, params = {}) {
    return zohoRequest({
        baseUrl: "https://people.zoho.com",
        endpoint,
        params
    });
}


/*
 * Zoho CRM
 */
async function getZohoCRM(endpoint, params = {}) {
    return zohoRequest({
        baseUrl: process.env.ZOHO_API_DOMAIN,
        endpoint,
        params
    });
}


/*
 * Zoho Desk
 *
 * Desk uses its own API domain and requires orgId.
 */
async function getZohoDesk(endpoint, params = {}) {
    return zohoRequest({
        baseUrl: "https://desk.zoho.com/api/v1",
        endpoint,
        params,
        headers: {
            orgId: process.env.ZOHO_DESK_ORG_ID
        }
    });
}


/*
 * Zoho Books
 */
async function getZohoBooks(endpoint, params = {}) {
    return zohoRequest({
        baseUrl: process.env.ZOHO_API_DOMAIN,
        endpoint,
        params
    });
}


module.exports = {
    zohoRequest,
    getZohoPeople,
    getZohoCRM,
    getZohoDesk,
    getZohoBooks
};