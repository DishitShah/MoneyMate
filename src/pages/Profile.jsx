import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setUser(response.data.user);
        setEditForm({
          name: response.data.user.name || '',
          email: response.data.user.email || '',
          avatar: response.data.user.avatar || '👤'
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError('');
    setSuccess('');
    if (!isEditing && user) {
      // Reset form when starting to edit
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '👤'
      });
    }
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch('/api/auth/me', editForm, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUser(response.data.user);
        setIsEditing(false);
        setSuccess('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const stats = [
    { label: 'Total XP:', value: user?.xp || '0', color: '#ffd93d' },
    { label: 'Level:', value: user?.level || '1', color: '#00ff88' },
    { label: 'Streak:', value: user?.streak || '0', color: '#00d4ff' },
    { label: 'Badges:', value: user?.badges?.length || '0', color: '#ff6b6b' }
  ];

  const goals = user?.savingsGoals?.filter(goal => !goal.isCompleted) || [];

  if (loading) {
    return (
      <div className="page active">
        <div className="profile-container">
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page active">
      <div className="profile-container">
        <div className="profile-header">
          <div className="avatar">{user?.avatar || '👤'}</div>
          <h2 style={{ marginBottom: '0.5rem' }}>{user?.name || 'User'}</h2>
          <p style={{ opacity: 0.8, marginBottom: '1rem' }}>{user?.email || ''}</p>
          <div className="level-badge">Level {user?.level || 1} - Budget Master</div>
        </div>

        {error && (
          <div style={{ 
            background: '#d32f2f', 
            color: '#fff', 
            padding: '1rem', 
            borderRadius: '10px', 
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ 
            background: '#388e3c', 
            color: '#fff', 
            padding: '1rem', 
            borderRadius: '10px', 
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}

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
            <h3 style={{ marginBottom: '1rem' }}>🎯 Active Goals</h3>
            {goals.length > 0 ? (
              goals.slice(0, 2).map((goal, index) => (
                <div key={index} style={{ marginBottom: '1rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '0.5rem' 
                  }}>
                    <span>{goal.goalName}</span>
                    <span>{Math.round((goal.currentSaved / goal.targetAmount) * 100)}%</span>
                  </div>
                  <div className="xp-bar">
                    <div 
                      className="xp-progress" 
                      style={{ width: `${Math.round((goal.currentSaved / goal.targetAmount) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ opacity: 0.8 }}>No active goals yet. Create one to get started!</p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>⚙️ Account Settings</h3>
          
          {!isEditing ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem' 
            }}>
              <button className="cta-button" onClick={handleEditToggle}>
                📝 Edit Profile
              </button>
              <button 
                className="cta-button" 
                onClick={handleLogout}
                style={{ 
                  background: 'linear-gradient(45deg, #ff6b6b, #ff4757)',
                  color: '#ffffff'
                }}
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#00d4ff' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#00d4ff' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#00d4ff' }}>
                  Avatar (Emoji)
                </label>
                <input
                  type="text"
                  name="avatar"
                  value={editForm.avatar}
                  onChange={handleInputChange}
                  placeholder="👤"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '1rem' 
              }}>
                <button 
                  type="submit" 
                  className="cta-button"
                >
                  💾 Save Changes
                </button>
                <button 
                  type="button" 
                  className="cta-button" 
                  onClick={handleEditToggle}
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff'
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;