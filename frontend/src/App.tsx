import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className="content" style={{ marginLeft: '250px', padding: '20px' }}>
          <Routes>
            {/* Add more routes for other sections */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;