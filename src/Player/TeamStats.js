// src/TeamStats.js
import React, { useState, useEffect } from 'react';
import './TeamStats.css';

const TeamStats = () => {
    const [teamStats, setTeamStats] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const playerId = localStorage.getItem('playerId');

        if (!playerId) {
            setError('Player ID not found. Please log in again.');
            setLoading(false);
            return;
        }

        // Fetch team stats for the player
        fetch(`http://localhost:5001/api/teamstats/${playerId}`)
            .then(response => response.json())
            .then(data => {
                setTeamStats(data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch team stats');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading team stats...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="team-stats">
            <h2 className="stats-title">Team Stats</h2>
            {teamStats && (
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
                                <td>Team Name</td>
                                <td>{teamStats.Team_name}</td>
                            </tr>
                            <tr>
                                <td>Sport</td>
                                <td>{teamStats.Sport_Name}</td>
                            </tr>
                            <tr>
                                <td>Wins</td>
                                <td>{teamStats.Wins}</td>
                            </tr>
                            <tr>
                                <td>Points Scored</td>
                                <td>{teamStats.Points_scored}</td>
                            </tr>
                            <tr>
                                <td>Goals Scored</td>
                                <td>{teamStats.Goals_scored}</td>
                            </tr>
                            <tr>
                                <td>Stat Type</td>
                                <td>{teamStats.Stat_Type}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TeamStats;
