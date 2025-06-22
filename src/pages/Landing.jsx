import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleStartJourney = () => {
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="page active">
      <div className="landing-hero">
        <div className="hero-content">
          <div className="mascot">💵</div>
          <h1 className="hero-title">MoneyMate</h1>
          <p className="hero-subtitle">Saving Money Should Feel Like Winning a Game.</p>
          <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
            Turn boring budgeting into an exciting game with voice commands, XP rewards, and personalized insights.
          </p>
          <button className="cta-button" onClick={handleStartJourney}>
            {token ? '🏠 Go to Dashboard' : '🚀 Start Your Journey'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;