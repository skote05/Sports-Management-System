// registerbackend.js
const express = require('express');
const db = require('../db'); // Import database connection
const router = express.Router();

// Middleware to parse JSON requests
router.use(express.json());

// Route to handle player registration
router.post('/register', async (req, res) => {
    const { username, password, email, phone_no, dob, gender } = req.body;

    // Basic validation
    if (!username || !password || !email || !phone_no || !dob || !gender) {
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

        const userId = insertLoginResult.insertId; // Get the inserted User_ID from Login table

        // Step 3: Insert into the Player table, using the User_ID
        const [insertPlayerResult] = await connection.query(
            'INSERT INTO Player (Player_Name, Email, Phone_no, DOB, Gender, User_ID) VALUES (?, ?, ?, ?, ?, ?)',
            [username, email, phone_no, dob, gender, userId]
        );

        // Step 4: Commit the transaction if both queries succeed
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
