import React, { useState, useEffect } from 'react';
import './AlertsToResolve.css';
import UserService from '../../../services/UserService';
import Alert from '../../../domain/Alert';

const AlertsToResolve: React.FC = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchAlerts = async () => {
            const userAlerts = await UserService.getAlertsByUserId(user.email);
            setAlerts(userAlerts);
        };
        fetchAlerts();
    }, [user.email]);

    const handleCloseAlert = async (alertId: string) => {
        // Update the status of the alert locally
        const updatedAlerts = alerts.map((alert) =>
            alert.id === alertId ? { ...alert, status: 'Closed', conclusionTime: new Date().toISOString() } : alert
        );
        setAlerts(updatedAlerts);

        // Update the alert status in the backend
        const alertToUpdate = alerts.find((alert) => alert.id === alertId);
        if (alertToUpdate) {
            try {
                alertToUpdate.status = 'Closed';
                alertToUpdate.conclusionTime = new Date().toISOString();
                await UserService.updateAlertStatus(alertId, alertToUpdate);
                console.log(`Alert ${alertId} closed successfully.`);
            } catch (error) {
                console.error(`Failed to close alert ${alertId}:`, error);
            }
        }
    };

    return (
        <div className="alerts-to-resolve-container">
            <h1 className="header">My Alerts</h1>
            {alerts.length === 0 ? (
                <p>No alerts available.</p>
            ) : (
                <table className="alerts-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Sub-Category</th>
                            <th>Origin</th>
                            <th>Creation Time</th>
                            <th>Conclusion Time</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alerts.map((alert) => (
                            <tr key={alert.id}>
                                <td>{alert.category}</td>
                                <td>{alert.subCategory}</td>
                                <td>{alert.origin}</td>
                                <td>{new Date(alert.creationTime).toLocaleString()}</td>
                                <td>
                                    {alert.conclusionTime
                                        ? new Date(alert.conclusionTime).toLocaleString()
                                        : 'Pending'}
                                </td>
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
                                        <button className="close-alert-button" disabled>
                                            Closed
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
