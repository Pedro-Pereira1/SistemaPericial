import React, { useState, useEffect } from 'react';
import './AlertsToResolve.css';
import UserService from '../../../services/UserService';
import Alert from '../../../domain/Alert';
import { Link } from 'react-router-dom';

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
                        </tr>
                    </thead>
                    <tbody>
                        {alerts.map((alert) => (
                            <tr key={alert.id}>
                                <td>{alert.category}</td>
                                <td> 
                                    {alert.status === 'Open' ?(
                                        <Link to={`/alert/${alert.id}`} className="alert-link">
                                        {alert.subCategory}
                                    </Link>
                                    ) : (
                                        alert.subCategory
                                    )
                                    }
                                    
                                </td>
                                <td>{alert.origin}</td>
                                <td>{new Date(alert.creationTime).toLocaleString()}</td>
                                <td>
                                    {alert.conclusionTime
                                        ? new Date(alert.conclusionTime).toLocaleString()
                                        : 'Pending'}
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

export default AlertsToResolve;
