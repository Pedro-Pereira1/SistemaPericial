import React, { useEffect, useState } from 'react';
import './DualButton.css';

interface DualButtonProps {
  left_button_text: string;
  right_button_text: string;
  setState: (newState: string) => void;
}

const DualButton: React.FC<DualButtonProps> = ({ left_button_text, right_button_text, setState }) => {
  
  const [activeButton, setActiveButton] = useState('Drools');

  useEffect(() => {
    handleButtonClick('Drools'); // Trigger click on mount
  }, []);

  const handleButtonClick = (buttonType: string) => {
    setActiveButton(buttonType);
    setState(buttonType);
  };

  return (
    <div className="dual-button-container">
      <input
        className="switch-button-checkbox"
        type="checkbox"
        id="toggle-switch"
        checked={activeButton === 'Prolog'}
        onChange={() => handleButtonClick(activeButton === 'Drools' ? 'Prolog' : 'Drools')}
      />
      <label className="switch-button-label" htmlFor="toggle-switch">
        <span className="switch-button-label-span">{left_button_text}</span>
      </label>
    </div>
  );
};

export default DualButton;
