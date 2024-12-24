import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import AdminDashboard from './AdminDashboard';  // Import Admin Dashboard
import PlayerDashboard from './PlayerDashboard'; // Import Player Dashboard
import Register from './Register'; // Import Register component
import ScheduleManagement from './Administrator/ScheduleManagement';  // Import Admin Schedule Management // Import Player Schedule View
import './App.css';
import PlayerStats from './Player/PlayerStats';
import TeamStats from './Player/TeamStats';
import PaymentProcessing from './Player/PaymentProcessing';
import ScheduleView from './Player/ScheduleView';
import TeamManagement from './Administrator/TeamManagement';
import CreateTeamForm from './Administrator/CreateTeamForm';

const App = () => {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admindashboard" element={<AdminDashboard />} />
                    <Route path="/playerdashboard" element={<PlayerDashboard />} />
                    <Route path="/playerstats" element={<PlayerStats />} />
                    <Route path="/teamstats" element={<TeamStats />} />
                    <Route path="/paymentprocessing" element={<PaymentProcessing />} />
                    <Route path="/scheduleview" element={<ScheduleView />} />
                    <Route path="/teammanagement" element={<TeamManagement />} />
                    <Route path="/createteam" element={<CreateTeamForm />} />
                    {/* Admin route for Schedule Management */}
                    <Route path="/schedulemanagement" element={<ScheduleManagement />} />

                    {/* Player route to view schedule */}
                </Routes>
            </Router>
        </div>
    );
};

export default App;
