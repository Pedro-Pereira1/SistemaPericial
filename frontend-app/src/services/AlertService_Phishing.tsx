import axios from 'axios';



const AlertService = {
  processAlertDrools: async (alertContext: any) => {
    try {
        console.log("Submitting alert context:", alertContext);
        const response = await axios.post('http://localhost:8080/api/alerts/process-alert', alertContext);
        console.log(response.data)
        return response.data; // Assuming API sends the next question or conclusion
    } catch (error) {
      console.error("Error processing alert:", error);
      throw error;
    }
  },
  

  getHowExplanationDrools: async (alertContext: any) => {
    try {
        console.log("Submitting alert context:", alertContext);
        const response = await axios.post('http://localhost:8080/api/alerts/process-alert-why', alertContext);
        console.log("DATA" + response.data)
        return response.data; // Assuming API sends the next question or conclusion
    } catch (error) {
      console.error("Error processing alert:", error);
      throw error;
    }
  },

  clearDrools: async () => {
    try {
      await axios.post('http://localhost:8080/api/alerts/clear');
    } catch (error) {
      console.error("Error processing alert:", error);
      throw error;
    }
  },

  processAlertProlog: async (alertContext: any) => {
    try {
      const response = await axios.post('http://localhost:8080/api/alerts/process-alert/null', alertContext);
      return response.data; // Assuming API sends the next question or conclusion
    } catch (error) {
      console.error("Error processing alert:", error);
      throw error;
    }
  }


};

export default AlertService;