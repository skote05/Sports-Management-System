const express = require('express');
const router = express.Router();
const db = require('../db'); // Your DB connection setup

// Route to fetch all scheduled matches
router.get('/allschedules', async (req, res) => {
    try {
        const query = `
            SELECT 
                m.Match_ID, 
                t1.Team_name AS Team_A, 
                t2.Team_name AS Team_B, 
                s.Sport_name, 
                m.Date_of_match, 
                m.Location, 
                m.Score
            FROM \`Match\` m
            JOIN Match_Teams mt1 ON m.Match_ID = mt1.Match_ID
            JOIN Match_Teams mt2 ON m.Match_ID = mt2.Match_ID
            JOIN Team t1 ON mt1.Team_ID = t1.Team_ID
            JOIN Team t2 ON mt2.Team_ID = t2.Team_ID
            JOIN Sport s ON m.Sport_ID = s.Sport_ID
            ORDER BY m.Date_of_match, m.Location;
        `;

        const [matches] = await db.query(query);

        if (!matches || matches.length === 0) {
            return res.status(404).json({ message: 'No scheduled matches found.' });
        }

        return res.status(200).json({ matches });
    } catch (err) {
        console.error('Error fetching matches:', err);
        return res.status(500).json({ message: 'Error fetching scheduled matches. Please try again.' });
    }
});

// Route to schedule a game
router.post('/schedulegame', async (req, res) => {
    const { teamA_ID, teamB_ID, date, time, location, sport_ID } = req.body;

    console.log('Scheduling game with data:', req.body);

    // Validate required fields
    if (!teamA_ID || !teamB_ID || !date || !time || !location || !sport_ID) {
        console.log('Missing required fields');
        return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    try {
        // Conflict check: Check if either Team A or Team B are already scheduled to play at the same time and location
        const conflictQuery = `
            SELECT COUNT(*) AS conflict_count
            FROM \`Match\` m
            JOIN Match_Teams mtA ON m.Match_ID = mtA.Match_ID
            JOIN Match_Teams mtB ON m.Match_ID = mtB.Match_ID
            WHERE (mtA.Team_ID = ? OR mtB.Team_ID = ?)
            AND m.Date_of_match = ?
            AND m.Location = ?
        `;

        const [results] = await db.query(conflictQuery, [teamA_ID, teamB_ID, date, location]);

        if (results[0].conflict_count > 0) {
            console.log('One or both teams are already scheduled to play at this time and location.');
            return res.status(400).json({ message: 'One or both teams are already scheduled to play at this time and location.' });
        }

        // No conflict, proceed to insert the match into the `Match` table
        const insertMatchQuery = `
            INSERT INTO \`Match\` (Date_of_match, Location, Sport_ID)
            VALUES (?, ?, ?)
        `;
        const [insertMatchResult] = await db.query(insertMatchQuery, [date, location, sport_ID]);

        const match_ID = insertMatchResult.insertId;

        // Insert teams into the `Match_Teams` table
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
