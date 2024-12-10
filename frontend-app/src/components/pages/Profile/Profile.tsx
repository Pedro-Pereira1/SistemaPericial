import React, { useEffect, useState } from 'react';
import './Profile.css';
import AlertService from '../../../services/AlertService';
import UserService, { User } from '../../../services/UserService';

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null); // Start with null for better async handling
    const [newPreference, setNewPreference] = useState('');
    const [preferences, setPreferences] = useState<string[]>([]);
    const [options, setOptions] = useState<string[]>([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch user data
                const localUser = JSON.parse(localStorage.getItem('user') || 'null');
                if (!localUser || !localUser.id) {
                    throw new Error('User not authenticated'); // Redirect if no user is found
                }

                const fetchedUser = await UserService.getUserById(localUser.id);
                setUser(fetchedUser); // Set the user state
                setPreferences(fetchedUser.categories_preferences || []);
                localStorage.setItem('user', JSON.stringify(fetchedUser));

                // Fetch available options
                const fetchedOptions = await AlertService.getAllCategories();
                setOptions(fetchedOptions);
            } catch (error) {
                console.error('Error during initialization:', error);
                handleLogout(); // Redirect to login on error
            }
        };

        fetchInitialData();
    }, []);

    const handleSave = async () => {
        if (!user) return;
        try {
            const updatedUser = { ...user, categories_preferences: preferences };
            await UserService.updateUser(updatedUser.email, preferences);
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            alert('Profile saved successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    };

    const addPreference = () => {
        if (newPreference && !preferences.includes(newPreference)) {
            setPreferences([...preferences, newPreference]);
            setNewPreference('');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    if (!user) {
        return <div>Loading...</div>; // Display a loading state until user data is fetched
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img
                    src={user.picture || 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className="profile-picture"
                />
                <h1 className="profile-name">{user.name}</h1>
            </div>

            <div className="profile-details">
                <h2>User Information</h2>
                <ul className="profile-info-list">
                    <li>
                        <strong>Email:</strong> {user.email}
                    </li>
                    <li>
                        <strong>Phone:</strong> {user.phone}
                    </li>
                    <li>
                        <strong>Role:</strong> {user.role}
                    </li>
                </ul>
            </div>

            <div className="preferences-section">
                <h2>Preferences</h2>
                <ul className="preferences-list">
                    {preferences.map((pref, index) => (
                        <li key={index}>
                            {pref}
                            <button
                                className="remove-button"
                                onClick={() => setPreferences(preferences.filter((_, i) => i !== index))}
                            >
                                <img src="/images/x_icon.png" alt="Remove" />
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="add-preference">
                    <select
                        value={newPreference}
                        onChange={(e) => setNewPreference(e.target.value)}
                        className="preference-input"
                    >
                        <option value="" disabled>
                            Select a preference
                        </option>
                        {options.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <button className="add-button" onClick={addPreference}>
                        Add
                    </button>
                </div>
            </div>

            <div className="profile-actions">
                <button className="save-button" onClick={handleSave}>
                    Save
                </button>
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;
