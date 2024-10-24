import axios from 'axios';

const generalService = {
    isMalicious: async (ip:string): Promise<Boolean> => {
        try {
            const response = await axios.get('http://localhost:7000/ip/' + ip);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("Error fetching history:", error);
            throw error;
        }
    }
};

export default generalService;




