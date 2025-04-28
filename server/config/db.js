import mysql from "mysql2/promise";
const pool = mysql.createPool({
  connectionLimit: process.env.DB_CONN_LIMIT || 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

// Test the connection only in development
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connection established successfully");
    connection.release();
  } catch (error) {
    console.error("❌ Error connecting to the database:", error);
    // Optional: exit the process if connection fails during dev
    process.exit(1);
  }
}

// Only test if in development
if (process.env.NODE_ENV === "development") {
  await testConnection();
}

export default {
  query: async (sql, params) => {
    try {
      const [results] = await pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error("Query error:", error);
      throw error;
    }
  },

  // Get a single row
  getOne: async (sql, params) => {
    try {
      const [rows] = await pool.execute(sql, params);
      return rows[0] || null;
    } catch (error) {
      console.error("GetOne error:", error);
      throw error;
    }
  },

  // Close the pool (useful for graceful shutdown)
  closePool: async () => {
    try {
      await pool.end();
      console.log("Pool connections closed");
    } catch (error) {
      console.error("Error closing pool connections:", error);
      throw error;
    }
  },
};
