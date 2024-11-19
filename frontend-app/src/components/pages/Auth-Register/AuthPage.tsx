import React, { useState } from 'react';
import UserService, { User } from '../../../services/UserService';
import './AuthPage.css';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginDetails, setLoginDetails] = useState({ email: '', password: '' });
  const [registerDetails, setRegisterDetails] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    picture: '',
  });

  const profilePictures = [
    '/images/profile1.png',
    '/images/profile2.png',
    '/images/profile3.png',
    '/images/profile4.png',
    '/images/profile5.png',
    '/images/profile6.png',
    '/images/profile7.png',
    '/images/profile8.png',
  ];

  const roles = ['SOC Manager', 'SOC Tier1', 'SOC Tier2', 'SOC Tier3'];

  const handleLogin = () => {
    const user = UserService.login(loginDetails.email, loginDetails.password);
    if (user) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/';
    } else {
      alert('Invalid email or password');
    }
  };

  const handleRegister = () => {
    if (!registerDetails.email.endsWith('@shield-ai.com')) {
      alert('Email must be @shield-ai.com');
      return;
    }

    if (
      !registerDetails.name ||
      !registerDetails.password ||
      !registerDetails.phone ||
      !registerDetails.role ||
      !registerDetails.picture
    ) {
      alert('All fields are required');
      return;
    }

    const newUser = UserService.register(registerDetails);

    alert(`Registration successful! Your User ID: ${newUser.id}`);
    setIsLogin(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (isLogin) {
      setLoginDetails((prev) => ({ ...prev, [name]: value }));
    } else {
      setRegisterDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="auth-container">
      <h2 className="classH2">{isLogin ? 'Login' : 'Register'}</h2>

      {isLogin ? (
        <div className="form-container">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={loginDetails.email}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginDetails.password}
            onChange={handleInputChange}
          />
          <button onClick={handleLogin}>Login</button>
          <p>
            Don't have an account?{' '}
            <span onClick={() => setIsLogin(false)}>Register</span>
          </p>
        </div>
      ) : (
        <div className="form-container">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={registerDetails.name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email (@shield-ai.com)"
            value={registerDetails.email}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={registerDetails.password}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={registerDetails.phone}
            onChange={handleInputChange}
          />
          <select
            name="role"
            value={registerDetails.role}
            onChange={handleInputChange}
          >
            <option value="">Select Role</option>
            {roles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
          </select>
          <div className="profile-picture-selection">
            <p>Select Profile Picture:</p>
            <div className="pictures">
              {profilePictures.map((pic, index) => (
                <img
                  key={index}
                  src={pic}
                  alt={`Profile ${index + 1}`}
                  className={registerDetails.picture === pic ? 'selected' : ''}
                  onClick={() =>
                    setRegisterDetails((prev) => ({
                      ...prev,
                      picture: pic,
                    }))
                  }
                />
              ))}
            </div>
          </div>
          <button onClick={handleRegister}>Register</button>
          <p>
            Already have an account?{' '}
            <span onClick={() => setIsLogin(true)}>Login</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthPage;