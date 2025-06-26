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
        <div className="founder-image" >👨‍💻</div>
        <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Meet the Founder</h1>
        <h2 style={{ marginBottom: '2rem', color: '#00d4ff' }}>Dishit Shah</h2>
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
MoneyMate wasn’t just an idea — it was a challenge. As a final-year student at Ahmedabad University, I came across the Bolt.new global hackathon and saw a unique opportunity: build something that actually helps my generation manage money better. That challenge lit the fuse. I knew I didn’t want to build another boring finance tracker — I wanted to build a buddy.
          </p>
          <p style={{ opacity: 0.8, lineHeight: 1.6, marginBottom: '1rem' }}>
With a love for frontend design, gamification, and voice tech, I poured my energy into building something Gen Z would enjoy using. What started as a weekend experiment became MoneyMate — an app that understands your impulsive Swiggy orders, keeps track like a smart friend, and celebrates every $100 saved.
          </p>
          <p style={{ opacity: 0.8, lineHeight: 1.6, marginBottom: '1rem' }}>
From sketching wireframes in Figma to deploying full-stack code in Bolt.new, I’ve worn every hat. MoneyMate came to life during the Bolt.new competition, and that one push from the community helped turn a raw idea into a working prototype. I’m incredibly grateful to Bolt.new for giving me that launchpad.
          </p>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>🌟 Join Our Journey</h3>
          <p style={{ opacity: 0.8, lineHeight: 1.6, marginBottom: '2rem' }}>
            We're always looking for feedback, partnerships, and amazing people to join our mission. Whether you're a user, investor, or just someone who believes in making finance fun, let's connect!
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            
      <button className="cta-button" onClick={() => window.open('https://www.linkedin.com/in/dishit-shah-224353283/', '_blank')}>💌 Get in Touch</button>
    
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Founder;