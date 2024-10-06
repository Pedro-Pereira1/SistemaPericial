// Dashboard.tsx
import React from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            <div className="dashboard-cards">
                <div className="dashboard-card">
                    <h2>Card 1</h2>
                    <p>Some information about Card 1.</p>
                </div>
                <div className="dashboard-card">
                    <h2>Card 2</h2>
                    <p>Some information about Card 2.</p>
                </div>
                <div className="dashboard-card">
                    <h2>Card 3</h2>
                    <p>Some information about Card 3.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
