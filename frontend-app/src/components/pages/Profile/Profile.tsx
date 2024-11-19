import React from 'react';
import './Profile.css'; // Import the CSS file

const Profile: React.FC = () => {
    // Retrieve user info from local storage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Check if user data is available
    if (!user || !user.name) {
        return <div className="no-profile">Please login to view your profile.</div>;
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
                <p className="profile-bio">{user.bio || 'No bio available.'}</p>
            </div>
            <div className="profile-details">
                <h2>User Information</h2>
                <ul className="profile-info-list">
                    <li>
                        <strong>ID:</strong> {user.id || 'Not available'}
                    </li>
                    <li>
                        <strong>Email:</strong> {user.email || 'Not available'}
                    </li>
                    <li>
                        <strong>Phone:</strong> {user.phone || 'Not available'}
                    </li>
                    <li>
                        <strong>Role:</strong> {user.role || 'Not available'}
                    </li>
                </ul>
            </div>
            <div className="profile-actions">
                <button className="edit-button">Edit Profile</button>
                <button
                    className="logout-button"
                    onClick={() => {
                        localStorage.removeItem('isAuthenticated');
                        localStorage.removeItem('user');
                        window.location.href = '/login'; // Redirect to login page
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;
