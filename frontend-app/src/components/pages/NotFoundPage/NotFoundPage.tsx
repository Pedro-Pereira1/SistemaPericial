// NotFoundPage.tsx
import React from 'react';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
    return (
        <div className="notfound-container">
            <h1>404 Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <a href="/" className="home-link">Go to Home</a>
        </div>
    );
};

export default NotFoundPage;
