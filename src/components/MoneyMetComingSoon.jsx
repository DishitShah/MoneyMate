import React, { useState, useEffect } from 'react';

const MoneyMateComingSoon = () => {
  const [particles, setParticles] = useState([]);
  const [konamiCode, setKonamiCode] = useState([]);
  const [isRainbow, setIsRainbow] = useState(false);

  const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];

  // Create particles on mount
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 20,
        duration: Math.random() * 10 + 10
      });
    }
    setParticles(newParticles);
  }, []);

  // Konami code listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const newCode = [...konamiCode, e.code];
      if (newCode.length > konamiSequence.length) {
        newCode.shift();
      }
      setKonamiCode(newCode);
      
      if (newCode.join('') === konamiSequence.join('')) {
        setIsRainbow(true);
        setTimeout(() => setIsRainbow(false), 4000);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [konamiCode]);

  const notifyMe = () => {
    alert('🎉 Amazing! We\'ll notify you as soon as this feature drops. Get ready to level up your money game! 💪');
  };

  const goBack = () => {
    window.history.back();
  };

  const handleRippleClick = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  const styles = {
    body: {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#ffffff',
      overflowX: 'hidden',
      minHeight: '100vh',
      animation: isRainbow ? 'rainbow 2s ease-in-out infinite' : 'none'
    }
  };

  return (
    <div style={styles.body}>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @keyframes particleFloat {
          0% { transform: translateY(100vh) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(100px); opacity: 0; }
        }

        @keyframes glow {
          from { filter: drop-shadow(0 0 5px rgba(0, 212, 255, 0.3)); }
          to { filter: drop-shadow(0 0 20px rgba(0, 255, 136, 0.6)); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes sparkle {
          0% { opacity: 0.5; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes titlePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes progressGlow {
          from { box-shadow: 0 0 10px rgba(0, 212, 255, 0.5); }
          to { box-shadow: 0 0 20px rgba(0, 255, 136, 0.8); }
        }

        @keyframes progressPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        @keyframes pulse {
          0% { box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3); }
          50% { box-shadow: 0 15px 40px rgba(0, 255, 136, 0.4); }
          100% { box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3); }
        }

        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }

        @keyframes rainbow {
          0% { filter: hue-rotate(0deg); }
          25% { filter: hue-rotate(90deg); }
          50% { filter: hue-rotate(180deg); }
          75% { filter: hue-rotate(270deg); }
          100% { filter: hue-rotate(360deg); }
        }

        .particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(0, 212, 255, 0.5);
          border-radius: 50%;
          animation: particleFloat 20s linear infinite;
        }

        .header {
          position: fixed;
          top: 0;
          width: 100%;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(45deg, #00d4ff, #00ff88);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: glow 2s ease-in-out infinite alternate;
          cursor: pointer;
        }

        .back-btn {
          padding: 0.5rem 1.5rem;
          background: linear-gradient(45deg, #00d4ff, #00ff88);
          border: none;
          border-radius: 25px;
          color: #000;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .back-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 212, 255, 0.3);
        }

        .coming-soon-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 2rem 2rem;
        }

        .content-wrapper {
          max-width: 1000px;
          width: 100%;
          text-align: center;
          position: relative;
        }

        .construction-bot {
          width: 300px;
          height: 300px;
          margin: 0 auto 2rem;
          background: linear-gradient(135deg, #ff6b6b, #ffd93d);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8rem;
          animation: float 3s ease-in-out infinite;
          box-shadow: 0 20px 40px rgba(255, 107, 107, 0.3);
          position: relative;
          overflow: hidden;
        }

        .construction-bot::before {
          content: '🔧';
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 2rem;
          animation: bounce 2s ease-in-out infinite;
        }

        .construction-bot::after {
          content: '⚡';
          position: absolute;
          bottom: 20px;
          left: 20px;
          font-size: 1.5rem;
          animation: sparkle 1.5s ease-in-out infinite alternate;
        }

        .main-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #00d4ff, #00ff88, #ff6b6b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: titlePulse 3s ease-in-out infinite;
          line-height: 1.2;
        }

        .subtitle {
          font-size: 1.3rem;
          opacity: 0.9;
          margin-bottom: 2rem;
          color: #00d4ff;
          font-weight: 500;
        }

        .description {
          font-size: 1.1rem;
          line-height: 1.8;
          margin-bottom: 3rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
          opacity: 0.9;
        }

        .info-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .info-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #00d4ff, #00ff88);
          animation: progressGlow 2s ease-in-out infinite alternate;
        }

        .info-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 212, 255, 0.2);
        }

        .card-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          animation: bounce 2s ease-in-out infinite;
        }

        .card-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #00ff88;
        }

        .card-text {
          opacity: 0.8;
          line-height: 1.6;
        }

        .progress-section {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 30px;
          padding: 3rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          margin-bottom: 3rem;
        }

        .progress-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #00d4ff;
        }

        .progress-bar {
          width: 100%;
          height: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 1rem;
          position: relative;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00d4ff, #00ff88);
          border-radius: 10px;
          width: 73%;
          position: relative;
          animation: progressPulse 2s ease-in-out infinite;
        }

        .progress-text {
          text-align: center;
          font-weight: 600;
          color: #00ff88;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 3rem;
        }

        .cta-btn {
          padding: 1rem 2rem;
          border-radius: 15px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          position: relative;
          overflow: hidden;
        }

        .primary-btn {
          background: linear-gradient(45deg, #00d4ff, #00ff88);
          color: #000;
          border: none;
          box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
          animation: pulse 2s infinite;
        }

        .secondary-btn {
          background: transparent;
          color: #ffffff;
          border: 2px solid #00d4ff;
        }

        .cta-btn:hover {
          transform: translateY(-3px);
        }

        .primary-btn:hover {
          box-shadow: 0 20px 50px rgba(0, 212, 255, 0.5);
        }

        .secondary-btn:hover {
          background: rgba(0, 212, 255, 0.1);
          border-color: #00ff88;
        }

        .features-preview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 3rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          background: rgba(0, 212, 255, 0.1);
          transform: translateX(10px);
        }

        .feature-icon {
          font-size: 2rem;
          animation: bounce 2s ease-in-out infinite;
        }

        .feature-text {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .notification {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: linear-gradient(45deg, #00d4ff, #00ff88);
          color: #000;
          padding: 1rem 1.5rem;
          border-radius: 15px;
          font-weight: 600;
          box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
          animation: slideIn 0.5s ease-out, pulse 2s ease-in-out 2s infinite;
          z-index: 1000;
          cursor: pointer;
        }

        .notification:hover {
          transform: translateY(-3px);
        }

        @media (max-width: 768px) {
          .main-title {
            font-size: 2.5rem;
          }

          .construction-bot {
            width: 250px;
            height: 250px;
            font-size: 6rem;
          }

          .info-cards {
            grid-template-columns: 1fr;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .nav-container {
            padding: 1rem;
          }

          .features-preview {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Particles Background */}
      <div className="particles">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="header">
        <div className="nav-container">
          <div className="logo" onClick={() => window.location.reload()}>
            MoneyMate
          </div>
          <button className="back-btn" onClick={goBack}>
            ← Back to App
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="coming-soon-container">
        <div className="content-wrapper">
          {/* Construction Bot */}
          <div className="construction-bot">
            🚧
          </div>

          {/* Main Content */}
          <h1 className="main-title">Feature Under Construction!</h1>
          <p className="subtitle">We're cooking something FIRE! 🔥</p>
          
          <p className="description">
            Yo! We see you're excited about this feature (and honestly, we are too! 👀). 
            Our dev team is literally pulling all-nighters to make this the most epic financial tool you've ever used. 
            Think of it as the glow-up your money management has been waiting for! ✨
          </p>


          {/* Progress Section */}
          <div className="progress-section">
            <h3 className="progress-title">🚀 Development Progress</h3>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <p className="progress-text">73% Complete - Almost there! 💪</p>
          </div>

          {/* CTA Buttons */}
          <div className="cta-buttons">
            <button 
              className="cta-btn primary-btn" 
              onClick={(e) => { handleRippleClick(e); notifyMe(); }}
            >
              🔔 Notify Me When Ready
            </button>
            <button 
              className="cta-btn secondary-btn" 
              onClick={(e) => { handleRippleClick(e); goBack(); }}
            >
              🏠 Back to Dashboard
            </button>
          </div>

          {/* Features Preview */}
          
        </div>
      </div>

      
    </div>
  );
};

export default MoneyMateComingSoon;