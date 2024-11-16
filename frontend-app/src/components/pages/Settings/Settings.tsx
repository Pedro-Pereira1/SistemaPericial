import React, { useState, useEffect } from 'react';
import 'boxicons/css/boxicons.min.css';
import './Settings.css';

const Settings: React.FC = () => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    const handleDarkModeChange = () => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    return (
        <div className="settings-container">
            <h1>Settings</h1>
            <div className="settings-item">
                <label className="toggle-switch">
                    <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={handleDarkModeChange}
                    />
                    <span className="slider">
                        {darkMode ? (
                            <i className='bx bx-moon'></i>
                        ) : (
                            <i className='bx bx-sun'></i>
                        )}
                    </span>
                </label>
            </div>
        </div>
    );
};

export default Settings;
