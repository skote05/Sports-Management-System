import React, { useState, useEffect } from 'react';
import './ScheduleManagement.css'; // Assuming you have a CSS file for styling

const ScheduleManagement = () => {
    const [teamA, setTeamA] = useState('');
    const [teamB, setTeamB] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [sportID, setSportID] = useState(1); // Assuming sport ID is 1 for now
    const [teams, setTeams] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch the teams from the backend when the component mounts
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/teams');
                const result = await response.json();
    
                if (response.status === 200 && result.teams) {
                    setTeams(result.teams);
                } else {
                    setErrorMessage('Error fetching teams.');
                }
            } catch (error) {
                setErrorMessage('Error fetching teams.');
            }
        };
    
        fetchTeams();
    }, []);
    

    const handleScheduleGame = async (e) => {
        e.preventDefault();
    
        if (!teamA || !teamB || !date || !time || !location || !sportID) {
            setErrorMessage('Please fill in all fields.');
            return;
        }
    
        const gameData = {
            teamA_ID: teamA,
            teamB_ID: teamB,
            date,
            time,
            location,
            sport_ID: sportID,
        };
    
        try {
            const response = await fetch('http://localhost:5001/api/schedulegame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gameData),
            });
    
            const result = await response.json();
            console.log(result); // Log the backend response for debugging
    
            if (response.status === 200) {
                setSuccessMessage('Game scheduled successfully!');
                setErrorMessage('');
            } else {
                // If there's a conflict or any other error, show the error message from the backend
                setErrorMessage(result.message || 'Error scheduling the game.');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Error scheduling the game. Please try again.');
            setSuccessMessage('');
            console.error('Error scheduling game:', error); // Log the error for debugging
        }
    };
    

    return (
        <div className="schedule-management-container">
            <h2>Schedule a New Game</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <form onSubmit={handleScheduleGame} className="schedule-form">
                <div className="form-group">
                    <label>Team A:</label>
                    <select
                        value={teamA}
                        onChange={(e) => setTeamA(e.target.value)}
                        required
                        className="form-control"
                    >
                        <option value="">Select Team A</option>
                        {teams.map((team) => (
                            <option key={team.Team_ID} value={team.Team_ID}>
                                {team.Team_Name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Team B:</label>
                    <select
                        value={teamB}
                        onChange={(e) => setTeamB(e.target.value)}
                        required
                        className="form-control"
                    >
                        <option value="">Select Team B</option>
                        {teams.map((team) => (
                            <option key={team.Team_ID} value={team.Team_ID}>
                                {team.Team_Name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Date:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Time:</label>
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Location:</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>

                <button type="submit" className="btn btn-primary">Schedule Game</button>
            </form>
        </div>
    );
};

export default ScheduleManagement;
