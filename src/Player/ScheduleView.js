import React, { useState, useEffect } from 'react';
import './ScheduleView.css';

const ScheduleView = () => {
    const [matches, setMatches] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch scheduled matches from the backend when the component mounts
    useEffect(() => {
        const fetchAllSchedules = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/allschedules');
                const result = await response.json();

                if (response.status === 200) {
                    setMatches(result.matches);
                } else {
                    setErrorMessage(result.message || 'Error fetching scheduled matches.');
                }
            } catch (error) {
                setErrorMessage('Error fetching scheduled matches. Please try again.');
                console.error(error);  // Log any errors for debugging
            } finally {
                setLoading(false);  // Stop loading once data is fetched
            }
        };

        fetchAllSchedules();
    }, []);

    return (
        <div className="schedule-view">
            <h2 className="schedule-view-heading">All Scheduled Matches</h2>

            {loading ? (
                <p>Loading matches...</p>
            ) : errorMessage ? (
                <p className="error-message">{errorMessage}</p>
            ) : (
                <div className="schedule-view-container">
                    <div className="schedule-table-wrapper">
                        <table className="schedule-table">
                            <thead>
                                <tr>
                                    <th>Match ID</th>
                                    <th>Team A</th>
                                    <th>Team B</th>
                                    <th>Sport</th>
                                    <th>Date</th>
                                    <th>Location</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matches.length > 0 ? (
                                    matches.map((match) => (
                                        <tr key={match.Match_ID}>
                                            <td>{match.Match_ID}</td>
                                            <td>{match.Team_A}</td>
                                            <td>{match.Team_B}</td>
                                            <td>{match.Sport_name}</td>
                                            <td>{match.Date_of_match}</td>
                                            <td>{match.Location}</td>
                                            <td>{match.Score ? match.Score : 'TBD'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">No matches scheduled</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleView;
