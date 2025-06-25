import React, { useState, useRef } from 'react';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Tap the microphone to start speaking');
  const [transcript, setTranscript] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const audioRef = useRef(null);

  // Use Web Speech API for speech-to-text
  const handleMicClick = () => {
    if (isListening) return;

    setTranscript('');
    setAiAnswer('');
    setIsListening(true);
    setVoiceStatus('Listening... Speak now!');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceStatus('Sorry, your browser does not support speech recognition.');
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setIsListening(false);
      setVoiceStatus('Processing your request...');
      await getAIResponse(text);
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      setVoiceStatus('Could not recognize speech. Try again!');
    };
    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Call backend for AI + voice response
  const getAIResponse = async (text) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/voice-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json();
      if (data.success) {
        setAiAnswer(data.answer);
        setVoiceStatus('💬 ' + data.answer);
        // Play audio
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const audio = new Audio(data.audio);
        audioRef.current = audio;
        audio.play();
      } else {
        setVoiceStatus(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setVoiceStatus('Error getting AI response. Try again.');
    }
  };

  // Suggestions handler (send as text instead of voice)
  const handleSuggestionClick = async (suggestion) => {
    setTranscript(suggestion);
    setAiAnswer('');
    setVoiceStatus('Processing: "' + suggestion + '"');
    await getAIResponse(suggestion);
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

        <div style={{ margin: '1rem 0', fontSize: '1.1rem', opacity: 0.8 }}>
          <b>{transcript}</b>
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