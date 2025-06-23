import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Auth = () => {
  const [activeForm, setActiveForm] = useState('login');
  const [showPassword, setShowPassword] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [forgotPassword, setForgotPassword] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

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
    setError('');
  };

  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formType === 'signup') {
      if (!form.name || !form.email || !form.password || !form.confirmPassword) {
        setError('Please fill in all fields.');
        setIsLoading(false);
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match!');
        setIsLoading(false);
        return;
      }
    }

    try {
      let endpoint, payload;
      if (formType === 'signup') {
        endpoint = '/api/auth/signup';
        payload = {
          name: form.name,
          email: form.email,
          password: form.password
        };
      } else {
        endpoint = '/api/auth/login';
        payload = {
          email: form.email,
          password: form.password
        };
      }

      const res = await axios.post(endpoint, payload);
      setIsLoading(false);
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
        console.log('Token set in localStorage:', res.data.token); // <-- Add this line
      }
      navigate('/dashboard');
      console.log('Navigated to dashboard'); // <-- Add this line
    } catch (err) {
      setIsLoading(false);
      setError(
        err.response?.data?.message ||
        (formType === 'signup'
          ? 'Signup failed. Please try again.'
          : 'Login failed. Please check your credentials.')
      );
    }
  };

  // Google OAuth handler
  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  // Forgot Password logic (no token, just email+password)
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    setForgotSubmitted(true);

    const { email, password, confirmPassword } = forgotPassword;
    if (!email || !password || !confirmPassword) {
      setForgotError('Please fill in all fields.');
      setForgotSubmitted(false);
      return;
    }
    if (password !== confirmPassword) {
      setForgotError('Passwords do not match.');
      setForgotSubmitted(false);
      return;
    }

    try {
      await axios.post('/api/auth/forgot-password', { email, password });
      setForgotSuccess('Password changed! You can now log in.');
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Failed to change password.');
    }
    setForgotSubmitted(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="mascot-section">
          <div className="mascot">💵</div>
          <h1 className="welcome-text">Welcome to MoneyMate!</h1>
          <p className="welcome-subtitle">
     Broke? We’ve all been there.
Let MoneyMate turn your guilt trips into goal trips — with streaks, XP, and a voice that actually gives a damn.
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
              onClick={() => {
                setActiveForm('login');
                setError('');
              }}
            >
              Login
            </button>
            <button
              className={`auth-btn ${activeForm === 'signup' ? 'active' : ''}`}
              onClick={() => {
                setActiveForm('signup');
                setError('');
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Forgot Password Form */}
          {activeForm === 'forgot' ? (
            <form className="auth-form active" onSubmit={handleForgotSubmit}>
              <h2 className="form-title">Forgot Password</h2>
              <p className="form-subtitle">Enter your email and new password.</p>
              {forgotError && <div className="auth-error">{forgotError}</div>}
              {forgotSuccess && <div className="auth-success">{forgotSuccess}</div>}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={forgotPassword.email}
                  onChange={e => setForgotPassword({ ...forgotPassword, email: e.target.value })}
                  required
                  disabled={forgotSubmitted}
                />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter new password"
                  value={forgotPassword.password}
                  onChange={e => setForgotPassword({ ...forgotPassword, password: e.target.value })}
                  required
                  disabled={forgotSubmitted}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Confirm new password"
                  value={forgotPassword.confirmPassword}
                  onChange={e => setForgotPassword({ ...forgotPassword, confirmPassword: e.target.value })}
                  required
                  disabled={forgotSubmitted}
                />
              </div>
              <button type="submit" className="submit-btn" disabled={forgotSubmitted}>
                {forgotSubmitted ? '🔄 Changing Password...' : 'Change Password'}
              </button>
              <div className="switch-form">
                <span className="switch-link" onClick={() => setActiveForm('login')}>
                  Back to Login
                </span>
              </div>
            </form>
          ) : activeForm === 'login' ? (
            <form className="auth-form active" onSubmit={(e) => handleSubmit(e, 'login')}>
              <h2 className="form-title">Welcome Back! 👋</h2>
              <p className="form-subtitle">Ready to level up your finances?</p>
              {error && <div className="auth-error">{error}</div>}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
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
                    type={showPassword.loginPassword ? 'text' : 'password'}
                    name="password"
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
                    {showPassword.loginPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="remember-forgot">
                <div className="checkbox-group">
                  <input type="checkbox" className="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <span
                  className="forgot-link"
                  style={{ cursor: 'pointer', color: '#1976d2' }}
                  onClick={() => {
                    setActiveForm('forgot');
                    setError('');
                    setForgotError('');
                    setForgotSuccess('');
                    setForgotPassword({ email: '', password: '', confirmPassword: '' });
                  }}
                >
                  Forgot Password?
                </span>
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? '🔄 Logging in...' : '🚀 Login to Dashboard'}
              </button>

              <div className="social-login">
                <div className="social-title">Or continue with</div>
                <div className="social-buttons">
                  <button
                    type="button"
                    className="social-btn google-btn-long"
                    onClick={handleGoogleLogin}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      gap: '10px',
                      padding: '12px 0'
                    }}
                  >
                   
                    Sign in with Google
                  </button>
                </div>
              </div>

              <div className="switch-form">
                Don't have an account?
                <span className="switch-link" onClick={() => {
                  setActiveForm('signup');
                  setError('');
                }}>
                  Sign up here
                </span>
              </div>
            </form>
          ) : (
            <form className="auth-form active" onSubmit={(e) => handleSubmit(e, 'signup')}>
              <h2 className="form-title">Join MoneyMate! 🎉</h2>
              <p className="form-subtitle">Start your financial journey today</p>
              {error && <div className="auth-error">{error}</div>}

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
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
                    type={showPassword.signupPassword ? 'text' : 'password'}
                    name="password"
                    className="form-input"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleInputChange}
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
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={handleInputChange}
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
                  <button
                    type="button"
                    className="social-btn google-btn-long"
                    onClick={handleGoogleLogin}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      gap: '10px',
                      padding: '12px 0'
                    }}
                  >
                    
                    Sign up with Google
                  </button>
                </div>
              </div>

              <div className="switch-form">
                Already have an account?
                <span className="switch-link" onClick={() => {
                  setActiveForm('login');
                  setError('');
                }}>
                  Login here
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
      {/* Error and success styling */}
      <style>{`
        .auth-error {
          color: #fff;
          background: #d32f2f;
          border-radius: 4px;
          margin: 0 0 16px 0;
          padding: 10px;
          text-align: center;
          font-weight: 500;
        }
        .auth-success {
          color: #fff;
          background: #388e3c;
          border-radius: 4px;
          margin: 0 0 16px 0;
          padding: 10px;
          text-align: center;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default Auth;