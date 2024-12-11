import React, { useState, useEffect } from 'react';
import './App.css'; // Ensure that you have the CSS in the same file or directory
import 'boxicons/css/boxicons.min.css'; // Import Boxicons for the icons.
import { BrowserRouter as Router, Routes, Route, Link, Navigate  } from 'react-router-dom'; // Importing react-router-dom
import Dashboard from './components/pages/Dashboard/Dashboard';
import CyberMentor from './components/pages/CyberMentor/CyberMentor';
import AlertPage_MultipleLoginFailuresForAUserAccount from './components/pages/CyberMentor/AlertPage_MLF';
import AlertPage_CMF from './components/pages/CyberMentor/AlertPage_CMF';
import AlertPage_SLA from './components/pages/CyberMentor/AlertPage_SLA';
import AlertPage_NUA from './components/pages/CyberMentor/AlertPage_NUA';
import AlertPage_UDC from './components/pages/CyberMentor/AlertPage_UDC';
import AlertPage_PS from './components/pages/CyberMentor/AlertPage_PS';
import History from './components/pages/History/History';
import Settings from './components/pages/Settings/Settings';
import Profile from './components/pages/Profile/Profile';
import NotFoundPage from './components/pages/NotFoundPage/NotFoundPage';
import DualButton from './components/dual_button/DualButton';
import Website from './components/pages/Website/Website'; 
import Reports from './components/pages/Reports/Reports'; 
import AuthPage from './components/pages/Auth-Register/AuthPage';
import AlertGenerator from './components/pages/AlertGenerator/AlertGenerator';
import AlertsToResolve from './components/pages/AlertsToResolve/AlertsToResolve';
import AllAlertsPage from './components/pages/Alerts/AllAlertsPage';
import AlertPage from './components/pages/Alert/Alert';
import Metrics from './components/pages/Metrics/Metrics';
import UserManager from './components/pages/userManager/UserManager';

const App: React.FC = () => {
  const [isSidebarClosed, setSidebarClosed] = useState(false);
  const [isSubMenuOpen, setSubMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const darkMode = savedMode ? JSON.parse(savedMode) : false;
    document.body.classList.toggle('dark-mode', darkMode);
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  const toggleSidebar = () => {
    setSidebarClosed(!isSidebarClosed)
    if (isSubMenuOpen) setSubMenuOpen(false);
  };
  const toggleSubMenu = () => setSubMenuOpen(!isSubMenuOpen);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);
  const [expertSystem, setExpertSystem] = useState<string>(
    localStorage.getItem('expertSystem') || 'Drools'
  );

  // List of alert categories
  const alertCategories = [
    { name: 'Multiple Login Failures Alert', path: '/alerts/multiple-login-failures' },
    { name: 'Changes made to the firewall', path: '/alerts/changes-made-to-the-firewall' },
    { name: 'Simultaneous Login Activity', path: '/alerts/simultaneous-login-activity' },
    { name: 'New User Account', path: '/alerts/new-user-account' },
    { name: 'User data has been changed', path: '/alerts/user-data-has-been-changed' },
    { name: 'Port Scan', path: '/alerts/port-scan' },
  ];

  const filteredCategories = alertCategories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Router>
      {isAuthenticated ? (
        <div className='test'>
          {/* Sidebar Section */}
          {(
            <div className={`sidebar ${isSidebarClosed ? 'close' : ''}`}>
              <div className="logo-details">
                <i className='bx bx-shield-alt-2'></i>
                <span className="logo_name">Shield AI</span>
              </div>    
  
              <ul className="nav-links">
                <li><Link to="/"><i className='bx bx-home'></i><span className="link_name">Dashboard</span></Link></li>
                <li><Link to="/website"><i className='bx bx-globe'></i><span className="link_name">Website</span></Link></li>
                <li><Link to="/reports"><i className='bx bxs-report'></i><span className="link_name">Reports</span></Link></li>
                
              {user.role === 'SOC Manager' ? (
                <>
                  <li><Link to="/alert-generator"><i className='bx bxs-show'></i><span className="link_name">Alert Generator</span></Link></li>
                  <li><Link to="/all-alerts"><i className='bx bxs-data'></i><span className="link_name">All Alerts</span></Link></li>
                  <li><Link to="/user-manager"><i className='bx bxs-user-account'></i><span className="link_name">User Manager</span></Link></li>
                </>
              ) : (
                <li><Link to="/my-alerts"><i className='bx bx-alarm-exclamation'></i><span className="link_name">My Alerts</span></Link></li>
              )}


                <li className={isSubMenuOpen ? 'showMenu' : ''}>
                  <div className="iocn-link">
                    <Link to="/cybermentor">
                      <i className='bx bx-pencil'></i>
                      <span className="link_name">CyberMentor</span>
                    </Link>
                    <i className={`bx bxs-chevron-down arrow`} onClick={toggleSubMenu}></i>
                  </div>
  
                  {isSubMenuOpen && (
                    <>
                      <DualButton left_button_text='Drools' right_button_text='Prolog' setState={setExpertSystem}/>
                      <div className="search-container">
                        <input
                          type="text"
                          className="search-bar"
                          placeholder="Search Alerts"
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                      </div>
                    </>
                  )}
  
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
  
                <li><Link to="/history"><i className='bx bx-history'></i><span className="link_name">History</span></Link></li>
                <li><Link to="/settings"><i className='bx bx-cog'></i><span className="link_name">Settings</span></Link></li>
                <li><Link to="/profile"><i className='bx bx-user'></i><span className="link_name">Profile</span></Link></li>
              </ul>
            </div>
          )}
  
          {/* Main Section */}
          <div className={`home-section ${isSidebarClosed ? 'close' : ''}`}>
            <div className="home-content">
              {<i className='bx bx-menu' onClick={toggleSidebar}></i>}
              <span className="text">Home</span>
            </div>
  
            {/* Routes */}
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/website" element={<Website />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/cybermentor" element={<CyberMentor />} />
                <Route path="/alert-generator" element={<Metrics />} />
                <Route path="/manual-alerts" element={<AlertGenerator/>} />
                <Route path="/all-alerts" element={<AllAlertsPage />} />
                <Route path="/my-alerts" element={<AlertsToResolve />} />
                <Route path="/user-manager" element={<UserManager />} />
                <Route path="/alerts/multiple-login-failures" element={<AlertPage_MultipleLoginFailuresForAUserAccount expert_system={expertSystem}/>} />
                <Route path="/alerts/changes-made-to-the-firewall" element={<AlertPage_CMF expert_system={expertSystem}/>} />
                <Route path="/alerts/simultaneous-login-activity" element={<AlertPage_SLA expert_system={expertSystem}/>} />
                <Route path="/alerts/new-user-account" element={<AlertPage_NUA expert_system={expertSystem}/>} />
                <Route path="/alerts/user-data-has-been-changed" element={<AlertPage_UDC expert_system={expertSystem}/>} />
                <Route path="/alerts/port-scan" element={<AlertPage_PS expert_system={expertSystem}/>} />
                <Route path="/history" element={<History />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/alert/:id" element={<AlertPage/>} />
                
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <AuthPage />
      )}
    </Router>
  );
}  

export default App;
