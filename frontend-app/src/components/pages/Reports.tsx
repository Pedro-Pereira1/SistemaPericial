import React, { useEffect, useState } from 'react';
import './Reports.css';

interface Report {
    title: string;
    description: string;
    filePath: string;
}

const reports: Report[] = [
    { title: "ENGCIA I", description: "A comprehensive analysis of monthly security trends.", filePath: "/pdfs/Report_ENGCIA_I.pdf" },
    { title: "ENGCIA II", description: "A comprehensive analysis of monthly security trends.", filePath: "/pdfs/Report_ENGCIA_Ii.pdf" },
    { title: "PPROGIA", description: "Summary of threats detected over the past week.", filePath: "/pdfs/Report_PPROGIA.pdf" },
];

const Reports: React.FC = () => {
    const [validReports, setValidReports] = useState<Report[]>([]);

    useEffect(() => {
        const validateFiles = async () => {
            const validatedReports = await Promise.all(
                reports.map(async (report) => {
                    if (report.filePath.endsWith(".pdf")) {
                        try {
                            const response = await fetch(report.filePath, { method: 'HEAD' });
                            if (response.ok) return report;
                        } catch (error) {
                            console.error(`File not found: ${report.filePath}`, error);
                        }
                    }
                    return null;
                })
            );
            setValidReports(validatedReports.filter((report): report is Report => report !== null));
        };
        
        validateFiles();
    }, []);

    return (
        <div className="reports-container">
            <h1>Reports</h1>
            <p className="reports-description">Explore and download detailed reports on recent security analyses and incidents.</p>
            <div className="reports-list">
                {validReports.map((report, index) => (
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