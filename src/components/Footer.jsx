import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>MoneyMate</h3>
          <p>Your AI-powered finance buddy that makes saving fun and rewarding. Join thousands of users who've already leveled up their financial game.</p>
        </div>
        <div className="footer-section">
          <h3>Features</h3>
          <p><Link to="/dashboard">Smart Dashboard</Link></p>
          <p><Link to="/voice">Voice Assistant</Link></p>
          <p><Link to="/gamification">Gamification</Link></p>
          <p><Link to="/invest">Investment Tools</Link></p>
        </div>
        <div className="footer-section">
          <h3>Company</h3>
          <p><Link to="/founder">About Founder</Link></p>
          <p><a href="#">Privacy Policy</a></p>
          <p><a href="#">Terms of Service</a></p>
          <p><a href="#">Contact Support</a></p>
        </div>
        <div className="footer-section">
          <h3>Connect</h3>
          <p>📧 dishit.s@ahduni.edu.in</p>
          <p><a href="https://www.linkedin.com/in/dishit-shah-224353283/">💼 LinkedIn</a></p>
          <p>🐦 @MoneyMateApp</p>
          <p>📱 Download App</p>
        </div>
      </div>
      <div className="copyright">
        <p>&copy; 2025 MoneyMate. Made with 💚 for GenZ financial success.</p>
      </div>
    </footer>
  );
};

export default Footer;