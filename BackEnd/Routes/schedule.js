const express = require('express');
const router = express.Router();
const db = require('../db');  // Ensure this points to your MySQL connection setup file

// Route to schedule a game
router.post('/schedulegame', async (req, res) => {
    const { teamA_ID, teamB_ID, date, time, location, sport_ID } = req.body;

    console.log('Scheduling game with data:', req.body);

    if (!teamA_ID || !teamB_ID || !date || !time || !location || !sport_ID) {
        console.log('Missing required fields');
        return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    try {
        // Check for conflict: two teams already playing at the same time and location
        const conflictQuery = `
            SELECT COUNT(*) AS conflict_count
            FROM Match_Teams mt
            JOIN \`Match\` m ON mt.Match_ID = m.Match_ID
            WHERE mt.Team_ID IN (?, ?)
            AND m.Date_of_match = ?
            AND m.Location = ?
        `;
        
        const [results] = await db.query(conflictQuery, [teamA_ID, teamB_ID, date, location]);

        if (results[0].conflict_count > 0) {
            console.log('Schedule conflict detected');
            return res.status(400).json({ message: 'Slots or Teams are booked' });
        }

        // If no conflict, proceed to insert the match into the `Match` table
        const insertMatchQuery = `
            INSERT INTO \`Match\` (Date_of_match, Location, Sport_ID)
            VALUES (?, ?, ?)
        `;
        const [insertMatchResult] = await db.query(insertMatchQuery, [date, location, sport_ID]);

        // Insert the teams into the `Match_Teams` table
        const match_ID = insertMatchResult.insertId;
        const insertTeamsQuery = `
            INSERT INTO Match_Teams (Match_ID, Team_ID)
            VALUES (?, ?), (?, ?)
        `;
        await db.query(insertTeamsQuery, [match_ID, teamA_ID, match_ID, teamB_ID]);

        console.log('Game scheduled successfully');
        return res.status(200).json({ message: 'Game scheduled successfully!' });

    } catch (err) {
        console.error('Error scheduling game:', err);
        return res.status(500).json({ message: 'Error scheduling the game. Please try again.' });
    }
});

module.exports = router;
