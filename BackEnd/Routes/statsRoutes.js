const express = require('express');
const db = require('../db'); // Import database connection
const router = express.Router();

// Get player and team stats combined from the view
router.get('/playerStats', async (req, res) => {
    const { loginId } = req.query; // Get loginId from the query string

    if (!loginId) {
        return res.status(400).json({ message: 'Login ID is required' });
    }

    console.log("Received loginId from frontend:", loginId);

    // Query to get player_id from logs_in table based on login_id
    const query = `
        SELECT player_id 
        FROM logs_in
        WHERE login_id = ?
    `;

    try {
        const [result] = await db.query(query, [loginId]);

        if (result.length > 0) {
            const playerId = result[0].player_id;

            // Query to get player stats and team stats from the PlayerTeamStats view
            const statsQuery = `
                SELECT * FROM PlayerTeamStats 
                WHERE Player_ID = ?
            `;
            const [statsResult] = await db.query(statsQuery, [playerId]);

            if (statsResult.length > 0) {
                console.log("Player stats retrieved:", statsResult[0]);  // Log the retrieved player stats
                res.json(statsResult[0]); // Send the stats and team info in the response
            } else {
                res.status(404).json({ message: 'Player stats not found' });
            }
        } else {
            res.status(404).json({ message: 'No player found for this login ID' });
        }
    } catch (err) {
        console.error('Error fetching player stats:', err);
        res.status(500).json({ message: 'Database error' });
    }
});

module.exports = router;
