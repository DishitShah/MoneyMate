import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [budgetValue, setBudgetValue] = useState(2500);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setBudgetValue(prev => Math.max(0, prev - Math.floor(Math.random() * 50)));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page active">
      <div className="dashboard">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem' }}>
          💰 Your Financial Dashboard
        </h1>
        
        <div className="dashboard-grid">
          <div className="card">
            <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Budget Meter</h3>
            <div className="budget-meter">
              <div className="meter-circle">
                <div className="meter-inner">
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00ff88' }}>
                    ₹{budgetValue.toLocaleString()}
                  </div>
                  <div style={{ opacity: 0.7 }}>Remaining</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>🤖 AI Assistant</h3>
            <div className="voice-bubble">
              <p>"Great job! You're 20% under budget this week. Want to save that extra ₹500 for your PS5 goal?"</p>
            </div>
            <button 
              className="cta-button" 
              style={{ width: '100%' }}
              onClick={() => navigate('/voice')}
            >
              💬 Chat with AI
            </button>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>🎮 Your Progress</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>⚡</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Level 12</span>
                  <span>2,150 XP</span>
                </div>
                <div className="xp-bar">
                  <div className="xp-progress"></div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔥 7 Day Streak!</div>
              <div style={{ opacity: 0.8 }}>Keep logging to maintain your streak</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>🎯 Savings Goal: PS5</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00ff88' }}>
                ₹35,000 / ₹50,000
              </div>
              <div style={{ opacity: 0.8 }}>70% Complete - 3 months to go!</div>
            </div>
            <div style={{ fontSize: '3rem' }}>🎮</div>
          </div>
          <div className="xp-bar" style={{ marginTop: '1rem' }}>
            <div className="xp-progress" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;