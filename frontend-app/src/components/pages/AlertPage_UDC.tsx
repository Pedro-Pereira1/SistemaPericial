import React, { useState, useEffect } from "react";
import AlertService from "../../services/AlertService";
import HistoryService from "../../services/historyService";
import generalService from "../../services/generalService";
import 'boxicons/css/boxicons.min.css';

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
      
        const explanationList = await AlertService.getHowExplanationDrools(alertContext);
        HistoryService.postHistory({ alertType: "SLA",rules: explanationList });
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
      const explanation = alertResponse?.relevance;
      const explanationList = await AlertService.getWhyExplanation(alertResponse?.evidences as Evidences, expertSystem);
      alert(`Why this question is relevant?\n${explanation}\n\nHow we reach this conclusion?\n${explanationList.join('\n')}`);
    } catch (error) {
      console.error("Error fetching why explanation:", error);
      alert("Unable to fetch the reason for this question.");
    }
  }
};

const fetchWhyNotExplanation = async () => {
  if ((expertSystem === 'Drools' || expertSystem === 'Prolog') && currentQuestion) {
    try {
      const conclusions = await AlertService.getPossibleConclusions();
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
    <div>
      <h1>User data has been changed</h1>
      <div
        style={{
          maxHeight: '400px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '5px',
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{ textAlign: message.sender === 'user' ? 'right' : 'left' }}
          >
            <strong>{message.sender === 'user' ? 'You' : 'Bot'}:</strong>
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
          <button onClick={handleRestart} style={{ padding: '10px' }}>
            Restart
          </button>
          {(expertSystem === 'Drools' || expertSystem === 'Prolog') && (
            <button
              title="How was this conclusion made?"
              style={{ padding: '10px', marginLeft: '0px' }}
              onClick={fetchHowExplanation}
            >
              How?
            </button>
          )}
          {(expertSystem === 'Drools' || expertSystem === 'Prolog') && (
            <>
              <button
                title="Why this question is relevant?"
                style={{ padding: '10px', marginLeft: '0px' }}
                onClick={fetchWhyExplanation}
              >
                Why?
              </button>
              <button
                title="Why was this option not chosen?"
                style={{ padding: '10px', marginLeft: '0px' }}
                onClick={fetchWhyNotExplanation}
              >
                Why Not?
              </button>
            </>
          )}
        </div>
      ) : (
        <div>
          <form
            onSubmit={isStarted ? handleSubmitForm : (e) => {
              e.preventDefault();
              startProcess();
            }}
            style={{ display: 'flex', marginTop: '10px' }}
          >
            {currentQuestion?.type === 'list-question' && currentQuestion.possibleAnswers ? (
              // Render a dropdown list for list-question
              <select
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                style={{ flex: 1, padding: '10px' }}
              >
                <option value="" disabled>Select an option</option> {/* Placeholder */}
                {currentQuestion.possibleAnswers.map((answer, index) => (
                  <option key={index} value={answer}>
                    {answer}
                  </option>
                ))}
              </select>
            ) : (
              // Render the normal input field for other types of questions
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={
                  !isStarted
                    ? "Click 'Start' to enable input"
                    : currentQuestion?.type === 'multiple-choice'
                    ? `Select an answer (${currentQuestion.possibleAnswers?.join(', ')})`
                    : currentQuestion?.type === 'ip-quest'
                    ? 'Enter a valid IP address'
                    : 'Type your response'
                }
                style={{ flex: 1, padding: '10px' }}
                disabled={!isStarted}
              />
            )}
            <button type="submit" style={{ padding: '10px', marginLeft: '0px' }}>
              {isStarted ? 'Send' : 'Start'}
            </button>
            {isStarted && expertSystem === 'Drools' && currentQuestion && (
              <button
                title="Why this question is relevant?"
                type="button"
                style={{ padding: '10px', marginLeft: '0px' }}
                onClick={fetchWhyExplanation}
              >
                Why?
              </button>
            )}
          </form>
        </div>
      )}
  
      {/* Add the Why Not dropdown here */}
      {showWhyNotDropdown && (
        <div style={{ marginTop: '10px' }}>
          <label>Select a conclusion to understand why it wasn't reached:</label>
          <select
            value={selectedConclusion}
            onChange={(e) => setSelectedConclusion(e.target.value)}
            style={{ padding: '10px', marginLeft: '10px' }}
          >
            <option value="" disabled>Select a conclusion</option>
            {possibleConclusions.map((conclusion, index) => (
              <option key={index} value={conclusion}>
                {conclusion}
              </option>
            ))}
          </select>
          <button onClick={handleWhyNotExplanation} style={{ padding: '10px', marginLeft: '10px' }}>
            Explain Why Not
          </button>
        </div>
      )}
    </div>
  );
};

export default Alert_Evidences;