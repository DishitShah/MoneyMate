import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  if (isAuthPage) {
    return (
      <header className="header">
        <div className="nav-container">
          <div className="logo-section">
            <Link to="/" className="logo">
              💵 MoneyMate
            </Link>
            <p className="tagline">Your Buddy That Saves With You</p>
          </div>
          <div className="bot-logo">
            <img src="/path-to-your-bot-logo.png" alt="MoneyMate Bot" className="bot-icon" />
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
        <div className="bot-logo">
          <img src="src\photos\black_circle_360x360.png" alt="MoneyMate Bot" className="bot-icon" />
        </div>
      </div>
    </header>
  );
};

export default Header;