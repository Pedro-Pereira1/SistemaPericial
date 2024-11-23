import React, { useState, useEffect } from "react";
import AlertService from "../../../services/AlertService";
import HistoryService from "../../../services/historyService";
import generalService from "../../../services/generalService";
import 'boxicons/css/boxicons.min.css';
import './AlertPage.css';
import { useLocation } from 'react-router-dom';
import UserService from "../../../services/UserService";
import Alert from "../../../domain/Alert";

interface Question {
  type: 'multiple-choice' | 'text' | 'ip-quest' | 'list-question';
  text: string;
  possibleAnswers?: string[];
}

interface Conclusion {
  summary: string;
}

interface Evidences {
    alertId: string;
    userKnown: string | null;
    legitimateAction: string | null;
    ipCollected: string | null;
    helpdeskVerified: string | null;
    reversalPossible: string | null;
}

interface AlertResponse {
  currentStep: 'question' | 'conclusion';
  question?: Question;
  conclusion?: Conclusion;
  evidences?: Evidences;  // <-- New field
  parameterNumber: String;
  relevance: String;
}

interface Message {
  sender: 'bot' | 'user';
  text: string;
}
const base:Evidences = {
  alertId: "UDC",
  userKnown: "null",
  legitimateAction: "null",
  ipCollected: "null",
  helpdeskVerified: "null",
  reversalPossible: "null"
}

interface AlertProps {
  expert_system: string
  alertId?: string; 
}

const Alert_Evidences: React.FC<AlertProps> = (props:AlertProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>(""); // User input field
  const [expertSystem, setExpertSystem] = useState<string | null>(null); // Selected expert system
  const [isProcessComplete, setIsProcessComplete] = useState<boolean>(false); // Track when process is complete
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null); // Track the current question
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message for invalid input
  const [alertResponse, setAlertResponse] = useState<AlertResponse | null>(null); // Track the alert response
  const [evidences, setEvidences] = useState<Evidences>(base);
  const [isStarted, setIsStarted] = useState<boolean>(false); // Check if interaction is started
  const [possibleConclusions, setPossibleConclusions] = useState<string[]>([]); // List of possible conclusions
  const [selectedConclusion, setSelectedConclusion] = useState<string>(""); // Track selected conclusion for "Why Not"
  const [showWhyNotDropdown, setShowWhyNotDropdown] = useState<boolean>(false); // Track if dropdown is shown

  const location = useLocation(); // Hook to access the URL
  const queryParams = new URLSearchParams(location.search); // Parse query parameters
  const alertIdFromQuery = queryParams.get('alertId'); // Get 'alertId' from query
  const [alertId, setAlertId] = useState<string | null>(alertIdFromQuery ?? props.alertId ?? null);
  


  useEffect(() => {
    if (props.expert_system !== "Drools" && props.expert_system !== "Prolog") {
      setMessages([{ sender: 'bot', text: "Please select an expert system to proceed." }]);
      setIsStarted(false); // Prevent the process from starting
    } else {
      if(isStarted) {
        setErrorMessage("You cannot change the expert system after the process has started.");
      }else {
        setMessages([]);
        setMessages(prevMessages => [
          ...prevMessages,
          { sender: 'bot', text: "The selected system is " + props.expert_system }
        ]);
        setExpertSystem(props.expert_system);
        
      }
    }
  }, [props.expert_system]);

