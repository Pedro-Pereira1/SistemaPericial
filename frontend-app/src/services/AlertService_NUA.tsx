import axios from 'axios';



const AlertService = {
  processAlertDrools: async (alertContext: any) => {
    try {
      console.log("Submitting alert context:", alertContext);
      const response = await axios.post('http://localhost:8080/api/alerts/process-alert', alertContext);
      console.log("DATA" + response.data)
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
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(alertContext),
      };

      const response = await fetch("http://localhost:5000/api/prolog/handler", requestOptions);
      const result = await response.json();
      
      return result;
    } catch (error) {
      console.error("Error processing alert:", error);
      throw error;
    }
  },
  
  reset_prolog: async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };

      const response = await fetch("http://localhost:5000/api/prolog/reset", requestOptions);
      const result = await response.json();

      return result;
    } catch (error) {
      console.error("Error processing alert:", error);
      throw error;
    }
  }
};

export default AlertService;
