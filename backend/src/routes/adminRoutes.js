const express = require("express");

const authenticateToken = require("../middlewares/auth");
const authorizePermission = require("../middlewares/authorize");
const { getLogs } = require("../controllers/auditController");

const {
    getUsers,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/adminController");


const router = express.Router();


/*
 * Get all users
 */
router.get(
    "/users",
    authenticateToken,
    authorizePermission("admin:users"),
    getUsers
);


/*
 * Create a new user
 */
router.post(
    "/users",
    authenticateToken,
    authorizePermission("admin:users"),
    createUser
);


/*
 * Update a user
 */
router.put(
    "/users/:id",
    authenticateToken,
    authorizePermission("admin:users"),
    updateUser
);


/*
 * Deactivate a user
 */
router.delete(
    "/users/:id",
    authenticateToken,
    authorizePermission("admin:users"),
    deleteUser
);

/*
 * Get audit logs
 */
router.get(
    "/audit-logs",
    authenticateToken,
    authorizePermission("admin:audit"),
    getLogs
);


module.exports = router;