// Update the startProcess function to check for the expert system
const startProcess = () => {
  if (!props.expert_system) {
    setErrorMessage("Please select an expert system before starting.");
    return;
  }

  AlertService.clearDrools(); // Clear the Drools session before starting
  AlertService.reset_prolog(); // Clear the Prolog session before starting
  setMessages(prevMessages => [
    ...prevMessages,
    { sender: 'bot', text: "Starting process with system: " + props.expert_system }
  ]);
  //clear error message
  setErrorMessage(null);
  fetchNextQuestionOrConclusion(""); // Fetch the first question
  setIsStarted(true); // Mark as started
};


  // Function to handle sending a message
  const sendMessage = async (message: string) => {
    // Display user message
    setErrorMessage(null);
    // If current question is multiple-choice, validate the input
    if (currentQuestion?.type === 'multiple-choice' && currentQuestion.possibleAnswers) {
      currentQuestion.possibleAnswers = currentQuestion.possibleAnswers.map((answer) => answer.toLowerCase());
      if (!currentQuestion.possibleAnswers.includes(message.toLowerCase())) {
        // If input is invalid, show an error and do not proceed
        setErrorMessage(`Please select a valid answer: ${currentQuestion.possibleAnswers.join(", ")}`);
        return;
      }
      update(alertResponse?.parameterNumber as keyof Evidences, message.toLowerCase());
    }

    // Handle IP-quest validation
    if (currentQuestion?.type === 'ip-quest') {
      const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipRegex.test(message)) {
        setErrorMessage("Please enter a valid IP address.");
        return;
      }else{
        try {
          const result = await generalService.isMalicious(message);
          console.log("Is malicious:", result);
          if(result){
            update(alertResponse?.parameterNumber as keyof Evidences, "no");
          }else{
            update(alertResponse?.parameterNumber as keyof Evidences, "yes");
          }  
      } catch (error) {
          console.error("Error checking if IP is malicious:", error);
      }
    }
  }

    // Handle list-question input
    if (currentQuestion?.type === 'list-question' && currentQuestion.possibleAnswers) {
      currentQuestion.possibleAnswers = currentQuestion.possibleAnswers.map(answer => answer.toLowerCase());
      if (!currentQuestion.possibleAnswers.includes(message.toLowerCase())) {
        setErrorMessage(`Please select an answer from the list: ${currentQuestion.possibleAnswers.join(", ")}`);
        return;
      }
      update(alertResponse?.parameterNumber as keyof Evidences, message.toLowerCase());
    }
    
    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: message }]);

    await fetchNextQuestionOrConclusion(message);


    // Clear input after sending
    setUserInput("");
  };

  const update = (param: keyof Evidences, value: string) => {
    evidences[param] = value;
  };

  const convertToJsonFormat = (data: Evidences): { fact_name: string; variables: (number | string)[] } => {
    return {
        fact_name: "alert",
        variables: [
            "UDC",
            data.userKnown ?? "null",
            data.legitimateAction ?? "null",
            data.ipCollected ?? "null",
            data.helpdeskVerified ?? "null",
            data.reversalPossible ?? "null"
        ]
    };
  }
  // Fetch the next question or conclusion from the backend
  const fetchNextQuestionOrConclusion = async (userResponse: string) => {
    const alertContext = {
      alertId: "UDC",
      expertSystem: expertSystem!,
      userResponse,
      input: evidences
    };

    try {
      // Call the backend service to process the alert and get the next question
      let result: any;
    
      if (alertContext.expertSystem === 'Drools') {
        result = await AlertService.processAlertDrools(alertContext);
      } else if (alertContext.expertSystem === 'Prolog') {
        const x = convertToJsonFormat(alertContext.input);
        result = await AlertService.processAlertProlog(x);
      }

      if (result.currentStep === 'question') {
        await setMessages(prevMessages => [
          ...prevMessages,
          { sender: 'bot', text: `Next Question: ${result.question?.text}` }
        ]);
        setCurrentQuestion(result.question || null); // Update current question
        setAlertResponse(result); // Update alert response
        //setEvidences(result.evidences);
      } else if (result.currentStep === 'conclusion') {
        setMessages(prevMessages => [
          ...prevMessages,
          { sender: 'bot', text: `Conclusion: ${result.conclusion?.description}` }
        ]);
        setIsProcessComplete(true); // Mark process as complete
      
        const explanationList = await AlertService.getHowExplanation(alertContext, expertSystem);
        const alert: Alert[] = await UserService.getAlerts();
        const alertToUpdate = alert.find(alert => alert.id === alertId);
        if (alertToUpdate && alertId) {
          alertToUpdate.resolution = explanationList;
          alertToUpdate.status = "Closed";
          const actualTime = new Date().toISOString().slice(0, 19);
          alertToUpdate.conclusionTime = actualTime;
          await UserService.updateAlertStatus(alertId, alertToUpdate);
          window.location.href = '/my-alerts';
        }
      }
    } catch (error) {
      console.error("Error processing alert:", error);
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: 'bot', text: "There was an error processing your request." }
      ]);
      setIsProcessComplete(true); // Allow restart even on error
    }
  };

  // Handle form submission
  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page refresh on form submit
    sendMessage(userInput);
  };

  // Restart the process by resetting the state
  const handleRestart = async () => {
    window.location.reload();
};


const fetchHowExplanation = async () => {
  const alertContext = {
    alertId: "UDC",
    input: evidences
  };

  if ((expertSystem === 'Drools' || expertSystem === 'Prolog') && currentQuestion) {
    try {
      const explanationList = await AlertService.getHowExplanation(alertContext, expertSystem);
      if (Array.isArray(explanationList)) {
        const formattedExplanation = explanationList.join('\n'); // Join the list into a single string, separated by newlines
        alert(`How we reach this conclusion?\n${formattedExplanation}`);
      } else {
        alert("Explanation is not in the expected format.");
      }
    } catch (error) {
      console.error("Error fetching how explanation:", error);
      alert("Unable to fetch the reason for this question.");
    }
  }
};

