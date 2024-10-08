// Settings.tsx
import React, { useState } from 'react';
import './Settings.css';

const Settings: React.FC = () => {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const handleNotificationsChange = () => {
        setNotifications(!notifications);
    };

    const handleDarkModeChange = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className="settings-container">
            <h1>Settings</h1>
            <div className="settings-item">
                <label>
                    <input
                        type="checkbox"
                        checked={notifications}
                        onChange={handleNotificationsChange}
                    />
                    Enable Notifications
                </label>
            </div>
            <div className="settings-item">
                <label>
                    <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={handleDarkModeChange}
                    />
                    Dark Mode
                </label>
            </div>
            <button className="save-button">Save Changes</button>
        </div>
    );
};

export default Settings;
