import React from 'react';

const Profile = () => {
  const stats = [
    { label: 'Total XP:', value: '2,150', color: '#ffd93d' },
    { label: 'Days Active:', value: '45', color: '#00ff88' },
    { label: 'Money Saved:', value: '₹35,000', color: '#00d4ff' },
    { label: 'Badges Earned:', value: '8', color: '#ff6b6b' }
  ];

  const goals = [
    { name: 'PS5 Console', progress: 70 },
    { name: 'Emergency Fund', progress: 25 }
  ];

  const actions = [
    '📝 Edit Profile',
    '🎯 Update Goals',
    '🔔 Notifications',
    '📊 Export Data',
    '🔒 Privacy',
    '❓ Help & Support'
  ];

  return (
    <div className="page active">
      <div className="profile-container">
        <div className="profile-header">
          <div className="avatar">👤</div>
          <h2 style={{ marginBottom: '0.5rem' }}>Alex Johnson</h2>
          <p style={{ opacity: 0.8, marginBottom: '1rem' }}>@alexj_saver</p>
          <div className="level-badge">Level 12 - Budget Master</div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem', 
          marginBottom: '3rem' 
        }}>
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>📊 Your Stats</h3>
            {stats.map((stat, index) => (
              <div key={index} style={{ marginBottom: '1rem' }}>
                <span style={{ opacity: 0.8 }}>{stat.label}</span>
                <span style={{ 
                  float: 'right', 
                  color: stat.color, 
                  fontWeight: 'bold' 
                }}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>🎯 Current Goals</h3>
            {goals.map((goal, index) => (
              <div key={index} style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '0.5rem' 
                }}>
                  <span>{goal.name}</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="xp-bar">
                  <div 
                    className="xp-progress" 
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>⚙️ Account Settings</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem' 
          }}>
            {actions.map((action, index) => (
              <button key={index} className="cta-button">
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;