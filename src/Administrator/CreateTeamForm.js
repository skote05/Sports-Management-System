import React, { useState, useEffect } from 'react';
import './CreateTeamForm.css';

const CreateTeamForm = () => {
    const [teamName, setTeamName] = useState('');
    const [maxTeamSize, setMaxTeamSize] = useState('');
    const [sportId, setSportId] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState(null); // Track selected player
    const [selectedPlayers, setSelectedPlayers] = useState([]); // Track added players
    const [playerList, setPlayerList] = useState([]);
    const [sportList, setSportList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch sports when component mounts
    useEffect(() => {
        const fetchSports = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/team/sports');
                if (!response.ok) {
                    throw new Error(`Error fetching sports: ${response.statusText}`);
                }
                const sports = await response.json();
                setSportList(sports);
            } catch (error) {
                console.error("Error fetching sports:", error);
                setErrorMessage(`Error fetching sports: ${error.message}`);
            }
        };

        fetchSports();
    }, []);

    // Fetch players without a team based on selected sport
    useEffect(() => {
        if (sportId) {
            const fetchPlayers = async () => {
                try {
                    const response = await fetch(`http://localhost:5001/api/player/without-team?Sport_ID=${sportId}`);
                    if (!response.ok) {
                        throw new Error(`Error fetching players: ${response.statusText}`);
                    }

                    const result = await response.json();
                    if (Array.isArray(result)) {
                        setPlayerList(result);
                    } else {
                        setPlayerList([]);
                        setErrorMessage(result.error || "Failed to fetch players");
                    }
                } catch (error) {
                    console.error("Error fetching players:", error);
                    setPlayerList([]);
                    setErrorMessage("Error fetching players. Please try again later.");
                }
            };

            fetchPlayers();
        }
    }, [sportId]);

    // Handle player selection
    const handlePlayerSelect = (e) => {
        const playerId = e.target.value;
        const player = playerList.find(p => p.Player_ID === parseInt(playerId));  // Find the player object
        setSelectedPlayer(player);  // Store the full player object
    };

    // Add player to the selected players list when "Add Player" is clicked
    const handleAddPlayer = () => {
        if (selectedPlayer && !selectedPlayers.find(p => p.Player_ID === selectedPlayer.Player_ID)) {
            setSelectedPlayers([...selectedPlayers, selectedPlayer]); // Add player to list
            setSelectedPlayer(null); // Clear selected player dropdown
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!teamName || !maxTeamSize || !sportId || selectedPlayers.length === 0) {
            setErrorMessage('Please fill in all fields.');
            setSuccessMessage('');
            return;
        }

        const teamData = {
            Team_Name: teamName,
            Max_Team_Size: maxTeamSize,
            Sport_ID: sportId,
            Player_Ids: selectedPlayers.map(player => player.Player_ID), // Only send player IDs to backend
        };

        try {
            const response = await fetch('http://localhost:5001/api/team/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(teamData),
            });

            const result = await response.json();

            if (response.status === 200) {
                setSuccessMessage('Team created successfully! Team ID: ' + result.Team_ID);
                setErrorMessage('');
            } else {
                setErrorMessage(result.error || 'Failed to create team');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Error creating team. Please try again later.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="create-team-form">
            <h2>Create Team</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Team Name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max Team Size"
                    value={maxTeamSize}
                    onChange={(e) => setMaxTeamSize(e.target.value)}
                />
                <select value={sportId} onChange={(e) => setSportId(e.target.value)}>
                    <option value="">Select Sport</option>
                    {sportList.map((sport) => (
                        <option key={sport.Sport_ID} value={sport.Sport_ID}>
                            {sport.Sport_Name}
                        </option>
                    ))}
                </select>

                {/* Player selection dropdown */}
                {sportId && Array.isArray(playerList) && playerList.length > 0 ? (
                    <div>
                        <select value={selectedPlayer?.Player_ID || ''} onChange={handlePlayerSelect}>
                            <option value="">Select Player</option>
                            {playerList.map((player) => (
                                <option key={player.Player_ID} value={player.Player_ID}>
                                    {player.Player_Name}
                                </option>
                            ))}
                        </select>
                        <button type="button" onClick={handleAddPlayer}>Add Player</button>
                    </div>
                ) : (
                    <p>No players available</p>
                )}

                {/* Show selected players */}
                <div>
                    <h4>Selected Players:</h4>
                    {selectedPlayers.map((player) => (
                        <div key={player.Player_ID} className="selected-players">
                            {player.Player_Name} - {player.Position}
                        </div>
                    ))}
                </div>

                <button type="submit">Create Team</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
    );
};

export default CreateTeamForm;
