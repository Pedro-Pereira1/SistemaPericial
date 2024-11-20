import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AlertService from '../../../services/AlertService';
import Alert from '../../../domain/Alert';
import './Alert.css'

interface AlertPageProps {
    // alert will be fetched by id from the URL params
}

const AlertPage: React.FC<AlertPageProps> = () => {
    const { id } = useParams<{ id: string }>();
    const [alert, setAlert] = useState<Alert | null>(null);

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
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | undefined>();

    useEffect(() => {
        const fetchAlert = async () => {
            if (id) {
                try {
                    const fetchedAlert = await AlertService.getAlertById(id); 
                    setAlert(fetchedAlert);

                    if (fetchedAlert.category) {
                        setSelectedCategory(fetchedAlert.category as Category);
                        setSelectedSubCategory(fetchedAlert.subCategory);
                    }
                } catch (error) {
                    console.error("Error fetching alert:", error);
                }
            }
        };

        fetchAlert();
    }, [id]);

    if (!alert) {
        return <p>Loading...</p>;
    }

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const category = e.target.value as Category;
        setSelectedCategory(category);
        setSelectedSubCategory('');
    };

    const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSubCategory(e.target.value);
    };

    return (
        <div className="alert-container">
            <div className="alert-box">
                <div className="alert-item">
                    <strong>Category:</strong><br/>
                    <select value={selectedCategory} onChange={handleCategoryChange}>
                        <option value={alert.category}>{alert.category}</option>
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
                        <option value={alert.subCategory}>{alert.subCategory}</option>
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

            <div className="alert-box">
                <div className="alert-item">
                    <strong>Status:</strong><br/> {alert.status}
                </div>
                <div className="alert-item">
                    <strong>Created At:</strong><br/> {alert.creationTime || 'Not Available'}
                </div>
                <div className="alert-item">
                    <strong>Conclusion Time:</strong><br/> {alert.conclusionTime || 'Not Available'}
                </div>
            </div>

            <div className="alert-box description-box">
                <strong>Description:</strong><br/><textarea value={'No Description Available'}></textarea>
            </div>

            <div className="alert-box">
                <strong>Resolution:</strong> {alert.resolution || 'Not Resolved'}
            </div>

            <button className="close-button">Close</button>
        </div>
    );
};

export default AlertPage;
