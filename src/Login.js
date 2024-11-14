import React, { useState } from 'react';
import './Login.css'; // Assuming you already have some styling

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [role, setRole] = useState(''); // 'player' or 'admin'

    // Handle login for player or admin
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent form submission

        if (!username || !password || !role) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        const loginData = {
            username,
            password,
            accountType: role,
        };

        try {
            const response = await fetch('http://localhost:5001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const result = await response.json();

            if (response.status === 200) {
                if (role === 'player') {
                    window.location.href = '/playerdashboard';
                } else if (role === 'admin') {
                    window.location.href = '/admindashboard';
                }
            } else {
                setErrorMessage(result.message); // Show error if login fails
            }
        } catch (error) {
            setErrorMessage('Error during login. Please try again.');
        }
    };

    // Set role to either 'player' or 'admin'
    const handleRoleSelection = (role) => {
        setRole(role);
        setErrorMessage('');  // Clear error message when switching role
    };

    return (
        <>
            <h1 className="login-heading">Welcome to the Sports Management System!</h1>
            <div className="login-container">
                <div className="login-box">
                    {/* Role Selection Buttons */}
                    {!role && (
                        <div className="role-buttons">
                            <button onClick={() => handleRoleSelection('player')} className="btn btn-secondary">
                                Player
                            </button>
                            <button onClick={() => handleRoleSelection('admin')} className="btn btn-secondary">
                                Administrator
                            </button>
                        </div>
                    )}

                    {/* Login Form */}
                    {role && (
                        <div className="login-form-container">
                            <h2 className="login-title">{role === 'player' ? 'Player Login' : 'Administrator Login'}</h2>
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            <form onSubmit={handleLogin} className="login-form">
                                <div className="form-group">
                                    <label htmlFor="username">Username:</label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password:</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="form-control"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Login as {role.charAt(0).toUpperCase() + role.slice(1)}
                                </button>
                            </form>

                            {/* Register Link only visible for Player login */}
                            {role === 'player' && (
                                <div className="register-link">
                                    <p>
                                        Don't have an account? <a href="/register" className="register-text">Register here</a>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Login;
