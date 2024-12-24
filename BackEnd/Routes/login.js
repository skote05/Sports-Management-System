const express = require('express');
const db = require('../db'); // Import database connection
const router = express.Router();

// Enable CORS
const cors = require('cors');
const app = express();
app.use(cors()); // Allow all origins (you can restrict it later for production)

// Middleware to parse JSON requests
router.use(express.json());

// Route to handle player and admin login
router.post('/login', async (req, res) => {
    const { username, password, accountType } = req.body;

    // Log the received data in the request body
    console.log('Received login request:', { username, password, accountType });

    if (!username || !password || !accountType) {
        console.log('Missing required fields');
        return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    const query = `SELECT * FROM Login WHERE Username = ? AND Password = ? AND Account_Type = ?`;

    // Log the SQL query and its parameters before execution
    console.log('Executing query:', query, [username, password, accountType]);

    try {
        const [result] = await db.query(query, [username, password, accountType]);

        // Log the query result (it will be an array of rows)
        console.log('Query result:', result);

        if (result.length > 0) {
            const user = result[0];  // Assuming this gets the first matching user

            // Log the login ID and username in the backend terminal
            console.log(`Login successful! ID: ${user.ID}, Username: ${user.Username}`);

            // Send the response to the client
            res.json({
                message: `Logged in as ${accountType}`,
                user: {
                    Login_ID: user.ID,   // Send the Login_ID from the Login table
                    Username: user.Username,
                    Account_Type: user.Account_Type,
                }
            });
        } else {
            console.log('Invalid credentials');
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Database error' });
    }
});

module.exports = router;
