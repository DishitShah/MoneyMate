import React from "react";

// Card data (already styled for your UX/text content)
const CARDS = [
  {
    title: "🧠 The Problem",
    body: (
      <>
        Traditional budgeting apps are rigid, boring, and often overwhelming—especially for Gen Z and young professionals. Most users abandon these apps quickly because:
        <ul>
          <li>They lack <b>daily engagement</b></li>
          <li>They feel like spreadsheets, not experiences</li>
          <li>They don't offer <b>personalized guidance</b> or <b>fun motivation</b></li>
          <li>Users don’t build consistent saving habits</li>
        </ul>
      </>
    ),
  },
  {
    title: "✅ The Solution",
    body: (
      <>
        <b>MoneyMate</b> turns saving into a habit through:
        <ul>
          <li>🎮 <b>Gamification</b>: XP, streaks, rewards, and achievement badges</li>
          <li>🧠 <b>AI-powered daily financial insights</b></li>
          <li>🎤 <b>Conversational voice assistant</b> for spending advice</li>
          <li>📊 Visual analytics that make money tracking intuitive and exciting</li>
        </ul>
      </>
    ),
  },
  {
    title: "🧩 Key Features",
    body: (
      <ul>
  <li><b>Daily Budget Coach</b>: Tracks your spending versus your set budget in real-time, empowering you to make better daily financial decisions.</li>
  <li><b>Gamified Experience</b>: Earn XP for making smart choices, unlock streaks, and receive rewards—turning saving and budgeting into a fun, engaging game.</li>
  <li><b>Voice Assistant (ElevenLabs)</b>: Ask questions like “Can I afford Starbucks today?” and get instant, intelligent answers from your personal AI-powered finance coach.</li>
  <li><b>Goal Tracker</b>: Set your own savings goals and visualize your progress with intuitive feedback to stay motivated every step of the way.</li>
  <li><b>Rewards</b>: Stay consistent with your saving habits and collect rewards to keep you motivated on your financial journey.</li>
  <li><b>Spend Analytics</b>: Dive deep into your finances with interactive pie charts, heatmaps, and forecasts for clear, actionable insights.</li>
  <li><b>Smart Suggestions</b>: Receive personalized AI-driven tips and guidance based on your unique spending patterns.</li>
  
</ul>
    
    ),
  },
  {
    title: "🏆 Challenges Accepted",
    body: (
      <>
        <b>✅ Voice AI Challenge</b>
        <ul>
          <li>We integrated <b>ElevenLabs</b> to create a <b>conversational finance coach</b>. Users can:</li>
          <ul>
            <li>Speak their queries</li>
            <li>Get smart, contextual responses</li>
            <li>Enjoy a daily "talk with your wallet" experience</li>
          </ul>
        </ul>
        <b>✅ Deploy Challenge</b>
        <ul>
          <li><b>MoneyMate</b> is deployed on <b>Netlify</b> using their free tier. This allows:</li>
          <ul>
            <li>Continuous deployment</li>
            <li>Global distribution (via CDN)</li>
            <li>SSL security & performance optimization</li>
          </ul>
        </ul>
      </>
    ),
  },
];

export default function BoltNew() {
  return (
    <>
      <div className="boltnew-page-vertical">
        <h1 className="boltnew-title">About MoneyMate</h1>
        {CARDS.map((card) => (
          <div className="boltnew-card-vertical" key={card.title}>
            <h2>{card.title}</h2>
            <div>{card.body}</div>
          </div>
        ))}
      </div>
      <style>{`
        .boltnew-page-vertical {
          max-width: 820px;
          margin: 0 auto;
          padding: 120px 1.5rem 3rem 1.5rem;
        }
        .boltnew-title {
          text-align: center;
          margin-bottom: 2.5rem;
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(45deg, #00d4ff, #00ff88, #ff6b6b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: glow 2s ease-in-out infinite alternate;
        }
        .boltnew-card-vertical {
          width: 100%;
          background: rgba(255,255,255,0.06);
          box-shadow: 0 4px 22px rgba(0,255,136,0.06);
          border-radius: 22px;
          padding: 2.2rem 1.5rem 1.6rem 1.5rem;
          margin: 0 auto 2.2rem auto;
          border: 1.5px solid rgba(0,212,255,0.08);
          transition: transform 0.15s, box-shadow 0.15s, border 0.2s;
        }
        .boltnew-card-vertical:hover {
          transform: translateY(-8px) scale(1.015);
          box-shadow: 0 12px 42px rgba(0,255,136,0.13);
          border-color: #00ff88;
        }
        .boltnew-card-vertical h2 {
          font-size: 1.3rem;
          margin-bottom: 1.2em;
          font-weight: 700;
          background: linear-gradient(45deg, #00d4ff, #00ff88);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 7px rgba(0,212,255,0.10));
        }
        .boltnew-card-vertical ul {
          margin: 0.6em 0 0.8em 1.1em;
          padding-left: 0.7em;
          font-size: 1em;
        }
        .boltnew-card-vertical li {
          margin-bottom: 0.52em;
          line-height: 1.6;
        }
        
        .boltnew-card-vertical i {
          color: #00d4ff;
        }
        @media (max-width: 600px) {
          .boltnew-title {
            font-size: 1.45rem;
          }
          .boltnew-card-vertical {
            padding: 1.2rem 0.8rem 1.1rem 0.8rem;
            font-size: 0.98rem;
          }
        }
        @keyframes glow {
          from { filter: drop-shadow(0 0 8px rgba(0,212,255,0.25)); }
          to   { filter: drop-shadow(0 0 18px rgba(0,255,136,0.16)); }
        }
      `}</style>
    </>
  );
}