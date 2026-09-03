const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on("connect", async (client) => {
    await client.query("SET search_path TO public");
    console.log("Neon PostgreSQL connected");
});

pool.on("error", (error) => {
    console.error("Unexpected PostgreSQL error:", error);
});

module.exports = pool;