import React, { useState } from 'react';

const Gamification = () => {
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const randomRotation = Math.floor(Math.random() * 360) + 720;
    setWheelRotation(prev => prev + randomRotation);
    
    setTimeout(() => {
      alert('🎉 Congratulations! You won 50 XP bonus points!');
      setIsSpinning(false);
    }, 3000);
  };

  const badges = [
    { icon: '🔥', title: 'Streak Master', counter: '7', description: 'Days of consistent logging' },
    { icon: '👑', title: 'Budget Boss', description: 'Stayed under budget for 4 weeks straight!' },
    { icon: '💎', title: 'Savings Hero', description: 'Saved ₹10,000 this month' },
    { icon: '🎤', title: 'Voice Commander', description: 'Used voice commands 50+ times' }
  ];

  return (
    <div className="page active">
    <div className="gamification">
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>🎮 Rewards & Achievements</h1>
        <p style={{ marginBottom: '3rem', opacity: 0.8 }}>
          Level up your financial game and earn rewards for good money habits!
        </p>
      </div>
      </div>

      <div className="gamification-grid">
        {badges.map((badge, index) => (
          <div key={index} className="badge">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{badge.icon}</div>
            <h3>{badge.title}</h3>
            {badge.counter && (
              <div className="streak-counter">{badge.counter}</div>
            )}
            <p style={{ marginTop: '1rem', opacity: 0.8 }}>{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gamification;