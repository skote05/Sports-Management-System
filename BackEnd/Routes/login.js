// login.js
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

    if (!username || !password || !accountType) {
        return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    const query = `SELECT * FROM Login WHERE Username = ? AND Password = ? AND Account_Type = ?`;

    try {
        const [result] = await db.query(query, [username, password, accountType]);

        if (result.length > 0) {
            res.json({ message: `Logged in as ${accountType}`, user: result[0] });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Database error' });
    }
});

module.exports = router;
