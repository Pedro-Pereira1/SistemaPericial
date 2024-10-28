// Dashboard.tsx
import React from 'react';
import './Dashboard.css';
import 'boxicons/css/boxicons.min.css'; // Import Boxicons for the icons.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faBell, faChartBar } from '@fortawesome/free-solid-svg-icons';

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard-container">
            <h1>Shield App Dashboard</h1>
            <p>Welcome to the Shield App - your expert system for SOC alert detection and classification.</p>
            <div className="dashboard-cards">
                <div className="dashboard-card">
                    <FontAwesomeIcon icon={faShieldAlt} size="2x" className="card-icon" />
                    <h2>Threat Detection</h2>
                    <p>Real-time analysis and identification of potential threats and alerts.</p>
                </div>
                <div className="dashboard-card">
                    <FontAwesomeIcon icon={faBell} size="2x" className="card-icon" />
                    <h2>Alert Management</h2>
                    <p>View, prioritize, and manage security alerts with efficiency.</p>
                </div>
                <div className="dashboard-card">
                    <FontAwesomeIcon icon={faChartBar} size="2x" className="card-icon" />
                    <h2>Analytics</h2>
                    <p>Visualize and analyze security metrics for informed decision-making.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
