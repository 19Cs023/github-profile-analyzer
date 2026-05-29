const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'github_analyzer',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
pool.getConnection()
    .then(connection => {
        console.log('Successfully connected to MySQL Database!');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to the database:', err.message);
        console.error('Please make sure MySQL is running and configuring in .env file.');
    });

module.exports = pool;
