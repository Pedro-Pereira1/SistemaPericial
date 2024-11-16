import React from 'react';
import './Website.css';

const Website: React.FC = () => {
    return (
        <div className="website-container">
            <iframe
                src="https://0941pepe.wixsite.com/shield-ai" // Replace with the URL of your Wix site
                title="Embedded Website"
                className="website-iframe"
                frameBorder="0"
            />
        </div>
    );
};

export default Website;
