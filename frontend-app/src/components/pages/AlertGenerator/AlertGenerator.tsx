import React, { useState, useEffect } from 'react';
import './AlertGenerator.css';
import UserService from '../../../services/UserService';
import { User } from '../../../services/UserService';
import Alert from '../../../domain/Alert';
import AlertDTO from '../../../domain/AlertDTO';

const AlertGenerator: React.FC = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [form, setForm] = useState({
        category: '',
        subCategory: '',
        origin: '',
        assignedTo: '',
        description: '',
    });

    const [users, setUsers] = useState<User[]>([]);
    const categories = ['Network Security', 'Application Security', 'Endpoint Security', 'Other'];
    const subCategories = ['Multiple Login Failures', 'Firewall Changes', 'Port Scan', 'Unauthorized Access'];

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleGenerateAlert = async () => {
        const currentTime = new Date().toISOString();
        const newAlert: AlertDTO = {
            category: form.category,
            subCategory: form.subCategory,
            origin: form.origin,
            assignedTo: form.assignedTo,
            description: form.description,
            status: 'Open',
            creationTime: currentTime,
            conclusionTime: '',
            resolution: [],
        };

        const selectedUser = users.find((user) => user.email === form.assignedTo);
        if (selectedUser) {
            const alertNew = await UserService.assignAlert(newAlert); 
            setAlerts([...alerts, alertNew]);
        }

        // Clear form
        setForm({ category: '', subCategory: '', origin: '', assignedTo: '', description: '' });
    };

    return (
        <div className="alert-generator-container">
            <h1>Alert Generator (SOC Manager)</h1>
            <div className="form-container">
                <div className="form-field">
                    <label>Category</label>
                    <select name="category" value={form.category} onChange={handleChange}>
                        <option value="">Select Category</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-field">
                    <label>Sub-Category</label>
                    <select name="subCategory" value={form.subCategory} onChange={handleChange}>
                        <option value="">Select Sub-Category</option>
                        {subCategories.map((subCategory, index) => (
                            <option key={index} value={subCategory}>
                                {subCategory}
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
                <div className="form-field">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Provide a brief description of the alert"
                    />
                </div>
                <button
                    onClick={handleGenerateAlert}
                    disabled={!form.category || !form.subCategory || !form.origin || !form.assignedTo || !form.description}
                >
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
                                <strong>ID:</strong> {alert.id} | <strong>Category:</strong> {alert.category} |{' '}
                                <strong>Sub-Category:</strong> {alert.subCategory} | <strong>Origin:</strong> {alert.origin} |{' '}
                                <strong>Assigned To:</strong> {alert.assignedTo} | <strong>Status:</strong> {alert.status} |{' '}
                                <strong>Description:</strong> {alert.description}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AlertGenerator;