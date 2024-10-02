import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import AlertPage1 from './components/AlertPage1';
import AlertPage2 from './components/AlertPage2';
import AlertPage3 from './components/AlertPage3';
import NotFoundPage from './components/NotFoundPage';
import './styles.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/alert1" element={<AlertPage1 />} />
                <Route path="/alert2" element={<AlertPage2 />} />
                <Route path="/alert3" element={<AlertPage3 />} />
                <Route path="*" element={<NotFoundPage />} /> {/* Catch-all for undefined routes */}
            </Routes>
        </Router>
    );
};

export default App;
