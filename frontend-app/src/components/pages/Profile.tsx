// ProfilePage.tsx
import React from 'react';
import './Profile.css'; // Import the CSS file

const Profile: React.FC = () => {
    const user = {
        name: "John Doe",
        bio: "Software Engineer with a passion for building scalable applications.",
        email: "johndoe@example.com",
        phone: "+1234567890",
        profilePicture: "https://via.placeholder.com/150", // Placeholder image
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img src={user.profilePicture} alt="Profile" className="profile-picture" />
                <h1 className="profile-name">{user.name}</h1>
                <p className="profile-bio">{user.bio}</p>
            </div>
            <div className="profile-contact">
                <h2>Contact Information</h2>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
            </div>
            <div className="profile-actions">
                <button className="edit-button">Edit Profile</button>
                <button className="logout-button">Logout</button>
            </div>
        </div>
    );
};

export default Profile;
