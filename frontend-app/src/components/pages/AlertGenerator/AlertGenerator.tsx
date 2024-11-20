import React, { useState, useEffect } from 'react';
import './AlertGenerator.css';
import UserService from '../../../services/UserService';
import { User } from '../../../services/UserService';
import Alert from '../../../domain/Alert';

interface AlertDTO{
    type: string;
    origin: string;
    assignedTo: string;
    status: string;
}

const AlertGenerator: React.FC = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [form, setForm] = useState({
        type: '',
        origin: '',
        assignedTo: '',
    });

    const [users, setUsers] = useState<User[]>([]);
    const alertTypes = ['Multiple Login Failures', 'Firewall Changes', 'Port Scan', 'Unauthorized Access'];

    useEffect(() => {
        // Fetch all users from UserService
        const fetchUsers = async () => {
            const allUsers = await UserService.getAllUsers();
            const socUsers = allUsers.filter(
                (user: User) => user.role === 'SOC Tier1' || user.role === 'SOC Tier2' || user.role === 'SOC Tier3'
            );
            setUsers(socUsers);
        };
        fetchUsers();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleGenerateAlert = async () => {
        const newAlert: AlertDTO = {
            status: 'Open',
            ...form,
        };

        
        const selectedUser = users.find((user) => user.email === form.assignedTo);
        if (selectedUser) {
            const alertNew: Alert = await UserService.assignAlert(newAlert); 
            setAlerts([...alerts, alertNew]);
        }

        // Clear form
        setForm({ type: '', origin: '', assignedTo: '' });
    };

    return (
        <div className="alert-generator-container">
            <h1>Alert Generator (SOC Manager)</h1>
            <div className="form-container">
                <div className="form-field">
                    <label>Type</label>
                    <select name="type" value={form.type} onChange={handleChange}>
                        <option value="">Select Alert Type</option>
                        {alertTypes.map((type, index) => (
                            <option key={index} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-field">
                    <label>Origin</label>
                    <input
                        type="text"
                        name="origin"
                        value={form.origin}
                        onChange={handleChange}
                        placeholder="Alert Origin (e.g., IP Address)"
                    />
                </div>
                <div className="form-field">
                    <label>Assign To</label>
                    <select name="assignedTo" value={form.assignedTo} onChange={handleChange}>
                        <option value="">Select User</option>
                        {users.map((user, index) => (
                            <option key={index} value={user.email}>
                                {user.name} ({user.role})
                            </option>
                        ))}
                    </select>
                </div>
                <button onClick={handleGenerateAlert} disabled={!form.type || !form.origin || !form.assignedTo}>
                    Generate Alert
                </button>
            </div>

            <div className="alerts-list">
                <h2>Generated Alerts</h2>
                {alerts.length === 0 ? (
                    <p>No alerts generated yet.</p>
                ) : (
                    <ul>
                        {alerts.map((alert) => (
                            <li key={alert.id}>
                                <strong>ID:</strong> {alert.id} | <strong>Type:</strong> {alert.type} |{' '}
                                <strong>Origin:</strong> {alert.origin} | <strong>Assigned To:</strong> {alert.assignedTo}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AlertGenerator;
