import React, { useState } from 'react';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Tap the microphone to start speaking');

  const handleMicClick = () => {
    if (!isListening) {
      setIsListening(true);
      setVoiceStatus('Listening... Speak now!');
      
      setTimeout(() => {
        setIsListening(false);
        setVoiceStatus('Processing your request...');
        
        setTimeout(() => {
          setVoiceStatus('💬 "You have ₹2,500 left in your budget. You can afford Starbucks today!"');
        }, 1500);
      }, 2000);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setVoiceStatus(`Processing: "${suggestion}"`);
    setTimeout(() => {
      setVoiceStatus('💬 "Here\'s your answer based on your spending data!"');
    }, 1000);
  };

  const suggestions = [
    "Can I afford Starbucks today?",
    "How much did I spend on food?",
    "Add ₹200 expense for lunch",
    "Show my savings progress",
    "What's my biggest expense?"
  ];

  return (
    <div className="page active">
      <div className="voice-interface">
        <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>🎤 Voice Assistant</h1>
        <p style={{ 
          marginBottom: '2rem', 
          opacity: 0.8, 
          maxWidth: '600px', 
          marginLeft: 'auto', 
          marginRight: 'auto' 
        }}>
          Ask me anything about your finances! I can help you check your budget, add expenses, or give you personalized advice.
        </p>

        <div 
          className={`mic-button ${isListening ? 'listening' : ''}`}
          onClick={handleMicClick}
          style={{
            background: isListening 
              ? 'linear-gradient(135deg, #ff6b6b, #ff4757)' 
              : 'linear-gradient(135deg, #ff6b6b, #ffd93d)'
          }}
        >
          {isListening ? '🔴' : '🎤'}
        </div>

        <div style={{ marginBottom: '2rem', fontSize: '1.2rem', opacity: 0.8 }}>
          {voiceStatus}
        </div>

        <div className="suggestion-chips">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index} 
              className="chip"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              "{suggestion}"
            </div>
          ))}
        </div>

        <div className="card" style={{ maxWidth: '600px', margin: '3rem auto' }}>
          <h3 style={{ marginBottom: '1rem' }}>💡 Smart Suggestions</h3>
          <div className="insight-card">
            <p>"Based on your spending pattern, you usually spend ₹300 on coffee per week. You've spent ₹180 so far - you're doing great!"</p>
          </div>
          <div className="insight-card">
            <p>"Your grocery budget is looking tight. Consider meal prepping this weekend to save ₹500 this week."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;