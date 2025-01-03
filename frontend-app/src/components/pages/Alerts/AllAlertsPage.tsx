import React, { useState, useEffect } from 'react';
import './AllAlertsPage.css';
import UserService, { User } from '../../../services/UserService';
import Alert from '../../../domain/Alert';
import AlertService from '../../../services/AlertService';
import { Link } from 'react-router-dom';

interface AlertWithUser {
    id: string;
    title: string;
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
    priority: string;
}

type SortConfig = {
    key: keyof AlertWithUser;
    direction: 'asc' | 'desc';
};

const AllAlertsPage: React.FC = () => {
    const [alerts, setAlerts] = useState<AlertWithUser[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

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

    const getPriorityColor = (priority: string) => {
        const num = Number(priority);
        switch (num) {
            case 1:
                return { color: 'red', label: '1 - Max' };
            case 2:
                return { color: 'orange', label: '2 - High' };
            case 3:
                return { color: '#FFD700', label: '3 - Medium' };
            case 4:
                return { color: 'green', label: '4 - Low' };
            case 5:
                return { color: 'blue', label: '5 - Minimal' };
            default:
                return { color: 'gray', label: 'Unknown Priority' };
        }
    };

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
                console.error('Alert not found in state.');
                return;
            }

            // Prepare the updated alert payload
            const updatedAlert: Alert = {
                id: alertId,
                title: currentAlert.title,
                category: currentAlert.category,
                subCategory: currentAlert.subCategory,
                origin: currentAlert.origin,
                assignedTo: updatedUser.email,
                status: currentAlert.status,
                creationTime: currentAlert.creationTime,
                conclusionTime: currentAlert.conclusionTime,
                description: currentAlert.description,
                resolution: currentAlert.resolution,
                priority: currentAlert.priority,
            };

            try {
                // Send the updated alert to the backend
                await AlertService.updateAlert(updatedAlert);
                console.log('Alert updated successfully:', updatedAlert);
            } catch (error) {
                console.error('Failed to update alert:', error);

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

    const sortData = (key: keyof AlertWithUser) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig?.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedAlerts = [...alerts].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        const order = direction === 'asc' ? 1 : -1;
        return a[key] > b[key] ? order : a[key] < b[key] ? -order : 0;
    });

    return (
        <div className="all-alerts-container">
            {alerts.length === 0 ? (
                <p>No alerts available.</p>
            ) : (
                <table className="alerts-table">
                    <thead>
                        <tr>
                            <th onClick={() => sortData('title')}>
                                Title {sortConfig?.key === 'title' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => sortData('category')}>
                                Category {sortConfig?.key === 'category' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => sortData('subCategory')}>
                                Sub-Category {sortConfig?.key === 'subCategory' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => sortData('priority')}>
                                Priority {sortConfig?.key === 'priority' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => sortData('origin')}>
                                Origin {sortConfig?.key === 'origin' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => sortData('userName')}>
                                Assigned To {sortConfig?.key === 'userName' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => sortData('status')}>
                                Status {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAlerts.map((alert) => (
                            <tr key={alert.id}>
                                <td>{alert.title}</td>
                                <td>{alert.category}</td>
                                <td>{alert.subCategory}</td>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    <div
                                        className="priority-div"
                                        style={{
                                            backgroundColor: getPriorityColor(alert.priority).color,
                                            padding: '5px 12px',
                                            borderRadius: '20px',
                                            display: 'inline-block',
                                            color: 'white',
                                            whiteSpace: 'nowrap',
                                            minWidth: '111px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {getPriorityColor(alert.priority).label}
                                    </div>
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
