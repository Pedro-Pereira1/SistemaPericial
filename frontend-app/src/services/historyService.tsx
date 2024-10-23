import axios from 'axios';

interface HistoryItem {
    id: string;
    alertTypes: string;
    timestamp: string;
    history: string[];
}

// historyService.ts
const mockHistoryData = Array.from({ length: 100 }, (_, index) => ({
    id: `${index + 1}`, // Use string ID
    alertTypes: `Alert Type ${index % 5 + 1}`, // Generate some alert types
    timestamp: new Date(Date.now() - index * 1000 * 60 * 60).toISOString().slice(0, 19).replace('T', ' '),
    history: Array.from({ length: 3 }, (_, subIndex) => `History Entry ${subIndex + 1} for Action ${index + 1}`), // Generate sub-history entries
}));

export const fetchHistory2 = async () => {
    return new Promise<{ id: string; alertTypes: string; timestamp: string; history: string[] }[]>((resolve) => {
        setTimeout(() => {
            resolve(mockHistoryData);
        }, 1000);
    });
};

export const fetchHistory = async (): Promise<HistoryItem[]> => {
    try {
        const response = await axios.get('http://localhost:7000/api/alerts/process-alert/null');
        
        const data = response.data;
        const historyItems: HistoryItem[] = data.map((item: any) => ({
            id: item.id.toString(),
            alertTypes: item.alertTypes || 'Unknown',
            timestamp: item.timestamp,
            history: item.history || [],
        }));

        return historyItems;
    } catch (error) {
        console.error("Error fetching history:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
};




