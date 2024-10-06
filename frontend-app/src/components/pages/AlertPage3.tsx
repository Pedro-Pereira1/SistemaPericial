import React, { useState, useEffect } from "react";
import AlertService from "../../services/AlertService";

// Define the structure of the API response
interface AlertResponse {
    action: string;
}

interface Message {
    sender: 'bot' | 'user';
    text: string;
}

const AlertPage3: React.FC = () => {
    // State for messages in the chat
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState<string>(""); // User input field
    const [creatorKnown, setCreatorKnown] = useState<boolean | null>(null);
    const [creatorResponded, setCreatorResponded] = useState<boolean | null>(null);
    const [expertSystem, setExpertSystem] = useState<string | null>(null); // Selected expert system
    const [onExpertSystem, setOnExpertSystem] = useState<boolean>(false); // Flag to check if expert system is selected
    const [isProcessComplete, setIsProcessComplete] = useState<boolean>(false); // Track when process is complete

    // Initialize the chat with the first question
    useEffect(() => {
        const initialQuestion = "Is the Creator Known? (Please answer with 'Yes' or 'No')";
        setMessages([{ sender: 'bot', text: initialQuestion }]);
    }, []);

    // Function to handle sending a message
    const sendMessage = async (message: string) => {
        // Display user message
        setMessages(prevMessages => [...prevMessages, { sender: 'user', text: message }]);
        
        // Check for responses
        if (message.toLowerCase() === "yes") {
            if (creatorKnown === null) {
                setCreatorKnown(true);
                setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: "Great! An email was sent to the creator! \nDid the creator respond? (Please answer with 'Yes' or 'No')" }]);
            } else if (creatorResponded === null) {
                // Here we ask if the creator responded
                setCreatorResponded(true);
                askForExpertSystem();
            }
        } else if (message.toLowerCase() === "no") {
            if (creatorKnown === null) {
                setCreatorKnown(false);
                askForExpertSystem();
            } else if (creatorResponded === null) {
                setCreatorResponded(false);
                askForExpertSystem();
            }
        } else {
            setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: "Please answer with 'Yes' or 'No'" }]);
        }
        
        // Clear input after sending
        setUserInput(""); 
    };

    // Function to ask for expert system selection
    const askForExpertSystem = () => {
        setOnExpertSystem(true);
        setMessages(prevMessages => [
            ...prevMessages, 
            { sender: 'bot', text: "Which Expert System do you want to use? (Please type 'ExpertSystem1' or 'ExpertSystem2')" }
        ]);
    };

    // Handle alert processing with the selected expert system
    const handleExpertSystemSelection = async (message: string) => {
        const selectedSystem = message.toLowerCase();

        if (selectedSystem === 'expertsystem1' || selectedSystem === 'expertsystem2') {
            setExpertSystem(selectedSystem);
            const alertContext = {
                creatorKnown,
                creatorResponded,
                expertSystem: selectedSystem, // Add selected expert system to context
            };
            console.log("Submitting alert context:", alertContext);

            try {
                const result: AlertResponse = await AlertService.processAlert(alertContext);
                if (result) {
                    setMessages(prevMessages => [
                        ...prevMessages, 
                        { sender: 'bot', text: `Expert System Response: ${result}` }
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
        } else {
            setMessages(prevMessages => [
                ...prevMessages, 
                { sender: 'bot', text: "Please type 'ExpertSystem1' or 'ExpertSystem2'" }
            ]);
        }
    };

    // Handle form submission
    const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent page refresh on form submit
        if (onExpertSystem) {
            // If expert system is selected, handle it
            handleExpertSystemSelection(userInput);
            setMessages(prevMessages => [...prevMessages, { sender: 'user', text: userInput }]);
        } else {
            // Otherwise, proceed with regular message send
            sendMessage(userInput);
        }
    };

    // Restart the process by resetting the state
    const handleRestart = () => {
        setMessages([{ sender: 'bot', text: "Is the Creator Known? (Please answer with 'Yes' or 'No')" }]);
        setUserInput("");
        setCreatorKnown(null);
        setCreatorResponded(null);
        setExpertSystem(null);
        setOnExpertSystem(false);
        setIsProcessComplete(false);
    };

    return (
        <div>
            <h1>Chat with the Expert System</h1>
            <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                {messages.map((message, index) => (
                    <div key={index} style={{ textAlign: message.sender === 'user' ? 'right' : 'left' }}>
                        <strong>{message.sender === 'user' ? 'You' : 'Bot'}:</strong>
                        <p style={{ whiteSpace: 'pre-line' }}>{message.text}</p>
                    </div>
                ))}
            </div>

            {!isProcessComplete ? (
                <form onSubmit={handleSubmitForm} style={{ display: 'flex', marginTop: '10px' }}>
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={expertSystem ? "Type your selection for Expert System" : "Type your answer"}
                        style={{ flex: 1, padding: '10px' }}
                        disabled={isProcessComplete} // Disable input after process is complete
                    />
                    <button type="submit" style={{ padding: '10px' }} disabled={isProcessComplete}>Send</button>
                </form>
            ) : (
                <button onClick={handleRestart} style={{ padding: '10px', marginTop: '10px' }}>Restart</button>
            )}
        </div>
    );
};

export default AlertPage3;
