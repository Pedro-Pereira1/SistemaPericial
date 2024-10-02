import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    const handleSelectAlertType = (alertType) => {
        navigate(`/${alertType}`);
    };

    return (
        <div className="home-page">
            <h1>Select an Alert Type</h1>
            <div>
                <button onClick={() => handleSelectAlertType('alert1')}>Alert Type 1</button>
                <button onClick={() => handleSelectAlertType('alert2')}>Alert Type 2</button>
                <button onClick={() => handleSelectAlertType('alert3')}>Alert Type 3</button>
            </div>
        </div>
    );
};

export default HomePage;
