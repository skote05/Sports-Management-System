import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  

  const handleGoToScheduleManagement = () => {
    navigate('/schedulemanagement'); // Navigate to Schedule Management
  };

  const handleGoToTeamManagement = () => {
    navigate('/createteam'); // Navigate to Team Management
  };

  
  return (
    <div className="admin-dashboard">
      {/* Navbar */}
      <div className="navbar">
        <h1 className="navbar-title">Sports Management System</h1>
        <div className="profile-icon">
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
          <h2>Welcome back, Admin!</h2>
          <p>Manage your teams, players, schedules, and more with ease.</p>
        </div>

        {/* Dashboard Cards */}
        <div className="dashboard-cards">
          {/* Team Management Card */}
          <div className="card">
            <h3>Team Management</h3>
            <p>Create and manage teams, organize events</p>
            <div className="button-container">
              <button className="action-button" onClick={handleGoToTeamManagement}>
                Go to Teams
              </button>
              
            </div>
          </div>

          {/* Schedule Management Card */}
          <div className="card">
            <h3>Schedule Management</h3>
            <p>Manage upcoming matches and games</p>
            <div className="button-container">
              <button
                className="action-button"
                onClick={handleGoToScheduleManagement}
              >
                Go to Schedule
              </button>
             
            </div>
          </div>

          

          
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
