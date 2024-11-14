import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './PlayerDashboard.css'; // Import the stylesheet for styling

const PlayerDashboard = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // State to control the profile modal
  const [userData, setUserData] = useState({
    username: 'John Doe',  // This would be dynamically set, e.g., from login
    email: 'johndoe@gmail.com', // This would be dynamically set from login
  });

  // Function to handle "View Stats" button click
  const handleViewStatsClick = () => {
    navigate('/playerstats'); // Navigate to the Stats page
  };

  const handleViewScheduleClick = () => {
    navigate('/scheduleview');
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true); // Open profile modal
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false); // Close profile modal
  };

  const handleBackgroundClick = (e) => {
    if (e.target.classList.contains('profile-modal')) {
      closeProfileModal(); // Close the modal if the background is clicked
    }
  };

  const handleLogout = () => {
    // Handle logout logic (clear user data, etc.)
    setUserData({ username: '', email: '' });  // Reset user data
    navigate('/login');  // Redirect to login page
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
          <h2>Welcome back, Player!</h2>
          <p>View your stats, schedule, and more!</p>
        </div>

        {/* Dashboard Cards - Key sections */}
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
          <div className="card">
            <h3>Health And Fitness</h3>
            <p>Track your fitness goals and health data</p>
            <button className="action-button">Track Health</button>
          </div>
          <div className="card">
            <h3>Payments And Subscriptions</h3>
            <p>Make payments for subscriptions.</p>
            <button className="action-button">Make Payments</button>
          </div>
        </div>
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
