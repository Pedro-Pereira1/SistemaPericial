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

    const getPriorityColor = (priority: string) => {
        const num = Number(priority);
        switch (num) {
          case 1:
            return { color: "red", label: "1 - Max" };
          case 2:
            return { color: "orange", label: "2 - High" };
          case 3:
            return { color: "#FFD700", label: "3 - Medium" };
          case 4:
            return { color: "green", label: "4 - Low" };
          case 5:
            return { color: "blue", label: "5 - Minimal" };
          default:
            return { color: "gray", label: "Unknown Priority" };
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
                            <th>Title</th>
                            <th>Category</th>
                            <th>Sub-Category</th>
                            <th>Priority</th>
                            <th>Origin</th>
                            <th>Creation Time</th>
                            <th>Conclusion Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alerts.map((alert) => (
                            <tr key={alert.id}>
                                <td>{alert.status === 'Open' ?(
                                        <Link to={`/alert/${alert.id}`} className="alert-link">
                                        {alert.title}
                                    </Link>
                                    ) : (
                                        alert.title
                                    )
                                    }</td>
                                <td>{alert.category}</td>
                                <td>{alert.subCategory}</td>
                                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                  <div
                                    className="priority-div"
                                    style={{
                                        backgroundColor: getPriorityColor(alert.priority).color,
                                        padding: "5px 12px",
                                        borderRadius: "20px",
                                        display: "inline-block",
                                        color: "white",
                                        whiteSpace: "nowrap",
                                        minWidth: "111px", // Ensure all backgrounds have the same size
                                        textAlign: "center",
                                    }}
                                  >
                                    {getPriorityColor(alert.priority).label}
                                  </div>
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
