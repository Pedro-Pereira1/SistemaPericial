import React, { useEffect, useState } from 'react';
import historyService from './../../services/historyService';
import './History.css';

interface HistoryItem {
    id: string;
    alertTypes: string;
    timestamp: string;
    history: string[];
}

const History: React.FC = () => {
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getHistory = async () => {
            try {
                const historyData = await historyService.fetchHistory();
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
                            <span>{item.alertTypes}</span>
                            <span className="timestamp">{item.timestamp}</span>
                            <button 
                                className="history-toggle-button" 
                                onClick={() => toggleHistory(item.id)}>
                                {expandedItems.has(item.id) ? 'Hide History' : 'Show History'}
                            </button>
                        </div>
                        {expandedItems.has(item.id) && (
                            <ul className="sub-history-list">
                                {item.history.map((subItem, index) => (
                                    <li key={index} className="sub-history-item">{subItem}</li>
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
