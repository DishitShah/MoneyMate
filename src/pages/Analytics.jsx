import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const dummyExpenseData = [
  { category: 'Food & Dining', amount: 8500, percentage: 40, color: '#ff6b6b' },
  { category: 'Transportation', amount: 4200, percentage: 20, color: '#ffd93d' },
  { category: 'Entertainment', amount: 3400, percentage: 16, color: '#00ff88' },
  { category: 'Shopping', amount: 5100, percentage: 24, color: '#00d4ff' }
];


const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [lastMonth, setLastMonth] = useState(null);
  const [lastWeek, setLastWeek] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      // fallback: if lastmonth/lastweek is not supported, this will just be null/undefined
      const [month, lastMonthRes, week, lastWeekRes] = await Promise.all([
        fetch('/api/analytics?period=month', { headers }).then(r => r.json()).catch(() => null),
        fetch('/api/analytics?period=lastmonth', { headers }).then(r => r.json()).catch(() => null),
        fetch('/api/analytics?period=week', { headers }).then(r => r.json()).catch(() => null),
        fetch('/api/analytics?period=lastweek', { headers }).then(r => r.json()).catch(() => null),
      ]);
      setAnalytics(month?.analytics);
      setLastMonth(lastMonthRes?.analytics);
      setLastWeek({ thisWeek: week?.analytics, lastWeek: lastWeekRes?.analytics });
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Pie chart data for this month or fallback
  const chartData =
    loading
      ? dummyExpenseData
      : analytics?.categoryBreakdown && Object.keys(analytics.categoryBreakdown).length > 0
        ? (() => {
            const catObj = analytics.categoryBreakdown;
            const total = Object.values(catObj).reduce((sum, val) => sum + val, 0) || 1;
            const colorPalette = ['#ff6b6b', '#ffd93d', '#00ff88', '#00d4ff', '#a685e2', '#ffb347', '#b0e57c'];
            let colorIndex = 0;
            return Object.entries(catObj).map(([category, amount]) => ({
              category,
              amount,
              percentage: Math.round((amount / total) * 100),
              color: colorPalette[colorIndex++ % colorPalette.length]
            }));
          })()
        : dummyExpenseData;

  // 1. Biggest Spending Increase (if lastMonth data exists)
  let biggestIncrease = null;
  if (analytics && lastMonth) {
    let maxCat = "";
    let maxPct = -Infinity;
    for (const cat in analytics.categoryBreakdown) {
      const thisAmt = analytics.categoryBreakdown[cat] || 0;
      const lastAmt = lastMonth.categoryBreakdown?.[cat] || 0;
      if (lastAmt > 0) {
        const pct = ((thisAmt - lastAmt) / lastAmt) * 100;
        if (pct > maxPct) {
          maxPct = pct;
          maxCat = cat;
        }
      }
    }
    if (maxCat && maxPct > 0) {
      biggestIncrease = (
        <div className="insight-card">
          <h3>🚨 Biggest Spending Increase</h3>
          <p>Your <b>{maxCat}</b> spending increased by <b>{Math.round(maxPct)}%</b> compared to last month.</p>
        </div>
      );
    }
  }

  // 2. Best Saving Rate
  let savingRateCard = null;
  if (analytics && analytics.summary) {
    const rate = analytics.summary.savingsRate;
    savingRateCard = (
      <div className="insight-card">
        <h3>💸 Saving Rate</h3>
        <p>
          You saved <b>{rate}%</b> of your income this month.
          {rate > 20 ? " 🏆 Awesome job!" : " Try to save at least 20% for best results."}
        </p>
      </div>
    );
  }

  // 3. Budget Usage
  let budgetCard = null;
  if (analytics && analytics.summary) {
    const used = analytics.summary.budgetUsed;
    budgetCard = (
      <div className="insight-card">
        <h3>📊 Budget Usage</h3>
        <p>
          You've used <b>{used}%</b> of your monthly budget.
          {used > 80 ? " 🚨 Be careful, you are close to your limit!" : used < 50 ? " Great discipline! 👏" : ""}
        </p>
      </div>
    );
  }

  // 4. Top Category
  let topCategoryCard = null;
  if (analytics && analytics.topCategories && analytics.topCategories.length > 0) {
    const top = analytics.topCategories[0];
    topCategoryCard = (
      <div className="insight-card">
        <h3>🍕 Top Spending Category</h3>
        <p>
          Most spent on <b>{top.category}</b>: ${top.amount.toLocaleString()} ({top.percentage ? top.percentage.toFixed(1) : 0}%)
        </p>
      </div>
    );
  }

  // 5. Goal Progress
  let goalCard = null;
  if (analytics && analytics.goalsProgress && analytics.goalsProgress.length > 0) {
    const goal = analytics.goalsProgress[0];
    goalCard = (
      <div className="insight-card">
        <h3>🎯 Goal Progress</h3>
        <p>
          You're <b>{Math.round(goal.progress)}%</b> towards your <b>{goal.name}</b> goal.
        </p>
      </div>
    );
  }

  // 6. Streak Card
  let streakCard = null;
  if (analytics && analytics.gamification) {
    streakCard = (
      <div className="insight-card">
        <h3>🔥 Streak</h3>
        <p>
          You’re on a <b>{analytics.gamification.streak}-day</b> streak! Keep it up!
        </p>
      </div>
    );
  }

  // 7. Transaction Volume
  let txnCard = null;
  if (analytics && analytics.summary) {
    txnCard = (
      <div className="insight-card">
        <h3>💳 Transaction Volume</h3>
        <p>
          You made <b>{analytics.summary.transactionCount}</b> transactions this {analytics.period}.
        </p>
      </div>
    );
  }

  // 8. Expense Drop Card (week over week)
  let expenseDropCard = null;
  if (lastWeek && lastWeek.thisWeek && lastWeek.lastWeek) {
    let maxDrop = 0, bestCat = null;
    for (const cat in lastWeek.lastWeek.categoryBreakdown) {
      const last = lastWeek.lastWeek.categoryBreakdown[cat] || 0;
      const now = lastWeek.thisWeek.categoryBreakdown?.[cat] || 0;
      if (last > 0 && now < last) {
        const drop = ((last - now) / last) * 100;
        if (drop > maxDrop) {
          maxDrop = drop;
          bestCat = cat;
        }
      }
    }
    if (bestCat && maxDrop > 0) {
      expenseDropCard = (
        <div className="insight-card">
          <h3>📉 Expense Drop</h3>
          <p>
            You reduced your <b>{bestCat}</b> spending by <b>{Math.round(maxDrop)}%</b> compared to last week!
          </p>
        </div>
      );
    }
  }

  // 9. Goal On Track
  let goalOnTrackCard = null;
  if (analytics && analytics.goalsProgress && analytics.goalsProgress.length > 0) {
    const goal = analytics.goalsProgress[0];
    if (goal.onTrack) {
      goalOnTrackCard = (
        <div className="insight-card">
          <h3>🚀 On Track!</h3>
          <p>
            You're on track to reach your <b>{goal.name}</b> goal by <b>{goal.daysRemaining} days</b>!
          </p>
        </div>
      );
    }
  }

  // 10. AI-Generated Insight (from backend)
  let aiCard = null;
  if (analytics && analytics.insights && analytics.insights[0]) {
    aiCard = (
      <div className="insight-card">
        <h3>🤖 AI Insight</h3>
        <p>{analytics.insights[0]}</p>
      </div>
    );
  }

  // --- Combine all cards you want to show ---
  if (loading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="page active">
      <div className="analytics-container">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem' }}>
          📊 Financial Analytics
        </h1>
        <div className="chart-container">
          <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>💰 Expense Breakdown</h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            gap: '3rem'
          }}>
            {/* Pie chart on left */}
            <PieChart width={400} height={400}>
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={160}
                innerRadius={70}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`$${value}`, name]} />
            </PieChart>
            {/* Labels on the right */}
            <div>
              {chartData.map((item, index) => (
                <div key={index} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
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
                  <span>
                    {item.category} - ${item.amount?.toLocaleString ? item.amount.toLocaleString() : item.amount} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {biggestIncrease}
        {savingRateCard}
        {topCategoryCard}
        {txnCard}
        {expenseDropCard}
        {goalOnTrackCard}
        {aiCard}
      </div>
    </div>
  );
};

export default Analytics;