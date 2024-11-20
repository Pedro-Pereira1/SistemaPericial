import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AlertService from '../../../services/AlertService';
import Alert from '../../../domain/Alert';
import './Alert.css'

interface AlertPageProps {
    // alert will be fetched by id from the URL params
}

const AlertPage: React.FC<AlertPageProps> = () => {
    const { id } = useParams<{ id: string }>();  // Get the 'id' from the URL
    const [alert, setAlert] = useState<Alert | null>(null);
    // Example categories and sub-categories mapping
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

    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | undefined>(alert?.type);
    useEffect(() => {
        const fetchAlert = async () => {
            if (id) {
                try {
                    // Fetch the alert using the id
                    const fetchedAlert = await AlertService.getAlertById(id); // Assuming this service fetches the alert by id
                    setAlert(fetchedAlert);
                } catch (error) {
                    console.error("Error fetching alert:", error);
                }
            }
        };

        fetchAlert();
    }, [id]);

    if (!alert) {
        return <p>Loading...</p>;  // Show loading message while fetching the alert
    }

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const category = e.target.value as Category;
        setSelectedCategory(category);
        setSelectedSubCategory(''); // Reset sub-category when category changes
    };

    const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSubCategory(e.target.value);
    };
    return (
        <div className="alert-container">
            <div className="alert-box">
                <div className="alert-item">
                    <strong>Category:</strong>
                    <select value={selectedCategory} onChange={handleCategoryChange}>
                        <option value="">Select a Category</option>
                        {Object.keys(categories).map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="alert-item">
                    <strong>Sub-Category:</strong>
                    <select value={selectedSubCategory} onChange={handleSubCategoryChange} disabled={!selectedCategory}>
                        <option value="">Select a Sub-Category</option>
                        {selectedCategory && categories[selectedCategory].map((subCategory) => (
                            <option key={subCategory} value={subCategory}>
                                {subCategory}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="alert-box">
                <div className="alert-item">
                    <strong>User:</strong> {alert.assignedTo}
                </div>
                <div className="alert-item">
                    <strong>Origin:</strong> {alert.origin}
                </div>
            </div>

            <div className="alert-box description-box">
                <strong>Description:</strong> {alert.status}
            </div>

            <button className="close-button">Close</button>
        </div>
    );
};

export default AlertPage;
