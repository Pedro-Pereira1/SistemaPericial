import React, { useEffect, useState } from 'react';
import './Metrics.css';

const Metrics: React.FC = () => {
    const [numAlerts, setNumAlerts] = useState<number>(0);
    const [alerts, setAlerts] = useState<string[]>([]);
    // Handle input change
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setNumAlerts(isNaN(value) ? 0 : value); // Handle invalid input
    };

    // Handle button click
    const handleGenerateAlerts = () => {
        const newAlerts = Array.from({ length: numAlerts }, (_, index) => 
            `Alert ${index + 1}: Example alert content`
        );
        setAlerts(newAlerts);
    };
    return (
        <>
            <div className='metrics-container'>
                <div className='generate-random-alerts-container'>
                    Number of alerts: 
                    <input 
                        type='number' 
                        className='generate-random-alerts-input'
                        value={numAlerts || ''}
                        onChange={handleInputChange} 
                    />
                    <button 
                        className='generate-random-alerts-btn'
                        onClick={handleGenerateAlerts}
                    >
                        Generate
                    </button>
                </div>
                <div className='metrics-container-grid-top'>
                    <div className='model-metrics-container'>
                        <div className='model-metrics'>
                            F1 Score:
                            <br/>2
                        </div>
                        <div className='model-metrics'>
                            Precision:
                            <br/>2
                        </div>
                        <div className='model-metrics'>
                            Metrica 3
                            <br/>2
                        </div>
                        <div className='model-metrics'>
                            Metrica 4
                            <br/>2
                        </div>
                    </div>
                    <div className='graphs-container'>
                        <div className='graph-div'>
                            <select className='graph-div-select'>
                                <option>Pie</option>
                            </select>
                            <img className='graph' src="/images/pie_graph_exampls.svg"></img>
                        </div>
                    </div>
                </div>
                <div className='metrics-container-grid-bottom'>
                    <div className='generated-alerts-div'>
                        <ul>
                            <li>Exemplo</li>
                            {alerts.map((alert, index) => (
                                <li key={index}>{alert}</li>
                            ))}
                        </ul>
                    </div>
                    <div className='explicable-container'>
                        <div className='explicable-div'>
                            <img className='explicable' src="/images/pie_graph_exampls.svg"></img>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Metrics;
