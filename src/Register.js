import React, { useState, useEffect } from 'react';
import './Register.css'; // Assuming you have a CSS file for styling

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone_no, setPhone_no] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [selectedSport, setSelectedSport] = useState('');
    const [sports, setSports] = useState([]); // Store available sports
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch sports from the backend when the component mounts
    useEffect(() => {
        const fetchSports = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/sports');
                const data = await response.json();
                setSports(data.sports); // Assuming the response contains an array of sports
            } catch (error) {
                console.error('Error fetching sports:', error);
            }
        };

        fetchSports();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation to check if all fields are filled
        if (!username || !password || !email || !phone_no || !dob || !gender || !selectedSport) {
            setErrorMessage('Please fill in all fields.');
            setSuccessMessage('');
            return;
        }

        const registerData = { username, password, email, phone_no, dob, gender, sport_id: selectedSport };

        try {
            const response = await fetch('http://localhost:5001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            const result = await response.json();

            if (response.status === 201) {
                setSuccessMessage(result.message);
                setErrorMessage('');
            } else {
                setErrorMessage(result.message);
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Error during registration. Please try again later.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Phone No."
                    value={phone_no}
                    onChange={(e) => setPhone_no(e.target.value)}
                />
                <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                />
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>

                {/* Dropdown for selecting sport */}
                <select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)}>
                    <option value="">Select Sport</option>
                    {sports.map((sport) => (
                        <option key={sport.Sport_ID} value={sport.Sport_ID}>
                            {sport.Sport_Name}
                        </option>
                    ))}
                </select>

                <button type="submit">Register</button>
            </form>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
    );
};

export default Register;
