import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === '/auth';
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  if (isAuthPage) {
    return (
      <header className="header">
        <div className="nav-container">
          <div className="logo-section">
            <Link to="/" className="logo">
              MoneyMate
            </Link>
            <p className="tagline">Your Buddy That Saves With You</p>
          </div>
          <div className="bot-logo">
            <img
              src="src/photos/black_circle_360x360.png"
              alt="MoneyMate Bot"
              className="bot-icon"
              style={{ cursor: "pointer" }}
              onClick={() => navigate('/bolt-new')}
            />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="nav-container">
        <div className="logo-section">
          <Link to="/" className="logo">
            MoneyMate
          </Link>
          <p className="tagline">Your Buddy That Saves With You</p>
        </div>
        {isAuthenticated && (
          <nav>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link to="/voice">Voice AI</Link>
              </li>
              <li className="nav-item">
                <Link to="/gamification">Rewards</Link>
              </li>
              <li className="nav-item">
                <Link to="/analytics">Analytics</Link>
              </li>
              <li className="nav-item">
                <Link to="/invest">Invest</Link>
              </li>
              <li className="nav-item">
                <Link to="/founder">Founder</Link>
              </li>
              <li className="nav-item">
                <Link to="/profile">Profile</Link>
              </li>
            </ul>
          </nav>
        )}
        {!isAuthenticated && location.pathname !== '/' && (
          <div>
            <Link to="/auth" className="cta-button" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              Login
            </Link>
          </div>
        )}
        <div className="bot-logo">
          <img
            src="src/photos/black_circle_360x360.png"
            alt="MoneyMate Bot"
            className="bot-icon"
            style={{ cursor: "pointer" }}
            onClick={() => navigate('/bolt-new')}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;