import React from 'react';
import './Reports.css';

interface Report {
    title: string;
    description: string;
    filePath: string;
}

const reports: Report[] = [
    { title: "Monthly Security Analysis", description: "A comprehensive analysis of monthly security trends.", filePath: "../../../../pdfs/Report_PPROGIA.pdf" },
    { title: "Weekly Threat Report", description: "Summary of threats detected over the past week.", filePath: "Report_PPROGIA.pdf" },
];

const Reports: React.FC = () => {
    return (
        <div className="reports-container">
            <h1>Reports</h1>
            <p className="reports-description">Explore and download detailed reports on recent security analyses and incidents.</p>
            <div className="reports-list">
                {reports.map((report, index) => (
                    <div key={index} className="report-item">
                        <h2 className="report-title">{report.title}</h2>
                        <p className="report-description">{report.description}</p>
                        <a href={report.filePath} download className="download-button">
                            Download PDF
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reports;
