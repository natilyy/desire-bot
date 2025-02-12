const mysql = require('mysql2');

// Create a MySQL connection pool (better for performance)
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "desire_rp",
  waitForConnections: true,
  connectionLimit: 10, // Adjust as needed
  queueLimit: 0
});

// Export the promise-based pool (async/await support)
const db = pool.promise();
module.exports = db;