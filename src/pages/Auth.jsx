import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Auth = () => {
  const [activeForm, setActiveForm] = useState('login');
  const [showPassword, setShowPassword] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const togglePassword = (inputId) => {
    setShowPassword(prev => ({
      ...prev,
      [inputId]: !prev[inputId]
    }));
  };

  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = formType === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const res = await axios.post(endpoint, {
        email: form.email,
        password: form.password,
      });
      setIsLoading(false);
      // Save token or user info if returned
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
      }
      if (formType === 'signup') {
        alert('Account created successfully! Welcome to MoneyMate!');
      } else {
        alert('Welcome back! Redirecting to dashboard...');
      }
      navigate('/dashboard');
    } catch (err) {
      setIsLoading(false);
      alert(err.response?.data?.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="mascot-section">
          <div className="mascot">💵</div>
          <h1 className="welcome-text">Welcome to MoneyMate!</h1>
          <p className="welcome-subtitle">
            Join thousands of users who've transformed their financial lives with our AI-powered budgeting companion.
          </p>
          <ul className="features-list">
            <li>
              <span className="feature-icon">🎯</span>
              <span>Smart budget tracking with AI insights</span>
            </li>
            <li>
              <span className="feature-icon">🎮</span>
              <span>Gamified savings with XP and rewards</span>
            </li>
            <li>
              <span className="feature-icon">🎤</span>
              <span>Voice-powered expense logging</span>
            </li>
            <li>
              <span className="feature-icon">📊</span>
              <span>Personalized financial analytics</span>
            </li>
          </ul>
        </div>

        <div className="form-section">
          <div className="auth-toggle-form">
            <button 
              className={`auth-btn ${activeForm === 'login' ? 'active' : ''}`}
              onClick={() => setActiveForm('login')}
            >
              Login
            </button>
            <button 
              className={`auth-btn ${activeForm === 'signup' ? 'active' : ''}`}
              onClick={() => setActiveForm('signup')}
            >
              Sign Up
            </button>
          </div>

          {activeForm === 'login' ? (
            <form className="auth-form active" onSubmit={(e) => handleSubmit(e, 'login')}>
              <h2 className="form-title">Welcome Back! 👋</h2>
              <p className="form-subtitle">Ready to level up your finances?</p>
              
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    name="password"
                    type={showPassword.loginPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePassword('loginPassword')}
                  >
                    {showPassword.loginPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <button className="submit-btn" type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          ) : (
            <form className="auth-form active" onSubmit={(e) => handleSubmit(e, 'signup')}>
              <h2 className="form-title">Create Account 🚀</h2>
              <p className="form-subtitle">Start your savings journey today!</p>
              
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    name="password"
                    type={showPassword.signupPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePassword('signupPassword')}
                  >
                    {showPassword.signupPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <button className="submit-btn" type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Sign Up'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;