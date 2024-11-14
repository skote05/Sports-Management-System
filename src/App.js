import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import AdminDashboard from './AdminDashboard';  // Import Admin Dashboard
import PlayerDashboard from './PlayerDashboard'; // Import Player Dashboard
import Register from './Register'; // Import Register component
import ScheduleManagement from './Administrator/ScheduleManagement';  // Import Admin Schedule Management // Import Player Schedule View
import './App.css';

const App = () => {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admindashboard" element={<AdminDashboard />} />
                    <Route path="/playerdashboard" element={<PlayerDashboard />} />

                    {/* Admin route for Schedule Management */}
                    <Route path="/schedulemanagement" element={<ScheduleManagement />} />

                    {/* Player route to view schedule */}
                </Routes>
            </Router>
        </div>
    );
};

export default App;
