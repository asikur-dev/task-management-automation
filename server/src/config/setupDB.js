const fs = require("fs");
const path = require("path");
const pool = require("./db");
async function setupDatabase() {
  try {
    const sqlPath = path.join(__dirname, "../sql/schema.sql");
    const sql = fs.readFileSync(sqlPath, "utf-8");

    const connection = await pool.getConnection();
    await connection.query(sql);
    connection.release();

    console.log("✅ Database setup complete.");
  } catch (error) {
    console.error("❌ Database setup failed:", error);
  } 
}

module.exports = setupDatabase;
