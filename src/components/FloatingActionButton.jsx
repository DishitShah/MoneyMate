import React from 'react';
import { useNavigate } from 'react-router-dom';

const FloatingActionButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/voice');
  };

  return (
    <button 
      className="fab" 
      onClick={handleClick}
      title="Voice Assistant"
    >
      🎤
    </button>
  );
};

export default FloatingActionButton;