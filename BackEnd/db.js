const mysql = require('mysql2/promise');  // Import promise version of mysql2

// Create a connection pool
const db = mysql.createPool({
    host: 'localhost',  // Your MySQL host
    user: 'root',       // Your MySQL username
    password: 'your_password',  // Your MySQL password
    database: 'sports_management_system',  // Your database name
    waitForConnections: true,  // Allows waiting for idle connections
    connectionLimit: 10,  // The maximum number of connections
    queueLimit: 0  // No limit on the queue size
});

// Simple test to check if the connection pool works
db.query('SELECT 1')
    .then(() => console.log('Successfully connected to the database!'))
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

module.exports = db;
