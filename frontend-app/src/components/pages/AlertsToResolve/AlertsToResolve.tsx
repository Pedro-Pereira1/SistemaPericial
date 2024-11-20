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
        const fetchAlerts = async () => {
            const alerts = await UserService.getAlertsByUserId(user.email);
            setAlerts(alerts);
        };
        fetchAlerts();
    }, [user.id]);

    const handleCloseAlert = (alertId: string) => {
        // Update the status of the alert locally
        const updatedAlerts = alerts.map((alert) =>
            alert.id === alertId ? { ...alert, status: 'Closed' } : alert
        );
        setAlerts(updatedAlerts);
        const newAlert = alerts.find((alert) => alert.id === alertId);

        // Update the alert status in the UserService (mock backend)
        if (newAlert) {
            newAlert.status = 'Closed';
            UserService.updateAlertStatus(alertId, newAlert);
        }
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
