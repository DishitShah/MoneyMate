import React, { useState, useEffect } from 'react';

const Gamification = () => {
  const [userData, setUserData] = useState(null);
  const [hoveredBadge, setHoveredBadge] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // Fetch real user gamification data on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setUserData(data.user);
    };
    fetchUser();
  }, []);

  const getRarityStyles = (rarity) => {
    switch(rarity) {
      case 'legendary': 
        return {
          gradient: 'linear-gradient(135deg, #ffd93d 0%, #ff6b6b 100%)',
          shadow: '0 20px 40px rgba(255, 217, 61, 0.4)',
          border: '2px solid rgba(255, 217, 61, 0.6)'
        };
      case 'epic': 
        return {
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          shadow: '0 20px 40px rgba(102, 126, 234, 0.4)',
          border: '2px solid rgba(102, 126, 234, 0.6)'
        };
      case 'rare': 
        return {
          gradient: 'linear-gradient(135deg, #00d4ff 0%, #00ff88 100%)',
          shadow: '0 20px 40px rgba(0, 212, 255, 0.4)',
          border: '2px solid rgba(0, 212, 255, 0.6)'
        };
      default: 
        return {
          gradient: 'rgba(255, 255, 255, 0.05)',
          shadow: '0 10px 20px rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        };
    }
  };

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 3000);
  };

  if (!userData) {
    return (
      <div className="page active">
        <div className="gamification">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '60vh',
            flexDirection: 'column',
            gap: '2rem'
          }}>
            <div className="mascot" style={{ width: '150px', height: '150px', fontSize: '4rem' }}>
              🎮
            </div>
            <h2 style={{ fontSize: '2rem', opacity: 0.8 }}>Loading your epic journey...</h2>
          </div>
        </div>
      </div>
    );
  }

  const { xp, level, streak, badges = [], trackedExpenses = 0 } = userData;
  // XP Progress: 1000 XP per level in your backend logic
  const xpForLevel = 1000;
  const xpProgress = ((xp % xpForLevel) / xpForLevel) * 100;
  const xpToNextLevel = xpForLevel - (xp % xpForLevel);

  return (
    <div className="page active">
      <div className="gamification">
        {/* Hero Section */}
        <div style={{ textAlign: 'center', padding: '3rem 2rem', marginBottom: '2rem' }}>
          <div className="mascot" style={{ marginBottom: '2rem' }}>
            🎮
          </div>
          <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
            LEVEL UP YOUR MONEY GAME
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '1.3rem', maxWidth: '600px', margin: '0 auto' }}>
            Turn saving into an epic adventure! Earn XP, unlock achievements, and flex your financial skills 💪
          </p>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-grid" style={{ marginBottom: '3rem' }}>
          {/* XP Card */}
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#00d4ff' }}>Total XP</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              {xp.toLocaleString()}
            </div>
            <div className="xp-bar" style={{
              width: '90%',
              height: '12px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              margin: '0 auto',
              overflow: 'hidden'
            }}>
              <div 
                className="xp-progress" 
                style={{
                  width: `${xpProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #00d4ff, #00ff88)',
                  borderRadius: '8px',
                  transition: 'width 0.5s'
                }}
              />
            </div>
            <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>
              {xpToNextLevel} XP to level {level + 1}
            </p>
          </div>

          {/* Level Card */}
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#ffd93d' }}>Current Level</h3>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ffd93d' }}>
              {level}
            </div>
            <div className="level-badge" style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
              {/* You can add dynamic titles here based on level if you want */}
              Elite Trader
            </div>
          </div>

          {/* Streak Card */}
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔥</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#ff6b6b' }}>Streak</h3>
            <div className="streak-counter" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              {streak}
            </div>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Days strong! 💪</p>
          </div>
        </div>

        {/* Achievements Section */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            textAlign: 'center', 
            marginBottom: '2rem',
            background: 'linear-gradient(45deg, #00d4ff, #00ff88, #ff6b6b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🏅 Achievement Showcase
          </h2>
          
          <div className="gamification-grid">
            {badges.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No badges yet!</h3>
                <p style={{ opacity: 0.8 }}>Start tracking expenses to unlock your first achievement!</p>
              </div>
            ) : (
              badges.map((badge, index) => {
                const rarityStyles = getRarityStyles(badge.rarity);
                return (
                  <div
                    key={index}
                    className="badge"
                    style={{
                      background: rarityStyles.gradient,
                      border: rarityStyles.border,
                      boxShadow: hoveredBadge === index ? rarityStyles.shadow : '0 10px 20px rgba(0, 0, 0, 0.3)',
                      transform: hoveredBadge === index ? 'translateY(-10px) scale(1.05)' : 'translateY(0) scale(1)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={() => setHoveredBadge(index)}
                    onMouseLeave={() => setHoveredBadge(null)}
                  >
                    <div style={{ fontSize: '4rem', marginBottom: '1rem', transform: hoveredBadge === index ? 'scale(1.2) rotate(10deg)' : 'scale(1)' }}>
                      {badge.icon}
                    </div>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      {badge.name}
                    </h3>
                    <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '1rem' }}>
                      {badge.description}
                    </p>
                    {/* Rarity Badge */}
                    <div style={{
                      display: 'inline-block',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      background: 'rgba(0, 0, 0, 0.3)',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {badge.rarity}
                    </div>
                    {badge.earnedAt && (
                      <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                        Unlocked: {new Date(badge.earnedAt).toLocaleDateString()}
                      </div>
                    )}
                    {/* Shimmer effect */}
                    {hoveredBadge === index && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                        animation: 'shimmer 1s ease-in-out'
                      }} />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Daily Spin Wheel */}
        

        {/* Next Achievement Preview */}
        <div className="insight-card" style={{ margin: '3rem auto', maxWidth: '600px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🎯 Next Achievement</h3>
          <p style={{ marginBottom: '1rem' }}>
            Track <strong>{200 - trackedExpenses} more expenses</strong> to unlock the "Data Master" badge!
          </p>
          <div style={{
            width: '100%',
            height: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            overflow: 'hidden',
            marginBottom: '0.5rem'
          }}>
            <div 
              style={{
                width: `${(trackedExpenses / 200) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #00d4ff, #00ff88)',
                borderRadius: '10px',
                transition: 'width 1s ease'
              }}
            />
          </div>
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            {trackedExpenses}/200 expenses tracked ({Math.round((trackedExpenses / 200) * 100)}%)
          </p>
        </div>

        {/* Voice Assistant Integration */}
        
      </div>
    </div>
  );
};

export default Gamification;