import React from 'react';

const Analytics = () => {
  const expenseData = [
    { category: 'Food & Dining', amount: 8500, percentage: 40, color: '#ff6b6b' },
    { category: 'Transportation', amount: 4200, percentage: 20, color: '#ffd93d' },
    { category: 'Entertainment', amount: 3400, percentage: 16, color: '#00ff88' },
    { category: 'Shopping', amount: 5100, percentage: 24, color: '#00d4ff' }
  ];

  return (
    <div className="page active">
      <div className="analytics-container">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem' }}>
          📊 Financial Analytics
        </h1>

        <div className="chart-container">
          <h3 style={{ marginBottom: '2rem' }}>💰 Expense Breakdown</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
            <div className="pie-chart"></div>
            <div>
              {expenseData.map((item, index) => (
                <div key={index} style={{ marginBottom: '1rem' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '20px',
                      height: '20px',
                      background: item.color,
                      borderRadius: '3px',
                      marginRight: '10px'
                    }}
                  ></span>
                  {item.category} - ₹{item.amount.toLocaleString()} ({item.percentage}%)
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="insight-card">
          <h3 style={{ marginBottom: '1rem' }}>🧠 AI Insights</h3>
          <p>"Your food spending increased by 15% this month. Consider meal prepping to save ₹2,000 monthly!"</p>
        </div>

        <div className="insight-card">
          <h3 style={{ marginBottom: '1rem' }}>📈 Savings Forecast</h3>
          <p>"At your current rate, you'll reach your PS5 goal by March 2025. Speed up by saving ₹200 more weekly!"</p>
        </div>

        <div className="insight-card">
          <h3 style={{ marginBottom: '1rem' }}>🎯 Weekly Comparison</h3>
          <p>"You spent 20% less than last week! Your biggest improvement was in entertainment expenses."</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;