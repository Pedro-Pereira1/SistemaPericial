import React, { useEffect, useState } from 'react';
import historyService from './../../../services/historyService';
import './History.css';
import UserService from '../../../services/UserService';

interface Alert {
    id: string;
    category: string;
    subCategory: string;
    origin: string;
    assignedTo: string;
    status: string;
    creationTime: string;
    conclusionTime: string;
    description: string;
    resolution: string[];
}

const History: React.FC = () => {
    const [historyItems, setHistoryItems] = useState<Alert[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getHistory = async () => {
            try {
                let historyData: Alert[] = await UserService.getAlerts();
                historyData = historyData.filter(alert => alert.status === 'Closed');                


                if (historyData.length === 0) {
                    setError('No history available.');
                } else {
                    setHistoryItems(historyData);
                }
            } catch (error) {
                setError('An error occurred while fetching history.');
                console.error("Failed to fetch history:", error);
            } finally {
                setLoading(false);
            }
        };

        getHistory();
    }, []);

    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const toggleHistory = (id: string) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="message-container error-message">
                <p>{error}</p>
            </div>
        );
    }

    if (historyItems.length === 0) {
        return (
            <div className="message-container empty-message">
                <p>No history available at the moment.</p>
            </div>
        );
    }

    return (
        <div className="history-container">
            <h1>History</h1>
            <ul className="history-list">
                {historyItems.map(item => (
                    <li key={item.id} className="history-item">
                        <div className="history-header">
                            <span>{item.subCategory}</span>
                            <span className="timestamp">
                                {new Date(item.creationTime).toLocaleString()} - {new Date(item.conclusionTime).toLocaleString()}
                            </span>
                            <button 
                                className="history-toggle-button" 
                                onClick={() => toggleHistory(item.id)}>
                                {expandedItems.has(item.id) ? 'Hide Details' : 'Show Details'}
                            </button>
                        </div>
                        {expandedItems.has(item.id) && (
                            <ul className="sub-history-list">
                                {item.resolution.map((resolutionStep, index) => (
                                    <li key={index} className="sub-history-item">{resolutionStep}</li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default History;
