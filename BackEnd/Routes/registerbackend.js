const express = require('express');
const db = require('../db'); // Import database connection
const router = express.Router();

// Middleware to parse JSON requests
router.use(express.json());

// Route to fetch all sports
router.get('/sports', async (req, res) => {
    const connection = await db.getConnection();
    try {
        const [sports] = await connection.query('SELECT * FROM Sport');
        res.status(200).json({ sports }); // Return the sports list
    } catch (err) {
        console.error('Error fetching sports:', err);
        res.status(500).json({ message: 'Error fetching sports.' });
    } finally {
        connection.release();
    }
});

// Route to handle player registration
router.post('/register', async (req, res) => {
    const { username, password, email, phone_no, dob, gender, sport_id } = req.body;

    // Basic validation
    if (!username || !password || !email || !phone_no || !dob || !gender || !sport_id) {
        return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    const connection = await db.getConnection(); // Get a connection from the pool
    try {
        await connection.beginTransaction(); // Begin transaction

        // Step 1: Check if the username already exists in the Login table
        const [checkResult] = await connection.query('SELECT * FROM Login WHERE Username = ?', [username]);
        if (checkResult.length > 0) {
            await connection.rollback(); // Rollback transaction if username exists
            return res.status(400).json({ message: 'Username already exists.' });
        }

        // Step 2: Insert new user into the Login table
        const [insertLoginResult] = await connection.query(
            'INSERT INTO Login (Username, Password, Account_Type) VALUES (?, ?, ?)',
            [username, password, 'player']
        );

        const loginId = insertLoginResult.insertId; // Get the inserted login ID from Login table

        // Step 3: Insert new player into the Player table with Sport_ID
        const [insertPlayerResult] = await connection.query(
            'INSERT INTO Player (Player_Name, Email, Phone_no, DOB, Gender, Sport_ID) VALUES (?, ?, ?, ?, ?, ?)',
            [username, email, phone_no, dob, gender, sport_id]
        );

        const playerId = insertPlayerResult.insertId; // Get the inserted player ID from Player table

        // Step 4: Insert into logs_in table to link player with login
        await connection.query(
            'INSERT INTO logs_in (login_id, player_id) VALUES (?, ?)',
            [loginId, playerId]
        );

        // Step 5: Commit the transaction if all queries succeed
        await connection.commit(); // Commit transaction
        res.status(201).json({ message: 'Registration successful!' });

    } catch (err) {
        await connection.rollback(); // Rollback transaction in case of an error
        console.error('Error during registration:', err);
        res.status(500).json({ message: 'Error during registration.' });
    } finally {
        connection.release(); // Release the connection back to the pool
    }
});


module.exports = router;
