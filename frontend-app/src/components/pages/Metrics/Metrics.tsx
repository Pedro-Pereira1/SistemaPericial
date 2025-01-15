import React, { useState } from 'react';
import './Metrics.css';
import axios from 'axios';
import UserService from '../../../services/UserService';
import Alert from '../../../domain/Alert';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from 'chart.js';
import { json } from 'react-router-dom';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const modelNames: { [key: string]: string } = {
    'xgboost': 'XGBoost',
    'random_forest': 'Random Forest',
    'lightgbm': 'LGBM',
    'cnn_rnn': 'CNN + RNN'
};


  
  type OrganizedUser = {
    user: string;
    estimate_time: number;
    alerts: { alert: Alert; estimate_time: number }[];
  };

const Metrics: React.FC = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [selectedExplanationModel, setSelectedExplanationModel] = useState<string>('xgboost');

    const explanationImages: { [key: string]: { src: string; name: string; description: string }[] } = {
        'xgboost': [
            { src: '/images/shap_xgb.png', name: 'Interaction Value Plot for Network Traffic Features', description: 'This SHAP interaction plot visualizes the interaction effects between different network traffic features on a machine learning model\'s predictions. The x-axis represents SHAP interaction values, indicating how feature interactions impact the model\'s output. Each dot represents a data point, with colors distinguishing feature interactions (e.g., red and blue indicating different contributions). The y-axis lists key network traffic features such as "Flow Duration," "Fwd Packet Length Mean," and "Total Backward Packets," providing insights into their importance and interactions in predictive decision-making.' },
            { src: '/images/profile2.png', name: 'Image 2', description: 'Description 2' },
        ],
        'random_forest': [
            { src: '/images/profile3.png', name: 'Image 3', description: 'Description 3' },
            { src: '/images/profile4.png', name: 'Image 4', description: 'Description 4' },
        ],
        'lightgbm': [
            { src: '/images/profile5.png', name: 'Image 5', description: 'Description 5' },
            { src: '/images/profile6.png', name: 'Image 6', description: 'Description 6' },
        ],
        'cnn_rnn': [
            { src: '/images/profile7.png', name: 'Image 7', description: 'Description 7' },
            { src: '/images/profile8.png', name: 'Image 8', description: 'Description 8' },
        ],
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => Math.min(prevIndex + 1, explanationImages[selectedExplanationModel].length - 1));
    };
    
    const [selectedModel, setSelectedModel] = useState<string>('xgboost');
    const [numAlerts, setNumAlerts] = useState<number>(1);
    const [progress, setProgress] = useState<number>(0); // State for progress
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<'genetic' | 'pso'>('genetic');
    const [workPlan, setWorkPlan] = useState<{ 
        bestFitness: number | null, 
        assignments: Record<string, string[]>, 
        workloads: Record<string, number>,
        tasks: { user: string; alert: Alert; estimate_time: number }[] 
    }>({
        bestFitness: null,
        assignments: {},
        workloads: {},
        tasks: []
    });


    // Example data for different models
    const modelsData: { [key: string]: { label: string; value: number }[] } = {   
        'xgboost': [
            { label: 'F1 Score', value: 98.51 },
            { label: 'Precision', value: 98.57 },
            { label: 'Recall', value: 98.93 },
            { label: 'Accuracy', value: 98.93 },
        ],
        'random_forest': [
            { label: 'F1 Score', value: 98.37 },
            { label: 'Precision', value: 98.13 },
            { label: 'Recall', value: 98.67 },
            { label: 'Accuracy', value: 98.67 },
        ],
        'lightgbm': [
            { label: 'F1 Score', value: 95 },
            { label: 'Precision', value: 95.06 },
            { label: 'Recall', value: 94.96 },
            { label: 'Accuracy', value: 94.96 },
        ],
        'cnn_rnn': [
            { label: 'F1 Score', value: 90.9 },
            { label: 'Precision', value: 90.7 },
            { label: 'Recall', value: 91.97 },
            { label: 'Accuracy', value: 91.97 },
        ],
    };

    const [metrics, setMetrics] = useState(modelsData['xgboost']);
    const darkMode = JSON.parse(localStorage.getItem('darkMode') || '{}');
    const [selectedGraph, setSelectedGraph] = useState<'Category' | 'AssignedUser' | 'Origin'>('Category');


    // Handle model selection change
    const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const model = event.target.value;
        setSelectedModel(model);
        setMetrics(modelsData[model]);
        setSelectedExplanationModel(model);
        setCurrentImageIndex(0);
    };

    // Handle input change for number of alerts
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(event.target.value);
        if (value < 1) value = 1;
        if (value > 1000) value = 1000;
        setNumAlerts(value);
    };

    const processAlertsData = (key: keyof Alert) => {
        const counts: Record<string, number> = {};
        // Count occurrences for the given key (e.g., 'category', 'assignedTo', 'origin')
        alerts.forEach((alert) => {
            const value = (alert[key] as string) || 'Unknown';
            counts[value] = (counts[value] || 0) + 1;
        });

        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', 
            '#FF595E', '#F1A7A7', '#9B59B6', '#2ECC71', '#FF6F61', '#1F77B4', 
            '#8E44AD', '#F39C12', '#3498DB', '#E74C3C', '#2ECC71', '#9B59B6', 
            '#F1C40F', '#2C3E50', '#16A085', '#D35400', '#E67E22', '#8E44AD', 
            '#1ABC9C', '#7F8C8D', '#9B59B6', '#F39C12', '#D5DBDB', '#27AE60', 
            '#34495E', '#E74C3C', '#F39C12', '#2980B9', '#FF6347', '#7D3C98', 
            '#9C27B0', '#FF9800', '#CDDC39', '#3F51B5', '#2196F3', '#FFC107', 
            '#FF5722', '#00BCD4', '#4CAF50', '#FFEB3B', '#9E9E9E', '#795548', 
            '#607D8B', '#8BC34A', '#CDDC39', '#FF4081', '#03A9F4', '#8D6E63', 
            '#4CAF50', '#FF9800', '#009688', '#673AB7', '#F44336', '#FFEB3B', 
            '#795548', '#9E9E9E', '#607D8B', '#8BC34A', '#E91E63', '#03A9F4', 
            '#FF7043', '#00BCD4', '#8BC34A', '#9E9E9E', '#FFEB3B', '#FF5722', 
            '#9C27B0', '#03A9F4', '#8D6E63', '#4CAF50', '#FF9800', '#3F51B5', 
            '#4CAF50', '#CDDC39', '#FF5722', '#FF9800', '#FF4081', '#8BC34A', 
            '#00BCD4', '#FF6347', '#4CAF50', '#FFEB3B', '#673AB7', '#E91E63', 
            '#9E9E9E', '#FF5722', '#F44336', '#795548', '#4CAF50', '#FF9800'
        ]
        
        // Prepare the chart data
        return {
            labels: Object.keys(counts),
            datasets: [
                {
                    data: Object.values(counts),
                    backgroundColor: colors,
                    hoverBackgroundColor: colors,
                },
            ],
        };
    };

    const getChartData = () => {
        switch (selectedGraph) {
            case 'Category':
                return processAlertsData('category');
            case 'AssignedUser':
                return processAlertsData('assignedTo');
            case 'Origin':
                return processAlertsData('origin');
            default:
                return { labels: [], datasets: [] };
        }
    };

    const getWorkPlanChartData = () => {
        if (!workPlan || workPlan.tasks.length === 0) {
            return {
                labels: [],
                datasets: []
            };
        }

        // Organize alerts per user
        const organizedTasks = organizeTasks(workPlan.tasks);
        console.log(organizedTasks);
        const userNames = organizedTasks.map((user) => user.user);

        // Extract unique alert names for each user
        const alertNames = Array.from(new Set(workPlan.tasks.map((task) => task.alert)));

        // Assign colors to different alerts
        const alertColors: Record<string, string> = {};
        alertNames.forEach((alert) => {
            alertColors[alert.id] = getPriorityColor(alert.priority).color;
        });

        // Create stacked datasets, one per alert category
        const datasets = alertNames.map((alert) => {
            return {
                label: alert.title,
                data: organizedTasks.map((user) => {
                    // Sum estimate time for this alert type per user
                    return user.alerts
                        .filter((userAlert) => userAlert.alert === alert)
                        .reduce((sum, userAlert) => sum + userAlert.estimate_time, 0);
                }),
                backgroundColor: alertColors[alert.id],
                borderWidth: 1
            };
        });

        return {
            labels: userNames,
            datasets: datasets
        };
    };

    const getPriorityColor = (priority: string) => {
        const num = Number(priority);
        switch (num) {
            case 1:
                return { color: 'red', label: '1 - Max' };
            case 2:
                return { color: 'orange', label: '2 - High' };
            case 3:
                return { color: '#FFD700', label: '3 - Medium' };
            case 4:
                return { color: 'green', label: '4 - Low' };
            case 5:
                return { color: 'blue', label: '5 - Minimal' };
            default:
                return { color: 'gray', label: 'Unknown Priority' };
        }
    };

    const getPriorityFromColor = (color: string) => {
        const priorityMap: { [key: string]: { priority: number; label: string } } = {
            red: { priority: 1, label: '1 - Max' },
            orange: { priority: 2, label: '2 - High' },
            '#FFD700': { priority: 3, label: '3 - Medium' },
            green: { priority: 4, label: '4 - Low' },
            blue: { priority: 5, label: '5 - Minimal' },
            gray: { priority: 0, label: 'Unknown Priority' }
        };
    
        return priorityMap[color] || { priority: 0, label: 'Unknown Priority' };
    };
    
      
    function organizeTasks(tasks: { user: string; alert: Alert; estimate_time: number }[] ): OrganizedUser[] {
        const userMap = new Map<string, OrganizedUser>();
      
        for (const task of tasks) {
          if (!userMap.has(task.user)) {
            userMap.set(task.user, { user: task.user, estimate_time: 0, alerts: [] });
          }
          const userEntry = userMap.get(task.user)!;
          userEntry.estimate_time += task.estimate_time;
          userEntry.alerts.push({ alert: task.alert, estimate_time: task.estimate_time });
        }
      
        return Array.from(userMap.values());
    }

    const handleGenerateAlerts = async () => {
        setAlerts([]); // Clear existing alerts
        setProgress(0); // Reset progress
        try {
            // Simulate initial setup delay
            for (let i = 1; i <= 30; i++) {
                await new Promise((resolve) => setTimeout(resolve, 30)); // Shorter delay for setup
                setProgress(i);
            }
    
            // Call the API to generate alerts
            setProgress(30); // Update progress for API call
            const response = await axios.post(`http://localhost:7000/alerts/random/${numAlerts}/${selectedModel.replace(/\s/g, '')}/${selectedAlgorithm.replace(/\s/g, '')}`);
            if (response.status !== 200) {
                window.alert('Error generating random alerts');
                throw new Error(`API error: ${response.statusText}`);
            }
    
            // Simulate data processing progress
            for (let i = 31; i <= 80; i++) {
                await new Promise((resolve) => setTimeout(resolve, 50)); // Longer delay for processing
                setProgress(i);
            }
    
            // Fetch updated alerts
            const data: Alert[] = await UserService.getAlerts();
            if (!data || !Array.isArray(data)) {
                throw new Error('Unexpected response format from alert service');
            }
    
            setAlerts(data.slice(data.length - numAlerts));
    
            if (response.data && response.data.data) {
                setWorkPlan({
                    bestFitness: response.data.data.best_fitness,
                    assignments: response.data.data.assignments,
                    workloads: response.data.data.workloads,
                    tasks: response.data.tasks
                });
            }

            // Simulate final completion progress
            for (let i = 81; i <= 100; i++) {
                await new Promise((resolve) => setTimeout(resolve, 20)); // Finalizing
                setProgress(i);
            }
        } catch (error) {
            console.error('Error generating random alerts:', error);
            setProgress(0); // Reset progress on error
        } finally {
            setProgress(100); // Ensure progress bar reaches 100% in all cases
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
                        <option value="xgboost">XGBoost</option>
                        <option value="random_forest">Random Forest</option>
                        <option value="lightgbm">LGBM</option>
                        <option value="cnn_rnn">CNN + RNN</option>
                    </select>

                    <select
                        value={selectedAlgorithm}
                        onChange={(e) => setSelectedAlgorithm(e.target.value as 'genetic' | 'pso')}
                    >
                        <option value="genetic">Genetic Algorithm</option>
                        <option value="pso">Particle swarm optimization</option>
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
            <div className="progress-bar-container">
                <div
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                ></div>
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
                                    {modelNames[model]}
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
            </div>
            
            <div className="middle-container">
                <h3 className="grid-title">Work Plan</h3>
                {workPlan.bestFitness !== null ? (
                <div>
                    <div className="workplan-chart">
                        <Bar
                            data={getWorkPlanChartData()}
                            options={{
                                indexAxis: 'y', // Horizontal bar chart
                                responsive: true,
                                scales: {
                                    x: {
                                        stacked: true, // Stacking on X-axis (time)
                                        title: {
                                            display: true,
                                            text: 'Estimate Time (minutes)'
                                        }
                                    },
                                    y: {
                                        stacked: true, // Stacking users
                                        title: {
                                            display: true,
                                            text: 'Users'
                                        }
                                    }
                                },
                                plugins: {
                                    legend: {
                                        display: true,
                                        position: 'top',
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function (context) {
                                                const backgroundColor = typeof context.dataset.backgroundColor === 'string' ? context.dataset.backgroundColor : 'gray';
                                            
                                                return `Alert ${context.dataset.label} | Estimate time: ${context.raw} minutes | Priority: ${getPriorityFromColor(backgroundColor).label}`;
                                            }
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
                ) : (
                    <p className='NoWorkPlanYet'>No work plan available. Generate alerts to see the plan.</p>
                )}
            </div>

            <div className="bottom-grid">
                {/* Other Sections (Graphs, Alerts, etc.) */}
                <div className="grid-item graphs-container">
                    <h3 className="grid-title">Graphs</h3>
                    <div className="graph-div">
                        {/* Dropdown to select the graph type */}
                        <select
                            className="graph-div-select"
                            value={selectedGraph}
                            onChange={(e) =>
                                setSelectedGraph(e.target.value as 'Category' | 'AssignedUser' | 'Origin')
                            }
                        >
                            <option value="Category">Pie Chart by Category</option>
                            <option value="AssignedUser">Pie Chart by Assigned User</option>
                            <option value="Origin">Pie Chart by Origin</option>
                        </select>

                        {/* Render the pie chart */}
                        {alerts.length > 0 ? (
                            <Pie
                            data={getChartData()}
                            options={{
                                plugins: {
                                    legend: {
                                        labels: {
                                           color: darkMode ? 'white' : 'black',
                                        },
                                    },
                                    tooltip: {
                                        bodyColor: darkMode ? 'white' : 'black', // Tooltip text color
                                        backgroundColor: darkMode ? '#333' : '#fff', // Tooltip text color
                                    },
                                },
                            }}
                        />
                        ) : (
                            <p className='NoAlertsYet'>No data to display. Generate some alerts first!</p>
                        )}
                    </div>
                </div>

                <div className="grid-item explicable-container">
            <h3 className="grid-title">Explanation</h3>
            
            {/* Model Selection Dropdown */}
            <div className="explicable-model-selector">
                <div className="explicable-model-select-section">
                <label htmlFor="explicable-model-select">Select Model: </label>
                <select
                    id="explicable-model-select"
                    value={selectedModel}
                    onChange={handleModelChange}
                >
                    {Object.keys(modelsData).map((model, index) => (
                        <option key={index} value={model}>
                            {modelNames[model]}
                        </option>
                    ))}
                </select>
                </div>

                <div className="explicable-model-select-section2">
                <button 
                    className="explicable-arrow left-arrow" 
                    onClick={handlePrevImage}
                    disabled={currentImageIndex === 0}
                >
                    &#9664;
                </button>

                <div className="explicable-image-container">
                    <img
                        className="explicable"
                        src={explanationImages[selectedExplanationModel][currentImageIndex].src}
                        alt={explanationImages[selectedExplanationModel][currentImageIndex].name}
                    />
                    <div className="explicable-legend">
                        <strong>{explanationImages[selectedExplanationModel][currentImageIndex].name}</strong>
                        <p className='explicable-description'>{explanationImages[selectedExplanationModel][currentImageIndex].description}</p>
                    </div>
                </div>

                <button 
                    className="explicable-arrow right-arrow" 
                    onClick={handleNextImage}
                    disabled={currentImageIndex === explanationImages[selectedExplanationModel].length - 1}
                >
                    &#9654;
                </button>
                </div>
            </div>
            </div>
        </div>
    </div>
    );
};

export default Metrics;
