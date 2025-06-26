import React from 'react';
import { useNavigate } from 'react-router-dom';

const Investment = () => {
  const navigate = useNavigate();

  const investments = [
    {
      icon: '🏦',
      title: 'Mutual Funds',
      risk: 'LOW RISK',
      riskColor: 'rgba(0, 255, 136, 0.2)',
      description: 'Diversified portfolio with 12% average annual returns',
      riskPosition: '25%',
      minInvestment: '$500',
      returns: '+12% Returns',
      returnsColor: '#00ff88'
    },
    {
      icon: '🥇',
      title: 'Gold ETF',
      risk: 'MEDIUM RISK',
      riskColor: 'rgba(255, 217, 61, 0.2)',
      description: 'Digital gold investment with high liquidity',
      riskPosition: '50%',
      minInvestment: '$100',
      returns: '+8% Returns',
      returnsColor: '#ffd93d'
    },
    {
      icon: '🇺🇸',
      title: 'US Stocks',
      risk: 'HIGH RISK',
      riskColor: 'rgba(255, 107, 107, 0.2)',
      description: 'Invest in top US companies like Apple, Google',
      riskPosition: '75%',
      minInvestment: '$1,000',
      returns: '+15% Returns',
      returnsColor: '#ff6b6b'
    },
    {
      icon: '🏠',
      title: 'SIP Plans',
      risk: 'LOW RISK',
      riskColor: 'rgba(0, 255, 136, 0.2)',
      description: 'Systematic Investment Plan for steady growth',
      riskPosition: '30%',
      minInvestment: '$500/month',
      returns: '+10% Returns',
      returnsColor: '#00ff88'
    }
  ];

  return (
    <div className="page active">
      <div className="insight">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>💹 Smart Investments</h1>
          <p style={{ marginBottom: '3rem', opacity: 0.8 }}>
            Grow your savings with AI-recommended, low-risk investments
          </p>
        </div>

        <div className="insight-card" style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>🤖 AI Recommendation</h3>
          <p>
            "You've saved $5,000 this month! Consider investing $2,000 in a balanced mutual fund for long-term growth."
          </p>
        </div>
      </div>

      <div className="invest-grid">
        {investments.map((investment, index) => (
          <div key={index} className="investment-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}
            >
              <h3>{investment.icon} {investment.title}</h3>
              <span
                style={{
                  background: investment.riskColor,
                  padding: '0.3rem 0.8rem',
                  borderRadius: '15px',
                  fontSize: '0.8rem'
                }}
              >
                {investment.risk}
              </span>
            </div>

            <p style={{ opacity: 0.8, marginBottom: '1rem' }}>{investment.description}</p>

            <div className="risk-meter">
              <div
                className="risk-indicator"
                style={{ left: investment.riskPosition }}
              ></div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '1rem 0'
              }}
            >
              <span>Min Investment: {investment.minInvestment}</span>
              <span style={{ color: investment.returnsColor }}>
                {investment.returns}
              </span>
            </div>

            <button className="cta-button" onClick={() => navigate('/coming-soon')}style={{ width: '100%' }}>
              {investment.icon === '🏦' && '📈 Invest Now'}
              {investment.icon === '🥇' && '✨ Buy Gold'}
              {investment.icon === '🇺🇸' && '🚀 Start Trading'}
              {investment.icon === '🏠' && '⚡ Auto-Invest'}

              
            </button>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', margin: '3rem 0' }}>
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ marginBottom: '1rem' }}>🎓 Investment Learning</h3>
          <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
            Take our interactive quiz to learn about investments and earn XP!
          </p>
          <button
            className="cta-button"
            onClick={() => navigate('/coming-soon')}
          >
            🧠 Start Learning Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Investment;
