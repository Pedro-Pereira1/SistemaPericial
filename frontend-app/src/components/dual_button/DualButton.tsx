import React, { useState } from 'react';
import './DualButton.css';

interface DualButtonProps {
  left_button_text: string;
  right_button_text: string;
  setState: (newState: string) => void; // Function to update the parent state
}

const DualButton: React.FC<DualButtonProps> = ({ left_button_text, right_button_text, setState }) => {
  const [activeButton, setActiveButton] = useState('Drools'); // Track which button is active

  // Function to handle button clicks
  const handleButtonClick = (buttonType: string) => {
    setActiveButton(buttonType); // Set the clicked button as active
    setState(buttonType); // Update the parent component state with the clicked button type
  };

  return (
    <div className="dual-button-container">
      {/* Left Button */}
      <button
        className={`button-left ${activeButton === 'Drools' ? 'active' : ''}`}
        onClick={() => handleButtonClick('Drools')}
      >
        {left_button_text}
      </button>

      {/* Right Button */}
      <button
        className={`button-right ${activeButton === 'Prolog' ? 'active' : ''}`}
        onClick={() => handleButtonClick('Prolog')}
      >
        {right_button_text}
      </button>
    </div>
  );
};

export default DualButton;
