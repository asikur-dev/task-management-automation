const fs = require("fs");
const path = require("path");
const pool = require("./config/db");
const setupDatabase = require("./config/setupDB");

async function seedDatabase() {
  try {
    const sqlPath = path.join(__dirname, "./sql/seed.sql");
    console.log("📂 SQL file path:", sqlPath);

    if (!fs.existsSync(sqlPath)) {
      throw new Error("❌ SQL file not found!");
    }

    const sql = fs.readFileSync(sqlPath, "utf-8");
    const queries = sql.split(";").filter((q) => q.trim().length > 0); // Split queries safely

    const connection = await pool.getConnection();
    await connection.query("SET FOREIGN_KEY_CHECKS = 0;"); // Disable constraints for MySQL

    for (const query of queries) {
      console.log("🔹 Executing:", query.substring(0, 50) + "..."); // Log first 50 characters of query
      try {
        await connection.query(query);
      } catch (queryError) {
        console.error("❌ Query failed:", queryError);
      }
    }

    await connection.query("SET FOREIGN_KEY_CHECKS = 1;"); // Re-enable constraints
    connection.release();
    console.log("✅ Database seeding complete.");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
  } finally {
    process.exit();
  }
}

async function main() {
  await seedDatabase();
}

main();
