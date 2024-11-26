import React, { useState } from 'react';
import './Metrics.css';
import axios from 'axios';
import UserService from '../../../services/UserService';
import Alert from '../../../domain/Alert';

const Metrics: React.FC = () => {
    const [selectedModel, setSelectedModel] = useState<string>('Model 1');
    const [numAlerts, setNumAlerts] = useState<number>(1);
    const [metrics, setMetrics] = useState([
        { label: 'F1 Score', value: 70 },
        { label: 'Precision', value: 85 },
        { label: 'Recall', value: 60 },
        { label: 'Accuracy', value: 95 },
    ]);

    const [alerts, setAlerts] = useState<Alert[]>([]);

    // Example data for different models
    const modelsData: { [key: string]: { label: string; value: number }[] } = {
        'Model 1': [
            { label: 'F1 Score', value: 70 },
            { label: 'Precision', value: 85 },
            { label: 'Recall', value: 60 },
            { label: 'Accuracy', value: 95 },
        ],
        'Model 2': [
            { label: 'F1 Score', value: 80 },
            { label: 'Precision', value: 88 },
            { label: 'Recall', value: 65 },
            { label: 'Accuracy', value: 92 },
        ],
        'Model 3': [
            { label: 'F1 Score', value: 75 },
            { label: 'Precision', value: 82 },
            { label: 'Recall', value: 70 },
            { label: 'Accuracy', value: 90 },
        ],
    };

    // Handle model selection change
    const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const model = event.target.value;
        setSelectedModel(model);
        setMetrics(modelsData[model]);
    };

    // Handle input change for number of alerts
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(event.target.value);
        if (value < 1) value = 1;
        if (value > 100) value = 100;
        setNumAlerts(value);
    };

    // Handle generating random alerts
    const handleGenerateAlerts = async () => {
        try {
            const response = await axios.post('http://localhost:7000/alerts/random/' + numAlerts + '/' + selectedModel);
            if(response.status != 200){
                throw new Error("");
            }
            let data: Alert[] = await UserService.getAlerts();
            data = data.slice(data.length - numAlerts);
            setAlerts(data);
        } catch (error) {
            console.error('Error generating random alerts:', error)
            window.alert(error)
        }   
    };

    // Navigate to manual alert generation page
    const navigateToManualAlertPage = () => {
        window.location.href = '/manual-alerts';
    }


    return (
        <div className="metrics-container">
            {/* Top-wide container */}
            <div className="top-container">
                {/* Container for generating random alerts */}
                <div className="generate-random-alerts-container">
                    <p className="pp">Number of alerts:</p>
                    {/* Input field for number of alerts */}
                    <input
                        type="number"
                        className="generate-random-alerts-input"
                        value={numAlerts || ''}
                        onChange={handleInputChange}
                    />

                    {/* Selector for choosing the ML model */}
                    <select
                        className="generate-random-alerts-model-selector"
                        value={selectedModel}
                        onChange={handleModelChange}
                    >
                        <option value="Model 1">Model 1</option>
                        <option value="Model 2">Model 2</option>
                        <option value="Model 3">Model 3</option>
                    </select>

                    {/* Generate button */}
                    <button
                        className="generate-random-alerts-btn"
                        onClick={handleGenerateAlerts}
                    >
                        Generate
                    </button>
                    {/* Vertical bar */}
                <div className="vertical-bar"></div>
                    <button
                        className="generate-random-alerts-btn"
                        onClick={() => navigateToManualAlertPage()}
                    >
                        Generate Alerts Manually
                    </button>
                </div>

                
            </div>
            
            
            <div className="bottom-grid">
                {/* Model Metrics Section */}
                <div className="grid-item model-metrics-container">
                    <h3 className="grid-title">Model Metrics</h3>
                    <div className="model-selector">
                        <label htmlFor="model-select">Select Model: </label>
                        <select
                            id="model-select"
                            value={selectedModel}
                            onChange={handleModelChange}
                            className="model-selector-dropdown"
                        >
                            {Object.keys(modelsData).map((model, index) => (
                                <option key={index} value={model}>
                                    {model}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="metrics-grid">
                        {metrics.map((metric, index) => (
                            <div className="metric-item" key={index}>
                                <div className="circular-metric">
                                    <svg
                                        className="progress-ring"
                                        viewBox="0 0 36 36"
                                    >
                                        <path
                                            className="progress-ring-bg"
                                            d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32"
                                        />
                                        <path
                                            className="progress-ring-fg"
                                            d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32"
                                            style={{
                                                strokeDasharray: '100',
                                                strokeDashoffset: `${
                                                    100 - metric.value
                                                }`,
                                            }}
                                        />
                                    </svg>
                                    <span className="metric-value">
                                        {metric.value}%
                                    </span>
                                </div>
                                <p className="metric-label">{metric.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                

                <div className="grid-item generated-alerts-div">
                    <h3 className="grid-title">Generated Alerts</h3>
                    {alerts.length === 0 ? (
                    <p className ='NoAlertsYet'>No alerts generated yet.</p>
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

                {/* Other Sections (Graphs, Alerts, etc.) */}
                <div className="grid-item graphs-container">
                    <h3 className="grid-title">Graphs</h3>
                    <div className="graph-div">
                        <select className="graph-div-select">
                            <option>Pie</option>
                        </select>
                        <img
                            className="graph"
                            src="/images/pie_graph_exampls.svg"
                            alt="Pie Chart"
                        />
                    </div>
                </div>

                <div className="grid-item explicable-container">
                    <h3 className="grid-title">Explanation</h3>
                    <div className="explicable-div">
                        <img
                            className="explicable"
                            src="/images/pie_graph_exampls.svg"
                            alt="Pie Chart Explanation"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Metrics;
