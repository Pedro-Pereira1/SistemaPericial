import React, { useState, useEffect } from "react";
import AlertService from "../../services/AlertService_Alert_MultipleLoginFailuresForAUserAccount";
import 'boxicons/css/boxicons.min.css';

interface Question {
  type: 'multiple-choice' | 'text';
  text: string;
  possibleAnswers?: string[];
}

interface Conclusion {
  summary: string;
}

interface MultipleLoginFailuresForAUserAccount {
  alertId: string;
    user_known_1: string | null;
    was_the_user_1: string | null;
    are_there_multiple_ips: string | null;
    does_the_number_of_ips_make_sense: string | null;
    is_the_reccurence_just: string | null;
    user_known_2: string | null;
    was_the_user_2: string | null;
    origins_just: string | null;
    national_ip: string | null;
}

interface AlertResponse {
  currentStep: 'question' | 'conclusion';
  question?: Question;
  conclusion?: Conclusion;
  evidences?: MultipleLoginFailuresForAUserAccount;  // <-- New field
  parameterNumber: String;
  relevance: String;
}

interface Message {
  sender: 'bot' | 'user';
  text: string;
}
const base:MultipleLoginFailuresForAUserAccount = {
  alertId:"MLF",
  user_known_1: "null",
  was_the_user_1: "null",
  are_there_multiple_ips: "null",
  does_the_number_of_ips_make_sense: "null",
  is_the_reccurence_just: "null",
  user_known_2: "null",
  was_the_user_2: "null",
  origins_just: "null",
  national_ip: "null"
}

interface AlertProps {
  expert_system:string
}

const Alert_MultipleLoginFailuresForAUserAccount: React.FC<AlertProps> = (props:AlertProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>(""); // User input field
  const [expertSystem, setExpertSystem] = useState<string | null>(null); // Selected expert system
  const [isProcessComplete, setIsProcessComplete] = useState<boolean>(false); // Track when process is complete
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null); // Track the current question
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message for invalid input
  const [alertResponse, setAlertResponse] = useState<AlertResponse | null>(null); // Track the alert response
  const [evidences, setMultipleLoginFailuresForAUserAccount] = useState<MultipleLoginFailuresForAUserAccount>(base);
  useEffect(() => {
    if(props.expert_system === "Drools")
      AlertService.clearDrools();
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
      update(alertResponse?.parameterNumber as keyof MultipleLoginFailuresForAUserAccount, message.toLowerCase());      
    }
    
    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: message }]);

    await fetchNextQuestionOrConclusion(message);


    // Clear input after sending
    setUserInput("");
  };

  const update = (param: keyof MultipleLoginFailuresForAUserAccount, value: string) => {
    evidences[param] = value;
  };

  const convertToJsonFormat = (data: MultipleLoginFailuresForAUserAccount): { fact_name: string; variables: (number | string)[] } => {
    return {
        fact_name: "alert",
        variables: [
            1,
            data.user_known_1 ?? "null",
            data.was_the_user_1 ?? "null",
            data.are_there_multiple_ips ?? "null",
            data.does_the_number_of_ips_make_sense ?? "null",
            data.is_the_reccurence_just ?? "null",
            data.user_known_2 ?? "null",
            data.was_the_user_2 ?? "null",
            data.origins_just ?? "null",
            data.national_ip ?? "null",
        ]
    };
  }
  // Fetch the next question or conclusion from the backend
  const fetchNextQuestionOrConclusion = async (userResponse: string) => {
    const alertContext = {
      alertId: "MLF",
      expertSystem: props.expert_system!,
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
        setMessages(prevMessages => [
          ...prevMessages,
          { sender: 'bot', text: `Next Question: ${result.question?.text}` }
        ]);
        setCurrentQuestion(result.question || null); // Update current question
        setAlertResponse(result); // Update alert response
        //setMultipleLoginFailuresForAUserAccount(result.evidences);
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
  const handleRestart = async () => {
    setMessages([{ sender: 'bot', text: "The selected system is " + props.expert_system }]);
    setUserInput("");
    setExpertSystem(props.expert_system);
    setCurrentQuestion(null);
    setIsProcessComplete(false);
    setMultipleLoginFailuresForAUserAccount({
      alertId:"MLF",
      user_known_1: "null",
      was_the_user_1: "null",
      are_there_multiple_ips: "null",
      does_the_number_of_ips_make_sense: "null",
      is_the_reccurence_just: "null",
      user_known_2: "null",
      was_the_user_2: "null",
      origins_just: "null",
      national_ip: "null"
    });
    await AlertService.reset_prolog();
    AlertService.clearDrools(); // Clear Drools session on component mount
  };

  const fetchHowExplanation = async () => {
    const alertContext = {
      alertId: "MLF",
      input: evidences
    };
  
    if (expertSystem === 'Drools' && currentQuestion) {
      try {
        const explanationList = await AlertService.getHowExplanationDrools(alertContext);
        
        // Check if explanationList is indeed an array
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
    if (expertSystem === 'Drools' && currentQuestion) {
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
      <p>Sistema Escolhido: {props.expert_system}</p>
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
            <button title="Why was this conclusion made?" style={{ padding: '10px', marginLeft: '0px' }} onClick={fetchHowExplanation}>
              How?
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
            <button title="Why this question is relevant?" type="button" style={{ padding: '10px', marginLeft: '0px' }} onClick={fetchWhyExplanation}>
              Why?
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default Alert_MultipleLoginFailuresForAUserAccount;
