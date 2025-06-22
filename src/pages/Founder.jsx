import React from 'react';

const Founder = () => {
  const socialLinks = [
    { icon: '💼', title: 'LinkedIn' },
    { icon: '⚡', title: 'GitHub' },
    { icon: '🐦', title: 'Twitter' },
    { icon: '📧', title: 'Email' }
  ];

  return (
    <div className="page active">
      <div className="founder-hero">
        <div className="founder-image">👨‍💻</div>
        <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Meet the Founder</h1>
        <h2 style={{ marginBottom: '2rem', color: '#00d4ff' }}>Rahul Sharma</h2>
        <p style={{ 
          maxWidth: '600px', 
          margin: '0 auto 2rem', 
          opacity: 0.9, 
          lineHeight: 1.6 
        }}>
          "I created MoneyMate because I was tired of boring budgeting apps that felt like homework. After struggling with my own finances in college, I realized that money management should be fun, engaging, and as addictive as your favorite mobile game."
        </p>
        
        <div className="social-links">
          {socialLinks.map((link, index) => (
            <div 
              key={index} 
              className="social-link" 
              title={link.title}
            >
              {link.icon}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>🚀 The Vision</h3>
          <p style={{ opacity: 0.8, lineHeight: 1.6, marginBottom: '1rem' }}>
            MoneyMate isn't just another budgeting app - it's a movement to make financial literacy accessible and enjoyable for everyone. We're building the future where managing money feels like playing your favorite game, complete with rewards, achievements, and a personal AI coach cheering you on.
          </p>
          <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
            Our mission is to help 10 million young adults build healthy financial habits by 2026, one saved rupee and one level-up at a time.
          </p>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>💡 The Journey</h3>
          <p style={{ opacity: 0.8, lineHeight: 1.6, marginBottom: '1rem' }}>
            Started as a weekend project during my final year at IIT Delhi, MoneyMate was born from personal frustration. I was spending ₹300 daily on food without realizing it, and every budgeting app felt like a spreadsheet designed by accountants.
          </p>
          <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
            Today, we're a team of passionate developers, designers, and financial experts working to revolutionize how Gen Z and Millennials think about money.
          </p>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>🌟 Join Our Journey</h3>
          <p style={{ opacity: 0.8, lineHeight: 1.6, marginBottom: '2rem' }}>
            We're always looking for feedback, partnerships, and amazing people to join our mission. Whether you're a user, investor, or just someone who believes in making finance fun, let's connect!
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="cta-button">💌 Get in Touch</button>
            <button className="cta-button">🚀 Join the Team</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Founder;