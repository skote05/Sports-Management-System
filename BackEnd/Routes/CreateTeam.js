// routes/CreateTeam.js

const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection

// Get all sports
router.get('/team/sports', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM Sport');
        res.json(results); // Return sports data
    } catch (err) {
        console.error('Error fetching sports:', err);
        res.status(500).json({ error: 'Error fetching sports' });
    }
});

router.get('/player/without-team', async (req, res) => {
    const { Sport_ID, Exclude_Player_Ids } = req.query;

    try {
        console.log('Received Sport_ID:', Sport_ID);

        // Validate the Sport_ID
        if (!Sport_ID || isNaN(Sport_ID)) {
            return res.status(400).json({ error: 'Invalid Sport_ID provided' });
        }

        // Exclude players already selected in the team (Exclude_Player_Ids is an array of Player_IDs)
        const queryParams = [Sport_ID];
        let queryString = `
            SELECT * 
            FROM Player
            WHERE Sport_ID = ?
        `;

        if (Exclude_Player_Ids && Exclude_Player_Ids.length > 0) {
            queryString += `
                AND Player_ID NOT IN (?);
            `;
            queryParams.push(Exclude_Player_Ids);
        }

        const [results] = await db.query(queryString, queryParams);

        if (results.length === 0) {
            console.log('No players found for this sport without a team');
            return res.json([]);  // Return an empty array if no players are found
        }

        // Return the list of players
        res.json(results);
    } catch (err) {
        console.error('Error fetching players:', err);
        res.status(500).json({ error: 'Error fetching players' });
    }
});
router.post('/player/without-team', async (req, res) => {
    const { Sport_ID, Exclude_Player_Ids } = req.body;  // Destructure from the request body

    try {
        console.log('Received Sport_ID:', Sport_ID);
        console.log('Exclude_Player_Ids:', Exclude_Player_Ids);  // Log to check if player IDs are being received

        // Validate the Sport_ID
        if (!Sport_ID || isNaN(Sport_ID)) {
            return res.status(400).json({ error: 'Invalid Sport_ID provided' });
        }

        // Exclude players already selected in the team (Exclude_Player_Ids is an array of Player_IDs)
        const queryParams = [Sport_ID];
        let queryString = `
            SELECT * 
            FROM Player
            WHERE Sport_ID = ?
        `;

        if (Exclude_Player_Ids && Exclude_Player_Ids.length > 0) {
            queryString += `
                AND Player_ID NOT IN (?);
            `;
            queryParams.push(Exclude_Player_Ids);
        }

        const [results] = await db.query(queryString, queryParams);

        if (results.length === 0) {
            console.log('No players found for this sport without a team');
            return res.json([]);  // Return an empty array if no players are found
        }

        // Return the list of players
        res.json(results);
    } catch (err) {
        console.error('Error fetching players:', err);
        res.status(500).json({ error: 'Error fetching players' });
    }
});

// Create team with players using the stored procedure
router.post('/team/create', async (req, res) => {
    const { Team_Name, Max_Team_Size, Sport_ID, Player_Ids } = req.body;

    try {
        // Prepare the SQL call to the stored procedure
        const [result] = await db.query(`
            CALL CreateTeamWithPlayers(?, ?, ?, ?);
        `, [Team_Name, Max_Team_Size, Sport_ID, JSON.stringify(Player_Ids)]);

        // The stored procedure returns the Team_ID
        const teamID = result[0].Team_ID;

        // Return the success message with Team_ID
        res.status(200).json({
            message: 'Team created successfully!',
            Team_ID: teamID
        });
    } catch (err) {
        console.error('Error creating team:', err);
        res.status(500).json({ error: 'Error creating team' });
    }
});


module.exports = router;
