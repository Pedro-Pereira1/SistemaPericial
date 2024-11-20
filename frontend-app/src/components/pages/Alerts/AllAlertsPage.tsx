import React, { useState, useEffect } from 'react';
import './AllAlertsPage.css';
import UserService, { User } from '../../../services/UserService';

interface AlertWithUser {
    id: string;
    type: string;
    origin: string;
    assignedTo: string;
    userName: string;
    userRole: string;
    userEmail: string;
    userPhone: string;
    status: string;
}

interface Alert {
    id: string;
    type: string;
    origin: string;
    assignedTo: string;
    status: string;
}

const AllAlertsPage: React.FC = () => {
    const [alerts, setAlerts] = useState<AlertWithUser[]>([]);

    useEffect(() => {
        // Fetch all users and aggregate alerts
        const fetchData = async () => {
            const users: User[] = await UserService.getAllUsers();
            const alerts: Alert[] = await UserService.getAlerts();
            const aggregatedAlerts: AlertWithUser[] = alerts.map((alert: Alert) => {
                const assignedUser = users.find((user: User) => user.email === alert.assignedTo);
                return {
                    ...alert,
                    userName: assignedUser?.name || '',
                    userRole: assignedUser?.role || '',
                    userEmail: assignedUser?.email || '',
                    userPhone: assignedUser?.phone || '',
                };
            });
            setAlerts(aggregatedAlerts);
        };
        fetchData();
    }, []);

    return (
        <div className="all-alerts-container">
            <h1>All Alerts (SOC Manager)</h1>
            {alerts.length === 0 ? (
                <p>No alerts available.</p>
            ) : (
                <table className="alerts-table">
                    <thead>
                        <tr>
                            <th>Alert ID</th>
                            <th>Type</th>
                            <th>Origin</th>
                            <th>Assigned To</th>
                            <th>Role</th>
                            <th>Contact</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alerts.map((alert) => (
                            <tr key={alert.id}>
                                <td>{alert.id}</td>
                                <td>{alert.type}</td>
                                <td>{alert.origin}</td>
                                <td>{alert.assignedTo}</td>
                                <td>{alert.userRole}</td>
                                <td>
                                    <div>Email: {alert.userEmail}</div>
                                    <div>Phone: {alert.userPhone}</div>
                                </td>
                                <td>{alert.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AllAlertsPage;
