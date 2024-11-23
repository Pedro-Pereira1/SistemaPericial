import React, { useState, useEffect } from 'react';
import './AlertGenerator.css';
import UserService from '../../../services/UserService';
import { User } from '../../../services/UserService';
import AlertCreationDTO from '../../../domain/AlertCreationDTO';

const categories = {
    "Código Malicioso": [
        "Sistema Infetado",
        "Distribuição de Malware",
        "Servidor C2",
        "Configuração de Malware"
    ],
    "Disponibilidade": [
        "Negação de Serviço",
        "Negação de Serviço Distribuída",
        "Configuração incorreta",
        "Sabotagem",
        "Interrupção"
    ],
    "Recolha de Informação": [
        "Scanning",
        "Sniffing",
        "Engenharia Social"
    ],
    "Intrusão": [
        "Comprometimento de Conta Privilegiada",
        "Comprometimento de Conta Não Privilegiada",
        "Comprometimento de Aplicação",
        "Comprometimento de Sistema",
        "Arrombamento"
    ],
    "Tentativa de Intrusão": [
        "Exploração de Vulnerabilidade",
        "Tentativa de Login",
        "Nova assinatura de ataque"
    ],
    "Segurança da Informação": [
        "Acesso não autorizado",
        "Modificação não autorizada",
        "Perda de dados",
        "Exfiltração de Informação"
    ],
    "Fraude": [
        "Utilização indevida ou não autorizada de recursos",
        "Direitos de autor",
        "Utilização ilegítima de nome de terceiros",
        "Phishing"
    ],
    "Conteúdo Abusivo": [
        "SPAM",
        "Discurso Nocivo",
        "Exploração sexual de menores, racismo e apologia da violência"
    ],
    "Vulnerabilidade": [
        "Criptografia fraca",
        "Amplificador DDoS",
        "Serviços acessíveis potencialmente indesejados",
        "Revelação de informação",
        "Sistema vulnerável"
    ],
    "Outro": [
        "Sem tipo",
        "Indeterminado"
    ]
} as const;

type Category = keyof typeof categories;

const AlertGenerator: React.FC = () => {
    const [alerts, setAlerts] = useState<AlertCreationDTO[]>([]);
    const [form, setForm] = useState({
        category: '',
        subCategory: '',
        origin: '',
        assignedTo: '',
    });

    const [users, setUsers] = useState<User[]>([]);
    const [availableSubCategories, setAvailableSubCategories] = useState<string[]>([]);

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

        if (name === 'category') {
            // Update subcategories dynamically based on selected category
            setAvailableSubCategories((categories[value as Category] || []).slice());
            setForm({ ...form, category: value, subCategory: '' }); // Reset subcategory
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleGenerateAlert = async () => {
        const newAlert: AlertCreationDTO = {
            category: form.category,
            subCategory: form.subCategory,
            origin: form.origin,
            assignedTo: form.assignedTo,
            status: 'Open',
        };

        const alertNew = await UserService.assignAlert(newAlert);
        setAlerts([...alerts, alertNew]);

        // Clear form
        setForm({ category: '', subCategory: '', origin: '', assignedTo: '' });
        setAvailableSubCategories([]);
    };

    return (
        <div className="alert-generator-container">
            <h1>Alert Generator (SOC Manager)</h1>
            <div className="form-container">
                <div className="form-field">
                    <label>Category</label>
                    <select name="category" value={form.category} onChange={handleChange}>
                        <option value="">Select Category</option>
                        {Object.keys(categories).map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-field">
                    <label>Sub-Category</label>
                    <select name="subCategory" value={form.subCategory} onChange={handleChange} disabled={!form.category}>
                        <option value="">Select Sub-Category</option>
                        {availableSubCategories.map((subCategory, index) => (
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
                        placeholder="Alert Origin (e.g., Country, IP Address)"
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
                <button
                    onClick={handleGenerateAlert}
                    disabled={!form.category || !form.subCategory || !form.origin || !form.assignedTo}
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
                        {alerts.map((alert, index) => (
                            <li key={index}>
                                <strong>Category:</strong> {alert.category} | <strong>Sub-Category:</strong>{' '}
                                {alert.subCategory} | <strong>Origin:</strong> {alert.origin} | <strong>Assigned To:</strong>{' '}
                                {alert.assignedTo} | <strong>Status:</strong> {alert.status}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AlertGenerator;