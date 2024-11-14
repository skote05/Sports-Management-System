// Fetches teams for dropdown in the schedule backend work
const express = require('express');
const router = express.Router();
const db = require('../db');

// Route to fetch all teams
router.get('/teams', async (req, res) => {
    try {
        console.log('Fetching teams...');
        const [teams] = await db.query('SELECT Team_ID, Team_Name FROM Team');
        console.log('Teams fetched:', teams);

        if (teams.length === 0) {
            console.log('No teams found');
            return res.status(404).json({ message: 'No teams found' });
        }

        return res.status(200).json({ teams });
    } catch (err) {
        console.error('Error fetching teams:', err);
        return res.status(500).json({ message: 'Error fetching teams' });
    }
});

module.exports = router;
