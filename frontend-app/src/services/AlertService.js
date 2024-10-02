import axios from 'axios';

const AlertService = {
    processAlert: async (alertContext) => {
        try {
            const response = await axios.post('http://localhost:8080/api/alerts/process', alertContext);
            return response.data;
        } catch (error) {
            console.error("Error processing alert", error);
            throw error;
        }
    }
};

export default AlertService;
