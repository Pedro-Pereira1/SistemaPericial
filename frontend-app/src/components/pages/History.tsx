// History.tsx
import React from 'react';
import './History.css';

const History: React.FC = () => {
    const historyItems = [
        { id: 1, action: 'Logged in', timestamp: '2024-10-01 10:00' },
        { id: 2, action: 'Updated Profile', timestamp: '2024-10-02 11:30' },
        { id: 3, action: 'Changed Settings', timestamp: '2024-10-03 14:15' },
    ];

    return (
        <div className="history-container">
            <h1>History</h1>
            <ul className="history-list">
                {historyItems.map(item => (
                    <li key={item.id} className="history-item">
                        <span>{item.action}</span>
                        <span className="timestamp">{item.timestamp}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default History;
