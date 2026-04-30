const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

// 🔥 Test connection
(async () => {
  try {
    const conn = await db.getConnection();
    console.log("✅ Database connected successfully!");
    conn.release();
  } catch (err) {
    console.error("❌ DB ERROR FULL:", err);
  }
})();

module.exports = db;