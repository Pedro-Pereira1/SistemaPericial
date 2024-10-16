import axios from 'axios';



const AlertService = {
  processAlertDrools: async (alertContext: any) => {
    try {
      console.log("Submitting alert context:", alertContext);
      const response = await axios.post('http://localhost:8080/api/alerts/process-alert', alertContext);
      return response.data; // Assuming API sends the next question or conclusion
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
  body: alertContext,
  redirect: "follow" as RequestRedirect
};

fetch("http://localhost:5000/api/prolog/handler", requestOptions)
  .then((response) => response.json())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

    } catch (error) {
      console.error("Error processing alert:", error);
      throw error;
    }
  }
};

export default AlertService;
