const express = require("express");

const authenticateToken = require("../middlewares/auth");
const authorizePermission = require("../middlewares/authorize");

const {
    getPeople,
    getCRM,
    getDesk,
    getBooks
} = require("../controllers/zoho/zohoController");

const router = express.Router();

router.get(
    "/people",
    authenticateToken,
    authorizePermission("zoho:people"),
    getPeople
);

router.get(
    "/crm",
    authenticateToken,
    authorizePermission("zoho:crm"),
    getCRM
);

router.get(
    "/desk",
    authenticateToken,
    authorizePermission("zoho:desk"),
    getDesk
);

router.get(
    "/books",
    authenticateToken,
    authorizePermission("zoho:books"),
    getBooks
);

module.exports = router;