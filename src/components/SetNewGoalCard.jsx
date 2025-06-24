import React, { useState } from "react";

export default function SetNewGoalCard({ onSave }) {
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const handleSave = async () => {
    if (!goalName || !targetAmount || !targetDate) return alert("Fill all fields!");
    await fetch('/api/savings/new-goal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ goalName, targetAmount, targetDate }),
    });
    onSave();
    setGoalName('');
    setTargetAmount('');
    setTargetDate('');
  };

  return (
    <div className="card new-goal-card">
      <h3>🎉 Goal Achieved! Set a New Saving Goal</h3>
      <input placeholder="Goal Name" value={goalName} onChange={e => setGoalName(e.target.value)} />
      <input type="number" placeholder="Target Amount" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} />
      <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} />
      <button onClick={handleSave}>Create Goal</button>
    </div>
  );
}