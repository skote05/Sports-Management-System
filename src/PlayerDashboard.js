import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import './PlayerDashboard.css'; // Import the CSS for the dashboard styling

const PlayerDashboard = () => {
    const navigate = useNavigate(); // Initialize navigate function
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // State for profile modal visibility
    const [userData, setUserData] = useState({
        username: localStorage.getItem('username') || '', // Get username from localStorage
        email: localStorage.getItem('email') || '', // Assuming you store the email
    });
    const [teamStats, setTeamStats] = useState(null); // State for team stats

    // Function to handle "View Stats" button click
    const handleViewStatsClick = () => {
        navigate('/playerstats'); // Navigate to PlayerStats page
    };

    // Function to handle "Make Payments" button click
    const handleMakePaymentClick = () => {
      navigate('/paymentprocessing'); // Navigate to the PaymentProcessing page
    };

    const handleViewScheduleClick = () => {
        navigate('/scheduleview'); // Navigate to PlayerStats page
    };
    

    // Function to handle "View Team Stats" button click
    const handleViewTeamStatsClick = () => {
        const playerStats = JSON.parse(localStorage.getItem('playerStats'));
        if (playerStats) {
            setTeamStats(playerStats); // Set team stats from localStorage
        }
    };

    // Function to handle profile modal toggle
    const handleProfileClick = () => {
        setIsProfileModalOpen(true); // Open profile modal
    };

    const closeProfileModal = () => {
        setIsProfileModalOpen(false); // Close profile modal
    };

    const handleBackgroundClick = (e) => {
        if (e.target.classList.contains('profile-modal')) {
            closeProfileModal(); // Close modal if background is clicked
        }
    };

    const handleLogout = () => {
        // Clear localStorage and reset userData
        setUserData({ username: '', email: '' });
        localStorage.removeItem('username');
        localStorage.removeItem('playerId');
        localStorage.removeItem('playerStats');
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className="player-dashboard">
            {/* Navbar */}
            <div className="navbar">
                <h1 className="navbar-title">Sports Management System</h1>
                <div className="profile-icon" onClick={handleProfileClick}>
                    <img
                        src="https://via.placeholder.com/40"
                        alt="Profile"
                        className="profile-image"
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="dashboard-content">
                <div className="welcome-message">
                    <h2>Welcome back, {userData.username}!</h2>
                    <p>View your stats, schedule, and more!</p>
                </div>

                {/* Dashboard Cards */}
                <div className="dashboard-cards">
                    <div className="card">
                        <h3>Stats And Performances</h3>
                        <p>View your performance, scores, and stats</p>
                        <button className="action-button" onClick={handleViewStatsClick}>
                            View Stats
                        </button>
                    </div>
                    <div className="card">
                        <h3>Upcoming Matches</h3>
                        <p>Check your upcoming games and schedules</p>
                        <button className="action-button" onClick={handleViewScheduleClick}>
                            View Schedule
                        </button>
                    </div>
                    
                   
                </div>

                {/* Team Stats Table */}
                {teamStats && (
                    <div className="team-stats">
                        <h3>Team Stats: {teamStats.Team_name}</h3>
                        <table className="stats-table">
                            <thead>
                                <tr>
                                    <th>Stat Type</th>
                                    <th>Wins</th>
                                    <th>Points Scored</th>
                                    <th>Goals Scored</th>
                                    <th>Sport</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{teamStats.Stat_Type}</td>
                                    <td>{teamStats.Wins}</td>
                                    <td>{teamStats.Points_scored}</td>
                                    <td>{teamStats.Goals_scored}</td>
                                    <td>{teamStats.Sport_Name}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Profile Modal */}
            {isProfileModalOpen && (
                <div className="profile-modal" onClick={handleBackgroundClick}>
                    <div className="profile-modal-content">
                        <span className="close-button" onClick={closeProfileModal}>
                            &times;
                        </span>
                        <div className="profile-info">
                            <h3>{userData.username}</h3>
                            <p><strong>Email:</strong> {userData.email}</p>
                        </div>
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlayerDashboard;
