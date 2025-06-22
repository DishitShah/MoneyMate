import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [activeForm, setActiveForm] = useState('login');
  const [showPassword, setShowPassword] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePassword = (inputId) => {
    setShowPassword(prev => ({
      ...prev,
      [inputId]: !prev[inputId]
    }));
  };

  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (formType === 'signup') {
        alert('Account created successfully! Welcome to MoneyMate!');
      } else {
        alert('Welcome back! Redirecting to dashboard...');
      }
      navigate('/dashboard');
    }, 2000);
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
                <input type="email" className="form-input" placeholder="Enter your email" required />
              </div>
              
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword.loginPassword ? 'text' : 'password'} 
                    className="form-input" 
                    placeholder="Enter your password" 
                    required 
                  />
                  <button 
                    type="button" 
                    className="password-toggle" 
                    onClick={() => togglePassword('loginPassword')}
                  >
                    {showPassword.loginPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              
              <div className="remember-forgot">
                <div className="checkbox-group">
                  <input type="checkbox" className="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="forgot-link">Forgot Password?</a>
              </div>
              
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? '🔄 Logging in...' : '🚀 Login to Dashboard'}
              </button>
              
              <div className="social-login">
                <div className="social-title">Or continue with</div>
                <div className="social-buttons">
                  <button type="button" className="social-btn">🔍 Google</button>
                  <button type="button" className="social-btn">📘 Facebook</button>
                </div>
              </div>
              
              <div className="switch-form">
                Don't have an account? 
                <span className="switch-link" onClick={() => setActiveForm('signup')}>
                  Sign up here
                </span>
              </div>
            </form>
          ) : (
            <form className="auth-form active" onSubmit={(e) => handleSubmit(e, 'signup')}>
              <h2 className="form-title">Join MoneyMate! 🎉</h2>
              <p className="form-subtitle">Start your financial journey today</p>
              
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" placeholder="Enter your full name" required />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" placeholder="Enter your email" required />
              </div>
              
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword.signupPassword ? 'text' : 'password'} 
                    className="form-input" 
                    placeholder="Create a strong password" 
                    required 
                  />
                  <button 
                    type="button" 
                    className="password-toggle" 
                    onClick={() => togglePassword('signupPassword')}
                  >
                    {showPassword.signupPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword.confirmPassword ? 'text' : 'password'} 
                    className="form-input" 
                    placeholder="Confirm your password" 
                    required 
                  />
                  <button 
                    type="button" 
                    className="password-toggle" 
                    onClick={() => togglePassword('confirmPassword')}
                  >
                    {showPassword.confirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              
              <div className="remember-forgot">
                <div className="checkbox-group">
                  <input type="checkbox" className="checkbox" id="terms" required />
                  <label htmlFor="terms">I agree to Terms & Privacy Policy</label>
                </div>
              </div>
              
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? '🔄 Creating account...' : '🎯 Create Account'}
              </button>
              
              <div className="social-login">
                <div className="social-title">Or sign up with</div>
                <div className="social-buttons">
                  <button type="button" className="social-btn">🔍 Google</button>
                  <button type="button" className="social-btn">📘 Facebook</button>
                </div>
              </div>
              
              <div className="switch-form">
                Already have an account? 
                <span className="switch-link" onClick={() => setActiveForm('login')}>
                  Login here
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;