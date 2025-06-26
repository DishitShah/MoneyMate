import React, { useState, useRef,useEffect } from "react";

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [error, setError] = useState("");
  const audioRef = useRef(null);
  const [smartSuggestions, setSmartSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/suggestions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setSmartSuggestions(data.suggestions);
        else setSmartSuggestions([]);
      } catch (err) {
        setSmartSuggestions([]);
      }
    };
    fetchSuggestions();
  }, []);

  // Use Web Speech API for speech-to-text
  const handleMicClick = () => {
    if (isListening) return;

    setTranscript("");
    setAiAnswer("");
    setError("");
    setIsListening(true);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Sorry, your browser does not support speech recognition.");
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setIsListening(false);
      await getAIResponse(text);
    };
    recognition.onerror = () => {
      setIsListening(false);
      setError("Could not recognize speech. Try again!");
    };
    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Call backend for AI + voice response
  const getAIResponse = async (text) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/voice-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json();
      if (data.success) {
        setAiAnswer(data.answer);
        setError("");
        // Play audio
        if (audioRef.current) audioRef.current.pause();
        const audio = new Audio(data.audio);
        audioRef.current = audio;
        audio.play();
      } else {
        setAiAnswer("");
        setError("Voice assistant error");
      }
    } catch (err) {
      setAiAnswer("");
      setError("Voice assistant error");
    }
  };

  // Suggestions handler (send as text instead of voice)
  const handleSuggestionClick = async (suggestion) => {
    setTranscript(suggestion);
    setAiAnswer("");
    setError("");
    await getAIResponse(suggestion);
  };

  const suggestions = [
    "Can I afford Starbucks today?",
    "How much did I spend on food?",
    "Show my savings progress",
    "What's my biggest expense?",
  ];

  return (
    <div className="page active">
      <div className="voice-interface">
        <h1 style={{ marginBottom: "2rem", fontSize: "2.5rem" }}>
          🎤 Voice Assistant
        </h1>
        <p
          style={{
            marginBottom: "2rem",
            opacity: 0.8,
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Ask me anything about your finances! I can help you check your budget,
          add expenses, or give you personalized advice.
        </p>

        <div
          className={`mic-button ${isListening ? "listening" : ""}`}
          onClick={handleMicClick}
          style={{
            background: isListening
              ? "linear-gradient(135deg, #ff6b6b, #ff4757)"
              : "linear-gradient(135deg, #ff6b6b, #ffd93d)",
          }}
        >
          {isListening ? "🔴" : "🎤"}
        </div>

        {/* User transcript */}
        {transcript && (
          <div style={{ margin: "1rem 0", fontSize: "1.1rem", opacity: 0.9 }}>
            <b>{transcript}</b>
          </div>
        )}

        {/* AI Answer or Error */}
        {aiAnswer && (
          <div
            style={{ marginBottom: "2rem", fontSize: "1.2rem", opacity: 0.85 }}
          >
            {aiAnswer}
          </div>
        )}
        {error && (
          <div
            style={{
              marginBottom: "2rem",
              fontSize: "1.2rem",
              color: "#ff4757",
              opacity: 0.85,
            }}
          >
            {error}
          </div>
        )}

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

        <div
          className="card"
          style={{ maxWidth: "600px", margin: "3rem auto" }}
        >
          <h3 style={{ marginBottom: "1rem" }}>💡 Smart Suggestions</h3>
          {smartSuggestions.length > 0 ? (
            smartSuggestions.map((suggestion, idx) => (
              <div className="insight-card" key={idx}>
                <p>{suggestion}</p>
              </div>
            ))
          ) : (
            <div className="insight-card">
              <p>No smart suggestions available yet. Track more data!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
