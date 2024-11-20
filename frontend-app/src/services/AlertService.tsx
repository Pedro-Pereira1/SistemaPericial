import axios from 'axios';
import config from '../config';
import Alert from '../domain/Alert';


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
        const response = await axios.post('http://localhost:8080/api/alerts/process-alert-how', alertContext );
        console.log("DATA" + response.data)
        return response.data; // Assuming API sends the next question or conclusion
    } catch (error) {
      console.error("Error processing alert:", error);
      throw error;
    }
  },

  clearDrools: async () => {
    try {
      console.log("Clearing alerts");
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

      const response = await fetch(`${config.prolog_ip}/reset`, requestOptions);
      const result = await response.json();

      return result;
    } catch (error) {
      console.error("Error processing alert:", error);
      throw error;
    }
  },


  getPossibleConclusions : async (expertSystem: String |null, alert: String): Promise<string[]> => {
    try {
      if(expertSystem === "Drools"){
        const response = await axios.get('http://localhost:8080/api/alerts/get-conclusions');
        return response.data;
      } else if(expertSystem === "Prolog"){
        const response = await axios.post(`${config.prolog_ip}/conclusions?alert=${alert}`);
        console.log(response.data)
        return response.data.message;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error processing alert:", error);
      throw error;
    }
  },

  getWhyNotExplanation : async (response: any, conclusion: String, expertSystem: String | null) => {
    if(expertSystem === "Drools"){
        const response = await axios.post('http://localhost:8080/api/alerts/get-why-not-explanation', {conclusion: conclusion});
        console.log(response.data)
        return response.data;
    } else if(expertSystem === "Prolog"){
      try {
        const response = await axios.post(`${config.prolog_ip}/not?conclusion=${conclusion}`);
        const formattedMessage = response.data.message.map((list: string[], index: number) => `==========${index + 1} Option==========\n${list.join('\n')}`).join('\n\n');
        return formattedMessage;
      } catch (error) {
        console.error("Error processing alert:", error);
        throw error;
      }
    }
  },

  getHowExplanation : async (alertContext: any, expertSystem: String | null) => {
    if(expertSystem === "Drools"){
      return AlertService.getHowExplanationDrools(alertContext);
    } else if(expertSystem === "Prolog"){
      try {
        const response = await axios.get(config.prolog_ip + '/how')
        if(response) return response.data
        return ["Unable to get the How explanation for this case."]
      } catch(error) {
        return [`An error occured: ${error}.`]
      }
    }
  },


  getWhyExplanation : async (alertContext: any, evidences: any, expertSystem: String | null, alert: string) => {
    if(expertSystem === "Drools"){
      const response = await axios.post('http://localhost:8080/api/alerts/process-alert-why',{alertContext,evidences,alert});
        console.log(response.data)
        return response.data;
    } else if(expertSystem === "Prolog"){
      try {
        const response = await axios.post(config.prolog_ip + '/why?question=' + alertContext.question.text + "&alert=" + alert)
        const formattedMessage = response.data.message.map((list: string[]) => `==========Possible Conclusions==========\n${list.join('\n')}`).join('\n\n');
        return formattedMessage
      } catch(error) {
        return `An error occured: ${error}.`
      }
    }
  },

  fuzzyInput : async (number: Number): Promise<string> =>{
    try {
      const response = await axios.post('http://localhost:8080/api/alerts/process-fuzzy', {requestsPerMinute:number});
      return response.data;
    } catch (error) {
      console.error("Error processing alert:", error);
      throw error;
    }
  },

  updateAlert: async (alert: Alert):Promise<Alert> => {
    try {
      const response = await axios.put(`${config.python}/updateAlert/${alert.id}`, alert)
      return response.data
    }catch(error) {
      console.error("Error processing alert:", error);
      throw error;
    }
  },

  getAlertById: async (id:string):Promise<Alert> => {
    return {
      id: "string",
      type: "string",
      origin: "string",
      assignedTo: "string",
      status: "string"
    }
  }
};

export default AlertService;