import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AlertService from '../../../services/AlertService';
import UserService from '../../../services/UserService';
import Alert from '../../../domain/Alert';
import './Alert.css'

interface AlertPageProps {
    // alert will be fetched by id from the URL params
}

const AlertPage: React.FC<AlertPageProps> = () => {
    const { id } = useParams<{ id: string }>();
    const [alert, setAlert] = useState<Alert | null>(null);

    const availableCategories =[
        {
            name: "Tentativa de Login",
            path: "/alerts/multiple-login-failures"
        },
        {
            name: "Scanning",
            path: "/alerts/changes-made-to-the-firewall"
        },
        {
            name: "Comprometimento de Sistema",
            path: "/alerts/simultaneous-login-activity"
        },
        {
            name:  "Comprometimento de Conta Privilegiada",
            path: "/alerts/new-user-account"
        },
        {
            name: "Modificação não autorizada",
            path: "/alerts/user-data-has-been-changed"
        },
        {
            name: "Exploração de Vulnerabilidade",
            path: "/alerts/port-scan"
        }
    ]

    const categories = {
        Benign: ["Undetermined"],
        Botnet: ["Undetermined"],
        Bruteforce: ["FTP", "SSH"],
        DDoS: [
            "Undetermined", 
            "DNS", 
            "Ddossim", 
            "HOIC", 
            "LDAP", 
            "LOIC-HTTP", 
            "MSSQL", 
            "NTP", 
            "NetBIOS", 
            "SNMP", 
            "Slowloris", 
            "Syn", 
            "TFTP", 
            "UDP", 
            "UDPLag"
        ],
        DoS: [
            "Goldeneye", 
            "Heartbleed", 
            "Hulk", 
            "Rudy", 
            "Slowbody", 
            "Slowheaders", 
            "Slowhttptest", 
            "Slowloris", 
            "Slowread"
        ],
        Infiltration: ["Undetermined"],
        Portscan: ["Undetermined"],
        Webattack: ["SQLi", "XSS", "Bruteforce"]
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

    const handleCloseAlert = async (alertId: string) => {
        const alertToUpdate = alert;
        alertToUpdate.status = 'Closed';
        alertToUpdate.resolution = ['Alert Closed Manually']
        const actualTime = new Date().toISOString().slice(0, 19);
        alertToUpdate.conclusionTime = actualTime
        await UserService.updateAlertStatus(alertId, alertToUpdate);
        setAlert(alertToUpdate);
        window.location.href = '/my-alerts';
    };

    const handleResolveAlert = async () => {
        const category = availableCategories.find(cat => cat.name === alert.subCategory);
        if (!category) {
            window.alert("Not supported yet!");
        } else {
            const targetPath = `${category.path}?alertId=${alert.id}`;
            window.location.href = targetPath;
        }
    };
    

    return (
        <div className="alert-container">
            <div className="alert-box">
                <div className="alert-item">
                    <strong>Category:</strong><br/>
                    <select className='silect' value={selectedCategory} onChange={handleCategoryChange}>
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
                    <select className='silect' value={selectedSubCategory} onChange={handleSubCategoryChange} disabled={!selectedCategory}>
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
                    <strong>Conclusion Time:</strong><br/> {alert.conclusionTime || 'Not Available/Not Concluded'}
                </div>
            </div>

            <div className="alert-box description-box">
                <strong>Description:</strong>{alert.description || 'No Description'}
            </div>

            <div className="alert-box">
                <strong>Resolution:</strong>
                <ul>
                    {alert.resolution && alert.resolution.length > 0 ? (
                        alert.resolution.map((resolution, index) => (
                            <li key={index}>{resolution}</li>
                        ))
                    ) : (
                        <li>Not Resolved</li>
                    )}
                </ul>
            </div>
            <div className='AlertasDiV'>
            <button className="close-button"
                    onClick={() => handleResolveAlert()}>Resolve Alert</button>
            <button className="close-button"
            onClick={() => handleCloseAlert(alert.id)}>Close Alert</button>
            </div>        
        </div>
    );
};

export default AlertPage;
