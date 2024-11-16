import React, { useEffect, useState } from "react";
import './DualButton.css';

interface DualButtonProps {
  left_button_text: string;
  right_button_text: string;
  setState: (newState: string) => void;
}

const DualButton: React.FC<DualButtonProps> = ({
  left_button_text,
  right_button_text,
  setState,
}) => {
  // Fetch the initial state from localStorage or default to 'Drools'
  const [activeButton, setActiveButton] = useState<string>(
    localStorage.getItem('expertSystem') || 'Drools'
  );

  useEffect(() => {
    // Set the initial state to the parent and localStorage on mount
    setState(activeButton);
    localStorage.setItem('expertSystem', activeButton);
  }, [activeButton, setState]);

  const handleButtonClick = () => {
    // Toggle between 'Drools' and 'Prolog'
    const newSystem = activeButton === 'Drools' ? 'Prolog' : 'Drools';
    setActiveButton(newSystem);
    localStorage.setItem('expertSystem', newSystem);
    setState(newSystem); // Update the parent component
  };

  return (
    <div className="dual-button-container">
      <input
        className="switch-button-checkbox"
        type="checkbox"
        id="toggle-switch"
        checked={activeButton === 'Prolog'}
        onChange={handleButtonClick}
      />
      <label className="switch-button-label" htmlFor="toggle-switch">
        <span className="switch-button-label-span">
          {activeButton === 'Drools' ? left_button_text : right_button_text}
        </span>
      </label>
    </div>
  );
};

export default DualButton;
