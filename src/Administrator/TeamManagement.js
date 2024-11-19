import React, { useState } from 'react';
import './TeamManagement.css';
const TeamManagement = () => {
  const [teamData, setTeamData] = useState({
    name: '',
    sportId: '',
    players: '',
    coach: ''
  });
  const [message, setMessage] = useState('');
  const [teamsList, setTeamsList] = useState([]); // Store the list of all teams

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamData({ ...teamData, [name]: value });
  };

  // Submit handler to add a team
  const handleSubmit = (e) => {
    e.preventDefault();

    const newTeam = {
      id: teamsList.length + 1, // Generate a simple ID for demonstration
      ...teamData,
      players: teamData.players.split(',').map((player) => player.trim()) // Split players by commas
    };

    setTeamsList([...teamsList, newTeam]);
    setMessage(`Team "${teamData.name}" added successfully!`);
    setTeamData({ name: '', sportId: '', players: '', coach: '' }); // Clear the form
  };

  return (
    <div>
      <h2>Add a Team</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={teamData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Sport ID:</label>
          <input
            type="number"
            name="sportId"
            value={teamData.sportId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Players (comma-separated):</label>
          <input
            type="text"
            name="players"
            value={teamData.players}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Coach:</label>
          <input
            type="text"
            name="coach"
            value={teamData.coach}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Team</button>
      </form>

      <div>{message && <p>{message}</p>}</div>

      
    </div>
  );
};

export default TeamManagement;