import React, { useState, useEffect } from "react";
import AlertService from "../../services/AlertService2";
import 'boxicons/css/boxicons.min.css';

interface Question {
  type: 'multiple-choice' | 'text';
  text: string;
  possibleAnswers?: string[];
}

interface Conclusion {
  summary: string;
}

interface AlertResponse {
  alertId: string;
  currentStep: 'question' | 'conclusion';
  question?: Question;
  conclusion?: Conclusion;
  data?:MultipleLoginFailuresForAUserAccount;
  questionState: Number;
}

interface Message {
  sender: 'bot' | 'user';
  text: string;
}


interface MultipleLoginFailuresForAUserAccount {
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

const initialState: MultipleLoginFailuresForAUserAccount = {
    user_known_1: null,
    was_the_user_1: null,
    are_there_multiple_ips: null,
    does_the_number_of_ips_make_sense: null,
    is_the_reccurence_just: null,
    user_known_2: null,
    was_the_user_2: null,
    origins_just: null,
    national_ip: null,
};

const AlertPage2: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>(""); // User input field
  const [expertSystem, setExpertSystem] = useState<string | null>(null); // Selected expert system
  const [questionState, setQuestionState] = useState<Number | null>(null); // Track current question state
  const [isProcessComplete, setIsProcessComplete] = useState<boolean>(false); // Track when process is complete
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null); // Track the current question
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message for invalid input
  const [data, setData] = useState<MultipleLoginFailuresForAUserAccount>(initialState);


  useEffect(() => {
    const initialQuestion = "Which Expert System do you want to use? (Please type 'ExpertSystem1' or 'ExpertSystem2')";
    setMessages([{ sender: 'bot', text: initialQuestion }]);
    setQuestionState(0);
  }, []);

    // Function to update a specific parameter
    const updateValue = (parameterName: keyof MultipleLoginFailuresForAUserAccount, value: string | null) => {
        setData(prevState => ({
            ...prevState,
            [parameterName]: value,
        }));
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
};
  // Fetch the next question or conclusion from the backend
  const fetchNextQuestionOrConclusion = async (userResponse: string, expertSystemOverride?: string) => {
    const systemToUse = expertSystemOverride || expertSystem; // Use the override if available, otherwise use state
    const alertContext = {
      alertId: "SLA",
      expertSystem: systemToUse!,
      userResponse,
      questionState,
    };

    try {
      // Call the backend service to process the alert and get the next question
      let result: any;
    
      if (alertContext.expertSystem === 'expertsystem1') {
        result = await AlertService.processAlertDrools(alertContext);
      } else if (alertContext.expertSystem === 'expertsystem2') {
        const json = convertToJsonFormat(data)
        result = await AlertService.processAlertProlog(json);
        console.log(result.question)
      }

      if (result.currentStep === 'question') {
        setMessages(prevMessages => [
          ...prevMessages,
          { sender: 'bot', text: `Next Question: ${result.question?.text}` }
        ]);
        setCurrentQuestion(result.question || null); // Update current question
        setQuestionState(result.step); // Update question state
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
    setQuestionState(0);
    setCurrentQuestion(null);
    setIsProcessComplete(false);
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

      {!isProcessComplete ? (
        <form onSubmit={handleSubmitForm} style={{ display: 'flex', marginTop: '10px' }}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={currentQuestion?.type === 'multiple-choice' ? `Select an answer (${currentQuestion.possibleAnswers?.join(", ")})` : "Type your response"}
            style={{ flex: 1, padding: '10px' }}
          />
          <button type="submit" style={{ padding: '10px' }}>Send</button>
        </form>
      ) : (
        <button onClick={handleRestart} style={{ padding: '10px', marginTop: '10px' }}>Restart</button>
      )}
    </div>
  );
};

export default AlertPage2;
