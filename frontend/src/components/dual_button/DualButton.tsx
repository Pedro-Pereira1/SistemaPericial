// DualButton.js
import React from 'react';
import './DualButton.css';

interface DualButtonProps {
    left_button_text:string,
    right_button_text:string
}


const DualButton = (props:DualButtonProps) => {
  return (
    <div className="dual-button-container">
      <button className="button-left">{props.left_button_text}</button>
      <button className="button-right">{props.right_button_text}</button>
    </div>
  );
};

export default DualButton;
