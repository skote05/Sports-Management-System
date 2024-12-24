import React, { useState, useEffect } from 'react';
import './PlayerStats.css';

const PlayerStats = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loginId = localStorage.getItem('loginId');

        if (!loginId) {
            setError('Login ID not found. Please log in again.');
            setLoading(false);
            return;
        }

        // Fetch player stats based on loginId
        const fetchPlayerStats = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/playerStats?loginId=${loginId}`);
                const result = await response.json();

                if (response.status === 200) {
                    setStats(result);  // Assuming the response contains player stats
                    setLoading(false);
                } else {
                    setError('Error fetching player stats.');
                    setLoading(false);
                }
            } catch (err) {
                setError('Error fetching player stats. Please try again later.');
                setLoading(false);
            }
        };

        fetchPlayerStats();
    }, []);

    if (loading) {
        return <div>Loading stats...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="player-stats">
            <h2 className="stats-title">Player Stats</h2>
            <div className="stats-card">
                <table className="stats-table">
                    <thead>
                        <tr>
                            <th>Stat</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Player Name</td>
                            <td>{stats.Player_Name}</td>
                        </tr>
                        <tr>
                            <td>Team</td>
                            <td>{stats.Team_name}</td>
                        </tr>
                        <tr>
                            <td>Sport</td>
                            <td>{stats.Sport_Name}</td>
                        </tr>
                        <tr>
                            <td>Wins</td>
                            <td>{stats.Wins}</td>
                        </tr>
                        <tr>
                            <td>Points Scored</td>
                            <td>{stats.Points_scored}</td>
                        </tr>
                        <tr>
                            <td>Goals Scored</td>
                            <td>{stats.Goals_scored}</td>
                        </tr>
                        <tr>
                            <td>Stat Type</td>
                            <td>{stats.Stat_Type}</td>
                        </tr>
                    </tbody>
                </table>
                <button 
                    className="team-stats-btn"
                    onClick={() => window.location.href = '/teamstats'} 
                >
                    View Team Stats
                </button>
            </div>
        </div>
    );
};

export default PlayerStats;
