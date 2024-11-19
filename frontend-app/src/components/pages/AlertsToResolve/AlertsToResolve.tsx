import React, { useState, useEffect } from 'react';
import './AlertsToResolve.css';
import UserService, { User } from '../../../services/UserService';

interface Alert {
    id: string;
    type: string;
    origin: string;
    assignedTo: string;
    status: string;
}

const AlertsToResolve: React.FC = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        // Fetch the current user's alerts
        const me = UserService.getUserById(user.id);
        setAlerts(UserService.getAlertsByUserId(me?.id || ''));
    }, [user.id]);

    const handleCloseAlert = (alertId: string) => {
        // Update the status of the alert locally
        const updatedAlerts = alerts.map((alert) =>
            alert.id === alertId ? { ...alert, status: 'Closed' } : alert
        );
        setAlerts(updatedAlerts);

        // Update the alert status in the UserService (mock backend)
        UserService.updateAlertStatus(user.id, alertId, 'Closed');
    };

    return (
        <div className="all-alerts-container">
            <h1 className='header'>My Alerts</h1>
            {alerts.length === 0 ? (
                <p>No alerts available.</p>
            ) : (
                <table className="alerts-table">
                    <thead>
                        <tr>
                            <th>Alert ID</th>
                            <th>Type</th>
                            <th>Origin</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alerts.map((alert) => (
                            <tr key={alert.id}>
                                <td>{alert.id}</td>
                                <td>{alert.type}</td>
                                <td>{alert.origin}</td>
                                <td>{alert.status}</td>
                                <td>
                                    {alert.status !== 'Closed' ? (
                                        <button
                                            className="close-alert-button"
                                            onClick={() => handleCloseAlert(alert.id)}
                                        >
                                            Close Alert
                                        </button>
                                    ) : (
                                        <button
                                            className="close-alert-button"
                                            onClick={() => handleCloseAlert(alert.id)}
                                            disabled
                                        >
                                            Close Alert
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AlertsToResolve;
