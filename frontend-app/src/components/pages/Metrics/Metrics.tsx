import React, { useEffect, useState } from 'react';
import './Metrics.css';

const Metrics: React.FC = () => {
    return (
        <>
            <div className='metrics-container'>
                <div className='generate-random-alerts-container'>
                    Number of alerts: 
                    <input 
                        type='number' 
                        className='generate-random-alerts-input'>
                    </input>
                    <button 
                        className='generate-random-alerts-btn'>
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
                            <li>Category: Disponibilidade | Sub-Category: Negação de Serviço | Origin: ds | Assigned To: tier3@shield-ai.com | Status: Open</li>
                            <li>B</li>
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
