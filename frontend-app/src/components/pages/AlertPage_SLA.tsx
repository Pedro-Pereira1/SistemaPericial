import React, { useState, useEffect } from "react";
import AlertService from "../../services/AlertService_SLA";
import 'boxicons/css/boxicons.min.css';

interface Question {
  type: 'multiple-choice' | 'text';
  text: string;
  possibleAnswers?: string[];
}

interface Conclusion {
  summary: string;
}

interface Evidences {
  alertId: string;
  multipleLocations: string | null;
  legitimateBehavior: string | null;
  abnormalPattern: string | null;
  mfaEnabled: string | null;
  userContacted: string | null;
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

const AlertPage_SLA: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>(""); // User input field
  const [expertSystem, setExpertSystem] = useState<string | null>(null); // Selected expert system
  const [isProcessComplete, setIsProcessComplete] = useState<boolean>(false); // Track when process is complete
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null); // Track the current question
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message for invalid input
  const [alertResponse, setAlertResponse] = useState<AlertResponse | null>(null); // Track the alert response
  const [evidences, setEvidences] = useState<Evidences>({
    alertId: "SLA",
    multipleLocations: "null",
    legitimateBehavior: "null",
    abnormalPattern: "null",
    mfaEnabled: "null",
    userContacted: "null"
  });

  // Initialize the chat with the first question
  useEffect(() => {
    const initialQuestion = "Which Expert System do you want to use? (Please type 'ExpertSystem1' or 'ExpertSystem2')";
    setMessages([{ sender: 'bot', text: initialQuestion }]);
  }, []);

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
      console.log("0." + evidences);
      console.log("1." + evidences.multipleLocations);
      console.log("2." + alertResponse?.parameterNumber);
      console.log("3." + message.toLowerCase());
      update(alertResponse?.parameterNumber as keyof Evidences, message.toLowerCase());      
      console.log("4." + evidences.multipleLocations);
    }
    
    


    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: message }]);

    // If expert system is not selected, handle expert system selection
    if (!expertSystem) {
      handleExpertSystemSelection(message);
    } else {
      // Send the user input to the backend and get the next question or conclusion
      await fetchNextQuestionOrConclusion(message);
    }

    // Clear input after sending
    setUserInput("");
  };

  const update = (param: keyof Evidences, value: string) => {
    evidences[param] = value;
  };

  /// Handle expert system selection
  const handleExpertSystemSelection = (message: string) => {
    const selectedSystem = message.toLowerCase();
    if (selectedSystem === 'expertsystem1' || selectedSystem === 'expertsystem2') {
      setExpertSystem(selectedSystem);
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: 'bot', text: `Expert System ${selectedSystem.toUpperCase()} selected. Please wait for the next question...` }
      ]);

      // Pass the expert system to fetchNextQuestionOrConclusion after setting it
      fetchNextQuestionOrConclusion("", selectedSystem); // <-- Pass the selected expert system
    } else {
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: 'bot', text: "Please type 'ExpertSystem1' or 'ExpertSystem2'" }
      ]);
    }
  };

  // Fetch the next question or conclusion from the backend
  const fetchNextQuestionOrConclusion = async (userResponse: string, expertSystemOverride?: string) => {
    const systemToUse = expertSystemOverride || expertSystem; // Use the override if available, otherwise use state
    const alertContext = {
      alertId: "SLA",
      expertSystem: systemToUse!,
      userResponse,
      input: evidences
    };

    try {
      // Call the backend service to process the alert and get the next question
      let result: any;
    
      if (alertContext.expertSystem === 'expertsystem1') {
        result = await AlertService.processAlertDrools(alertContext);
      } else if (alertContext.expertSystem === 'expertsystem2') {
        result = await AlertService.processAlertProlog(alertContext);
      }

      if (result.currentStep === 'question') {
        setMessages(prevMessages => [
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
  const handleRestart = () => {
    setMessages([{ sender: 'bot', text: "Which Expert System do you want to use? (Please type 'ExpertSystem1' or 'ExpertSystem2')" }]);
    setUserInput("");
    setExpertSystem(null);
    setCurrentQuestion(null);
    setIsProcessComplete(false);
    setEvidences({
      alertId: "SLA",
      multipleLocations: "null",
      legitimateBehavior: "null",
      abnormalPattern: "null",
      mfaEnabled: "null",
      userContacted: "null"
    });
  };

  const fetchWhyExplanation = async () => {
    const alertContext = {
      alertId: "SLA",
      input: evidences
    };

    if (expertSystem === 'expertsystem1' && currentQuestion) {
      try {
        const explanation = await AlertService.getWhyExplanationDrools(alertContext);
        alert(`Why this question? ${explanation}`); // Use window alert to show the reason
      } catch (error) {
        console.error("Error fetching why explanation:", error);
        alert("Unable to fetch the reason for this question.");
      }
    }
  };

  const fetchRelevanceExplanation = async () => {
    if (expertSystem === 'expertsystem1' && currentQuestion) {
      try {
        //const explanation = await AlertService.getWhyExplanationDrools(alertContext);
        const explanation = alertResponse?.relevance;
        alert(`Why this question? ${explanation}`); // Use window alert to show the reason
      } catch (error) {
        console.error("Error fetching why explanation:", error);
        alert("Unable to fetch the reason for this question.");
      }
    }
  };

  return (
    <div>
      <h1>Simultaneous Login Activity</h1>
      <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ textAlign: message.sender === 'user' ? 'right' : 'left' }}>
           <i /*className='bx bx-bot' style={{ fontSize: '20px', marginRight: '10px' }}*/></i> 
            <strong>{message.sender === 'user' ? 'You' : 'Bot' }:</strong>
            <p style={{ whiteSpace: 'pre-line' }}>{message.text}</p>
          </div>
        ))}
      </div>

      {errorMessage && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          <strong>{errorMessage}</strong>
        </div>
      )}

{isProcessComplete ? (
        <div style={{ display: 'flex', marginTop: '10px' }}>
          <button onClick={handleRestart} style={{ padding: '10px' }}>Restart</button>
          {expertSystem === 'expertsystem1' && (
            <button title="Why was this conclusion made?" style={{ padding: '10px', marginLeft: '0px' }} onClick={fetchWhyExplanation}>
              Why
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmitForm} style={{ display: 'flex', marginTop: '10px' }}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={currentQuestion?.type === 'multiple-choice' ? `Select an answer (${currentQuestion.possibleAnswers?.join(", ")})` : "Type your response"}
            style={{ flex: 1, padding: '10px' }}
          />
          <button type="submit" style={{ padding: '10px' }}>Send</button>
          {expertSystem === 'expertsystem1' && currentQuestion && (
            <button title="Why this question is relevant?" type="button" style={{ padding: '10px', marginLeft: '0px' }} onClick={fetchRelevanceExplanation}>
              Relevance
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default AlertPage_SLA;