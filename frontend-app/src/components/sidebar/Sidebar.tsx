// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import DualButton from '../dual_button/DualButton';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <DualButton left_button_text='Prolog' right_button_text='Drools'/>
      </div>
      <div className='base-division'/>
      <input type='text'/>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
