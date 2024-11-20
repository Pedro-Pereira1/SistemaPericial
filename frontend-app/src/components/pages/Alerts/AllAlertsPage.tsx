import React, { useState, useEffect } from 'react';
import './AllAlertsPage.css';
import UserService, { User } from '../../../services/UserService';
import Alert from '../../../domain/Alert';
import AlertService from '../../../services/AlertService';
import { Link } from 'react-router-dom';

interface AlertWithUser {
    id: string;
    category: string;
    subCategory: string;
    origin: string;
    assignedTo: string;
    userName: string;
    userRole: string;
    userEmail: string;
    userPhone: string;
    status: string;
    creationTime: string;
    conclusionTime: string;
    description: string;
    resolution: string[];
}

const AllAlertsPage: React.FC = () => {
    const [alerts, setAlerts] = useState<AlertWithUser[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        // Fetch all users and aggregate alerts
        const fetchData = async () => {
            const users: User[] = await UserService.getAllUsers();
            setUsers(users);
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

    const handleUserChange = async (alertId: string, newUserName: string) => {
        const updatedUser = users.find((user) => user.name === newUserName);

        if (updatedUser) {
            // Optimistically update the state
            setAlerts((prevAlerts) =>
                prevAlerts.map((alert) =>
                    alert.id === alertId
                        ? { ...alert, userName: newUserName, assignedTo: updatedUser.email }
                        : alert
                )
            );

            // Find the current alert to ensure all required fields are available
            const currentAlert = alerts.find((alert) => alert.id === alertId);

            if (!currentAlert) {
                console.error("Alert not found in state.");
                return;
            }

            // Prepare the updated alert payload
            const updatedAlert: Alert = {
                id: alertId,
                category: currentAlert.category,
                subCategory: currentAlert.subCategory,
                origin: currentAlert.origin,
                assignedTo: updatedUser.email,
                status: currentAlert.status,
                creationTime: currentAlert.creationTime,
                conclusionTime: currentAlert.conclusionTime,
                description: currentAlert.description,
                resolution: currentAlert.resolution,
            };

            try {
                // Send the updated alert to the backend
                await AlertService.updateAlert(updatedAlert);
                console.log("Alert updated successfully:", updatedAlert);
            } catch (error) {
                console.error("Failed to update alert:", error);

                // Optionally, revert the state on failure
                setAlerts((prevAlerts) =>
                    prevAlerts.map((alert) =>
                        alert.id === alertId
                            ? {
                                  ...alert,
                                  userName: currentAlert.userName, // Revert to previous userName
                                  assignedTo: currentAlert.assignedTo, // Revert to previous assignedTo
                              }
                            : alert
                    )
                );
            }
        }
    };

    return (
        <div className="all-alerts-container">
            {alerts.length === 0 ? (
                <p>No alerts available.</p>
            ) : (
                <table className="alerts-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Sub-Category</th>
                            <th>Origin</th>
                            <th>Assigned To</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alerts.map((alert) => (
                            <tr key={alert.id}>
                                <td>{alert.category}</td>
                                <td>
                                    <Link to={`/alert/${alert.id}`} className="alert-link">
                                        {alert.subCategory}
                                    </Link>
                                </td>
                                <td>{alert.origin}</td>
                                <td>
                                    <select
                                        value={alert.userName}
                                        onChange={(e) => handleUserChange(alert.id, e.target.value)}
                                    >
                                        {users.map((user) => (
                                            <option key={user.email} value={user.name}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
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