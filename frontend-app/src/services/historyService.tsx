import axios from 'axios';


interface HistoryItem {
    id: string;
    alertTypes: string;
    timestamp: string;
    history: string[];
}

const historyService = {

    fetchHistory: async (): Promise<HistoryItem[]> => {
    try {
        const response = await axios.get('http://localhost:7000/history');
        
        const data = response.data;
        const historyItems: HistoryItem[] = data.map((item: any) => ({
            id: item.id.toString(),
            alertTypes: item.alertType || 'Unknown',
            timestamp: item.timestamp,
            history: item.rules || [],
        }));

        return historyItems;
    } catch (error) {
        console.error("Error fetching history:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
},

postHistory: async (historyItem: any) => {
    try {
        await axios.post('http://localhost:7000/history', historyItem);
    } catch (error) {
        console.error("Error posting history:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
},
};

export default historyService;