const fetchWhyExplanation = async () => {
  if ((expertSystem === 'Drools' || expertSystem === 'Prolog') && currentQuestion) {
    try {
      const explanationList = await AlertService.getWhyExplanation(alertResponse,evidences, expertSystem,"UDC");
      if(expertSystem === 'Drools'){
        const explanation = alertResponse?.relevance;
        alert(`Why this question is relevant?\n${explanation}\n\nHow we reach this conclusion?\n${explanationList.join('\n')}`);
      }else{
        alert(`Why this question is relevant?\n${explanationList}`);
      }
    } catch (error) {
      console.error("Error fetching why explanation:", error);
      alert("Unable to fetch the reason for this question.");
    }
  }
};

const fetchWhyNotExplanation = async () => {
  if ((expertSystem === 'Drools' || expertSystem === 'Prolog') && currentQuestion) {
    try {
      const conclusions = await AlertService.getPossibleConclusions(expertSystem,"UDC");
      setPossibleConclusions(conclusions);
      setShowWhyNotDropdown(true); // Show dropdown for selection
    } catch (error) {
      console.error("Error fetching possible conclusions:", error);
      alert("Unable to fetch possible conclusions.");
    }
  }
};

const handleWhyNotExplanation = async () => {
  if (selectedConclusion) {
    try {
      const explanation = await AlertService.getWhyNotExplanation(alertResponse?.evidences as Evidences, selectedConclusion, expertSystem);
      alert(`Why was this conclusion not reached?\n${explanation}`);
    } catch (error) {
      console.error("Error fetching why-not explanation:", error);
      alert("Unable to fetch the reason why this conclusion was not reached.");
    } finally {
      setShowWhyNotDropdown(false);
    }
  }
};

return (
  <div className="container">
    <h1>User data has been changed - #{alertId}</h1>
    <div className="message-list">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message ${message.sender}`}
        >
          {message.sender === 'bot' && (
            <i className="bx bx-bot icon bot"></i>
          )}
          <div className={`message-bubble ${message.sender}`}>
            <strong>{message.sender === 'user' ? 'You' : 'Bot'}:</strong>
            <p className ="mimi" style={{ whiteSpace: 'pre-line', margin: 0 }}>{message.text}</p>
          </div>
          {message.sender === 'user' && (
            <i className="bx bx-user icon user"></i>
          )}
        </div>
      ))}
    </div>

    {errorMessage && (
      <div className="error-message">
        <strong>{errorMessage}</strong>
      </div>
    )}

    {isProcessComplete ? (
      <div className="button-group">
        <button onClick={handleRestart} className="button">
          Restart
        </button>
        {(expertSystem === 'Drools' || expertSystem === 'Prolog') && (
          <>
          <button title="How was this conclusion made?" className="button" onClick={fetchHowExplanation}>
            How?
          </button>
          { (expertSystem === 'Prolog')&&(
            <button title="Why was this option not chosen?" className="button" onClick={fetchWhyNotExplanation}>
            Why Not?
          </button>
          )}
        </>
        )}
      </div>
    ) : (
      <form
        onSubmit={isStarted ? handleSubmitForm : (e) => {
          e.preventDefault();
          startProcess();
        }}
        style={{ display: 'flex', marginTop: '10px' }}
      >
        {currentQuestion?.type === 'list-question' && currentQuestion.possibleAnswers ? (
          <select
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="input"
          >
            <option value="" disabled>Select an option</option>
            {currentQuestion.possibleAnswers.map((answer, index) => (
              <option key={index} value={answer}>
                {answer}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={isStarted
              ? currentQuestion?.type === 'multiple-choice'
                ? `Select an answer (${currentQuestion.possibleAnswers?.join(', ')})`
                : currentQuestion?.type === 'ip-quest'
                ? 'Enter a valid IP address'
                : 'Type your response'
              : "Click 'Start' to enable input"}
            className="input"
            disabled={!isStarted}
          />
        )}
        <button type="submit" className="button">
          {isStarted ? 'Send' : 'Start'}
        </button>
        {isStarted && (expertSystem === 'Drools' || expertSystem === 'Prolog') && currentQuestion && (
          <button title="Why this question is relevant?" type="button" className="button" onClick={fetchWhyExplanation}>
            Why?
          </button>
        )}
      </form>
    )}

    {showWhyNotDropdown && (
      <div className="dropdown">
        <label>Select a conclusion to understand why it wasn't reached:</label>
        <select
          value={selectedConclusion}
          onChange={(e) => setSelectedConclusion(e.target.value)}
          className="input"
        >
          <option value="" disabled>Select a conclusion</option>
          {possibleConclusions.map((conclusion, index) => (
            <option key={index} value={conclusion}>
              {conclusion}
            </option>
          ))}
        </select>
        <button onClick={handleWhyNotExplanation} className="button">
          Explain Why Not
        </button>
      </div>
    )}
  </div>
);
};

export default Alert_Evidences;