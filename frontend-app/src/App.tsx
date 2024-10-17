import React, { useState } from 'react';
import './App.css'; // Ensure that you have the CSS in the same file or directory
import 'boxicons/css/boxicons.min.css'; // Import Boxicons for the icons.
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Importing react-router-dom

import Dashboard from './components/pages/Dashboard';
import AlertPage1 from './components/pages/AlertPage1';
import AlertPage2 from './components/pages/AlertPage2';
import AlertPage3 from './components/pages/AlertPage3';
import AlertPage4 from './components/pages/AlertPage_SLA';
import History from './components/pages/History';
import Settings from './components/pages/Settings';
import Profile from './components/pages/Profile';
import NotFoundPage from './components/pages/NotFoundPage';

const App: React.FC = () => {
  const [isSidebarClosed, setSidebarClosed] = useState(false); // Sidebar toggle
  const [isSubMenuOpen, setSubMenuOpen] = useState(false); // Submenu toggle
  const [searchTerm, setSearchTerm] = useState(''); // Search term state for filtering submenu

  const toggleSidebar = () => {
    setSidebarClosed(!isSidebarClosed);
  };

  const toggleSubMenu = () => {
    setSubMenuOpen(!isSubMenuOpen);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // Update the search term
  };

  // List of alert categories
  const alertCategories = [
    { name: 'Suspicious Account Creation', path: '/alerts/category1' },
    { name: 'Category 2', path: '/alerts/category2' },
    { name: 'Category 3', path: '/alerts/category3' },
    { name: 'Simultaneous Login Activity', path: '/alerts/category4' },
  ];

  // Filter alert categories based on the search term
  const filteredCategories = alertCategories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Router>
      <div>
        {/* Sidebar Section */}
        <div className={`sidebar ${isSidebarClosed ? 'close' : ''}`}>
          <div className="logo-details">
            <i className='bx bx-shield-alt-2'></i>
            <span className="logo_name">Shield AI</span>
          </div>
          <ul className="nav-links">
            <li>
              <Link to="/">
                <i className='bx bx-home'></i>
                <span className="link_name">Dashboard</span>
              </Link>
            </li>

            <li className={isSubMenuOpen ? 'showMenu' : ''}>
              <div className="iocn-link">
                <Link to="/alerts">
                  <i className='bx bx-alarm-exclamation'></i>
                  <span className="link_name">Alerts</span>
                </Link>
                <i className={`bx bxs-chevron-down arrow`} onClick={toggleSubMenu}></i>
              </div>

              {/* Search bar for filtering alerts */}
              {isSubMenuOpen && (
                <div className="search-container">
                  <input
                    type="text"
                    className="search-bar"
                    placeholder="Search Alerts"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              )}

              {/* Submenu */}
              <ul className="sub-menu">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category, index) => (
                    <li key={index}>
                      <Link to={category.path} title={category.name}>{category.name}</Link>
                    </li>
                  ))
                ) : (
                  <li>No categories found</li>
                )}
              </ul>
            </li>

            <li>
              <Link to="/history">
                <i className='bx bx-history'></i>
                <span className="link_name">History</span>
              </Link>
            </li>

            <li>
              <Link to="/settings">
                <i className='bx bx-cog'></i>
                <span className="link_name">Settings</span>
              </Link>
            </li>

            <li>
              <Link to="/profile">
                <i className='bx bx-user'></i>
                <span className="link_name">Profile</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Home Section */}
        <div className={`home-section ${isSidebarClosed ? 'close' : ''}`}>
          <div className="home-content">
            <i className='bx bx-menu' onClick={toggleSidebar}></i>
            <span className="text">Home</span>
          </div>

          {/* Routes will be rendered here */}
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/alerts/category1" element={<AlertPage1 />} />
              <Route path="/alerts/category2" element={<AlertPage2 />} />
              <Route path="/alerts/category3" element={<AlertPage3 />} />
              <Route path="/alerts/category4" element={<AlertPage4 />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
