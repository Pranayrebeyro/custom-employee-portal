const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");
const zohoRoutes = require("./src/routes/zohoRoutes");
const authenticateToken = require("./src/middlewares/auth");
const authorizePermission = require("./src/middlewares/authorize");
const adminRoutes = require("./src/routes/adminRoutes");
const roleRoutes = require("./src/routes/roleRoutes");

const app = express();


// ============================================
// Middleware
// ============================================

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json());


// ============================================
// Health check
// ============================================

app.get("/api/health", (req, res) => {

    res.status(200).json({
        status: "success",
        message: "Employee Portal API is running"
    });

});

app.get("/api/protected-test", authenticateToken, (req, res) => {

    res.status(200).json({
        message: "Protected route accessed successfully",
        user: req.user
    });

});

app.get(
    "/api/rbac-test",
    authenticateToken,
    authorizePermission("portal:read"),
    (req, res) => {
        res.status(200).json({
            message: "RBAC authorization successful",
            user: req.user
        });
    }
);


// ============================================
// Authentication routes
// ============================================

app.use("/api/auth", authRoutes);
app.use("/api/zoho", zohoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", roleRoutes);


// ============================================
// 404 handler
// ============================================

app.use((req, res) => {

    res.status(404).json({
        message: "Route not found"
    });

});


// ============================================
// Start server
// ============================================

const PORT = process.env.PORT || 5000;


app.listen(PORT, "0.0.0.0", () => {
    console.log(`Employee Portal API running on port ${PORT}`);
});