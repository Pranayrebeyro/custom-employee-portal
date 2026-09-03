const express = require("express");

const authenticateToken = require("../middlewares/auth");
const authorizePermission = require("../middlewares/authorize");

const {
    getRoles,
    getPermissions,
    updateRolePermissions
} = require("../controllers/roleController");

const router = express.Router();

router.get(
    "/roles",
    authenticateToken,
    authorizePermission("admin:roles"),
    getRoles
);

router.get(
    "/permissions",
    authenticateToken,
    authorizePermission("admin:permissions"),
    getPermissions
);

router.put(
    "/roles/:id/permissions",
    authenticateToken,
    authorizePermission("admin:permissions"),
    updateRolePermissions
);

module.exports = router;