import React, { useState, useEffect } from "react";

// Transaction modals (GEN Z style)
const TransactionModal = ({
  show,
  type,
  onClose,
  onSubmit,
  categories,
  defaultCategory,
}) => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState(defaultCategory || "");

  useEffect(() => {
    setAmount("");
    setNote("");
    setCategory(defaultCategory || "");
  }, [show, type, defaultCategory]);

  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="onboarding-modal" style={{ maxWidth: 380 }}>
        <button
          onClick={onClose}
          className="close-btn"
          style={{ top: "0.7rem", right: "1rem", zIndex: 2, position: "absolute" }}
        >
          ✕
        </button>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          {type === "income" ? "➕ Add Income" : "➖ Add Expense"}
        </h2>
        <div className="form-group">
          <label className="form-label">Amount (₹)</label>
          <input
            type="number"
            className="form-input"
            value={amount}
            min={0}
            onChange={e => setAmount(e.target.value)}
            autoFocus
          />
        </div>
        {type === "expense" && (
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Note (optional)</label>
          <input
            type="text"
            className="form-input"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>
        <button
          className="cta-button"
          style={{ width: "100%" }}
          onClick={() =>
            onSubmit({
              amount: parseFloat(amount),
              note: note,
              category: type === "expense" ? category : undefined,
            })
          }
          disabled={!amount || (type === "expense" && !category)}
        >
          Add {type === "income" ? "Income" : "Expense"}
        </button>
      </div>
    </div>
  );
};

const expenseCategories = [
  "🍔 Food & Drinks",
  "🚗 Travel / Fuel",
  "🛍️ Shopping",
  "🎮 Gaming / Subscriptions",
  "💝 Gifting / Dating",
  "📚 College / Books",
  "Other",
];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [profileCompleted, setProfileCompleted] = useState(false);

  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    ageGroup: "",
    monthlyIncome: "",
    spendingHabits: [],
    trackingLevel: "",
    savingGoal: "",
    goalAmount: "",
    goalDate: "",
    alreadySaved: 0,
    reminderFreq: "",
    motivation: [],
    level: 1,
    xp: 0,
    streak: 0,
    budgetValue: 2500,
    budgetUsed: 0,
    budgetPercentage: 0,
    savingsGoalCurrentSaved: 0,
    savingsGoalTarget: 0,
    totalIncome: 0,
    totalExpense: 0,
    goalProgress: 0,
    goalCompleteBy: "",
  });

  // Onboarding Form Data
  const [formData, setFormData] = useState({
    name: "",
    ageGroup: "18–24",
    monthlyIncome: "",
    spendingHabits: [],
    trackingLevel: "",
    savingGoal: "",
    goalAmount: "",
    goalDate: "",
    alreadySaved: "",
    reminderFreq: "2–3 times a week",
    motivation: [],
  });

  // Simulate navigation - replace with useNavigate() in real app
  const navigate = (path) => console.log(`Navigating to: ${path}`);

  // Fetch dashboard for completed users, fetch /api/auth/me to prefill form if onboarding incomplete
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }
      try {
        // Try dashboard data first
        let dashboardRes = await fetch("/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        let dashboardData = await dashboardRes.json();
        if (
          dashboardData &&
          dashboardData.dashboard &&
          dashboardData.dashboard.user
        ) {
          const d = dashboardData.dashboard;
          const mainGoal = d.goals && d.goals.length > 0 ? d.goals[0] : null;
          setProfileCompleted(Boolean(d.user.onboardingCompleted));
          setUserData({
            name: d.user.name || "",
            level: d.user.level || 1,
            xp: d.user.xp || 0,
            streak: d.user.streak || 0,
            budgetValue: d.budget.remaining || 0,
            budgetUsed: d.budget.used || 0,
            budgetPercentage: d.budget.usedPercentage || 0,
            totalIncome: d.budget.income || 0,
            totalExpense: d.budget.expense || 0,
            savingsGoalCurrentSaved: mainGoal?.currentSaved || 0,
            savingsGoalTarget: mainGoal?.targetAmount || 0,
            savingGoal: mainGoal?.goalName || "",
            goalAmount: mainGoal?.targetAmount || 0,
            goalDate: mainGoal?.targetDate
              ? mainGoal.targetDate.slice(0, 10)
              : "",
            alreadySaved: mainGoal?.currentSaved || 0,
            goalProgress: mainGoal ? Math.round(mainGoal.progress) : 0,
            goalCompleteBy: mainGoal?.targetDate
              ? new Date(mainGoal.targetDate).toLocaleDateString()
              : "",
          });
          setLoading(false);
          if (!d.user.onboardingCompleted) {
            // Prefill onboarding form with profile
            const res = await fetch("/api/auth/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data && data.user) {
              const u = data.user;
              const profileGoal =
                u.savingsGoals && u.savingsGoals.length > 0
                  ? u.savingsGoals[0]
                  : null;
              setFormData({
                name: u.name || "",
                ageGroup: u.ageGroup || "18–24",
                monthlyIncome: u.monthlyIncome || "",
                spendingHabits: u.spendingHabits || [],
                trackingLevel: u.trackingLevel || "",
                savingGoal: profileGoal?.goalName || "",
                goalAmount: profileGoal?.targetAmount || "",
                goalDate: profileGoal?.targetDate
                  ? profileGoal.targetDate.slice(0, 10)
                  : "",
                alreadySaved: profileGoal?.currentSaved || "",
                reminderFreq: u.reminderFreq || "2–3 times a week",
                motivation: u.motivation || [],
              });
            }
          }
          return;
        }
        // Fallback: fetch profile (for onboarding/dummy)
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data && data.user) {
          const u = data.user;
          setProfileCompleted(Boolean(u.onboardingCompleted));
          const mainGoal =
            u.savingsGoals && u.savingsGoals.length > 0
              ? u.savingsGoals[0]
              : null;
          setUserData({
            name: u.name || "",
            ageGroup: u.ageGroup || "",
            monthlyIncome: u.monthlyIncome || "",
            spendingHabits: u.spendingHabits || [],
            trackingLevel: u.trackingLevel || "",
            savingGoal: mainGoal?.goalName || "",
            goalAmount: mainGoal?.targetAmount || "",
            goalDate: mainGoal?.targetDate ? mainGoal.targetDate.slice(0, 10) : "",
            alreadySaved: mainGoal?.currentSaved || 0,
            reminderFreq: u.reminderFreq || "",
            motivation: u.motivation || [],
            level: u.level || 1,
            xp: u.xp || 0,
            streak: u.streak || 0,
            budgetValue: u.monthlyBudget || 2500,
            budgetUsed: 0,
            totalIncome: 0,
            totalExpense: 0,
            goalProgress: mainGoal
              ? Math.round((mainGoal.currentSaved / mainGoal.targetAmount) * 100)
              : 0,
            goalCompleteBy: mainGoal?.targetDate
              ? new Date(mainGoal.targetDate).toLocaleDateString()
              : "",
            savingsGoalCurrentSaved: mainGoal?.currentSaved || 0,
            savingsGoalTarget: mainGoal?.targetAmount || 0,
          });
          setFormData({
            name: u.name || "",
            ageGroup: u.ageGroup || "18–24",
            monthlyIncome: u.monthlyIncome || "",
            spendingHabits: u.spendingHabits || [],
            trackingLevel: u.trackingLevel || "",
            savingGoal: mainGoal?.goalName || "",
            goalAmount: mainGoal?.targetAmount || "",
            goalDate: mainGoal?.targetDate ? mainGoal.targetDate.slice(0, 10) : "",
            alreadySaved: mainGoal?.currentSaved || "",
            reminderFreq: u.reminderFreq || "2–3 times a week",
            motivation: u.motivation || [],
          });
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!loading && !profileCompleted) setShowOnboarding(true);
  }, [loading, profileCompleted]);

  // --- Form Handlers ---
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleMultiSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };
  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const submitOnboarding = async () => {
    // Validation (compulsory)
    const required = [
      ["name", "Please enter your name!"],
      ["ageGroup", "Please select your age group!"],
      ["monthlyIncome", "Please select your monthly income!"],
      ["spendingHabits", "Please select at least one spending habit!"],
      ["trackingLevel", "Please select your expense tracking status!"],
      ["savingGoal", "Please enter a saving goal!"],
      ["goalAmount", "Please enter a goal amount!"],
      ["goalDate", "Please enter a goal date!"],
      ["alreadySaved", "Please enter how much you've already saved!"],
      ["reminderFreq", "Please choose a reminder frequency!"],
      ["motivation", "Please select at least one motivation!"],
    ];
    for (let [field, msg] of required) {
      if (
        !formData[field] ||
        (Array.isArray(formData[field]) && formData[field].length === 0)
      ) {
        alert(msg);
        return;
      }
    }
    // API Call
    try {
      const token = localStorage.getItem("token");
      const payload = {
        name: formData.name,
        ageGroup: formData.ageGroup,
        monthlyIncome: formData.monthlyIncome,
        spendingHabits: formData.spendingHabits,
        trackingLevel: formData.trackingLevel,
        savingGoal: formData.savingGoal,
        goalAmount: formData.goalAmount,
        goalDeadline: formData.goalDate,
        alreadySaved: formData.alreadySaved,
        reminderFreq: formData.reminderFreq,
        motivation: formData.motivation,
      };
      const res = await fetch("/api/onboarding", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setProfileCompleted(true);
        setShowOnboarding(false);
        // Re-fetch dashboard data for personalized values
        const dres = await fetch("/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dash = await dres.json();
        const d = dash.dashboard;
        const mainGoal = d.goals && d.goals.length > 0 ? d.goals[0] : null;
        setUserData({
          name: d.user.name || "",
          level: d.user.level || 1,
          xp: d.user.xp || 0,
          streak: d.user.streak || 0,
          budgetValue: d.budget.remaining || 0,
          budgetUsed: d.budget.used || 0,
          budgetPercentage: d.budget.usedPercentage || 0,
          totalIncome: d.budget.income || 0,
          totalExpense: d.budget.expense || 0,
          savingsGoalCurrentSaved: mainGoal?.currentSaved || 0,
          savingsGoalTarget: mainGoal?.targetAmount || 0,
          savingGoal: mainGoal?.goalName || "",
          goalAmount: mainGoal?.targetAmount || 0,
          goalDate: mainGoal?.targetDate ? mainGoal.targetDate.slice(0, 10) : "",
          alreadySaved: mainGoal?.currentSaved || 0,
          goalProgress: mainGoal ? Math.round(mainGoal.progress) : 0,
          goalCompleteBy: mainGoal?.targetDate
            ? new Date(mainGoal.targetDate).toLocaleDateString()
            : "",
        });
      } else {
        alert(data.message || "Failed to save onboarding!");
      }
    } catch (e) {
      alert("Error saving onboarding: " + e.message);
    }
  };

  // --- Transactions ---
  const handleAddIncome = async ({ amount, note }) => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/finance/income", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, note }),
    });
    const data = await res.json();
    if (data.success) {
      await refreshDashboard();
    }
    setShowIncomeModal(false);
  };

  const handleAddExpense = async ({ amount, note, category }) => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/finance/expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, note, category }),
    });
    const data = await res.json();
    if (data.success) {
      await refreshDashboard();
    }
    setShowExpenseModal(false);
  };

  // --- Budget Meter Logic ---
  // Show nice default for dummy, otherwise use real numbers
  const meterBudgetValue = profileCompleted ? userData.budgetValue : 2500;
  const meterBudgetMax = profileCompleted
    ? userData.budgetValue + userData.budgetUsed
    : 5000;
  const meterPercentage = Math.min(
    (meterBudgetValue / (meterBudgetMax || 1)) * 100,
    100
  );
  const meterGradient = `conic-gradient(#00ff88 0deg ${meterPercentage *
    3.6}deg, #ff6b6b ${meterPercentage * 3.6}deg 360deg)`;

  // --- Savings Goal Logic (GEN Z Live) ---
  const goalCurrent =
    Number(userData.savingsGoalCurrentSaved || 0) +
    Number(userData.totalIncome || 0) -
    Number(userData.totalExpense || 0);
  const goalTarget = Number(userData.savingsGoalTarget || 0);
  const goalPercent = goalTarget
    ? Math.round((goalCurrent / goalTarget) * 100)
    : 0;
  const goalName =
    profileCompleted && userData.savingGoal ? userData.savingGoal : "PS5";
  const goalIcon =
    profileCompleted && goalName.toLowerCase().includes("trip") ? "✈️" : "🎮";

  if (loading) return <div>Loading...</div>;

  return (
    <div className="page active">
      <div className="dashboard">
        {/* Onboarding Prompt if incomplete */}
        {!profileCompleted && (
          <div className="onboarding-prompt">
            <span>
              🚀 Complete your info to get a personalized dashboard that's actually useful!
            </span>
            <button
              className="cta-button"
              onClick={() => setShowOnboarding(true)}
            >
              ✨ Let's Go!
            </button>
          </div>
        )}

        {/* Transaction Buttons */}
        <div className="add-transaction-bar" style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24 }}>
          <button className="add-income-btn" onClick={() => setShowIncomeModal(true)}>
            ➕ Add Income
          </button>
          <button className="add-expense-btn" onClick={() => setShowExpenseModal(true)}>
            ➖ Add Expense
          </button>
        </div>

        <h1 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "2.5rem" }}>
          💰 Your Financial Dashboard
        </h1>

        <div className="dashboard-grid">
          {/* Budget Meter */}
          <div className="card">
            <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>Budget Meter</h3>
            <div className="budget-meter">
              <div className="meter-circle" style={{ background: meterGradient }}>
                <div className="meter-inner">
                  <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#00ff88" }}>
                    ₹{meterBudgetValue.toLocaleString()}
                  </div>
                  <div style={{ opacity: 0.7, fontSize: "1rem" }}>
                    Remaining
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: "1rem",
                color:
                  meterBudgetValue < meterBudgetMax * 0.2
                    ? "#ff6b6b"
                    : "#00ff88",
                marginTop: "0.7rem",
              }}
            >
              {meterBudgetValue < meterBudgetMax * 0.2
                ? "⚠️ Low Budget Left!"
                : `${100 - Math.round((meterBudgetValue / meterBudgetMax) * 100)}% used`}
            </div>
          </div>

          {/* AI Assistant */}
          <div className="card">
            <h3 style={{ marginBottom: "1rem" }}>🤖 AI Assistant</h3>
            <div className="voice-bubble">
              <p>
                {profileCompleted
                  ? `Great job${userData.name ? " " + userData.name : ""}! ${
                      goalName
                        ? `You're making progress on your ${goalName} goal.`
                        : "You're on your way to smart savings!"
                    } Keep it up! 🎉`
                  : "Hey there! Complete your setup to get personalized tips and achieve your money goals faster! 🚀"}
              </p>
            </div>
            <button
              className="cta-button"
              style={{ width: "100%", margin: "0 auto", display: "block" }}
              onClick={() => navigate("/voice")}
            >
              💬 Chat with AI
            </button>
          </div>

          {/* Progress */}
          <div className="card">
            <h3 style={{ marginBottom: "1rem" }}>🎮 Your Progress</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <span style={{ fontSize: "2rem" }}>⚡</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span>Level {userData.level}</span>
                  <span>{userData.xp} XP</span>
                </div>
                <div className="xp-bar">
                  <div className="xp-progress" style={{
                    width: `${Math.min(userData.xp / (userData.level * 1000), 1) * 100}%`
                  }}></div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                🔥 {userData.streak} Day Streak!
              </div>
              <div style={{ opacity: 0.8 }}>Keep logging to maintain your streak</div>
            </div>
          </div>
        </div>

        {/* Savings Goal */}
        <div className="card">
          <h3 style={{ marginBottom: "1rem" }}>
            🎯 Savings Goal: {goalName}
          </h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#00ff88" }}>
                ₹{goalCurrent.toLocaleString()} / ₹{goalTarget.toLocaleString()}
              </div>
              <div style={{ opacity: 0.8 }}>
                {goalPercent}% Complete
                {userData.goalCompleteBy && ` - until ${userData.goalCompleteBy}`}
              </div>
            </div>
            <div style={{ fontSize: "3rem" }}>
              {goalIcon}
            </div>
          </div>
          <div className="xp-bar" style={{ marginTop: "1rem" }}>
            <div className="xp-progress" style={{ width: `${goalPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="onboarding-modal">
            <button
              onClick={() => setShowOnboarding(false)}
              className="close-btn"
              style={{ top: "0.7rem", right: "1rem", zIndex: 2, position: "absolute" }}
            >
              ✕
            </button>
            <div className="modal-header" style={{ marginTop: "2.5rem" }}>
              <h2>🚀 Quick Setup</h2>
              <span>{currentStep}/5</span>
            </div>
            <div className="xp-bar" style={{ marginBottom: "2rem" }}>
              <div className="xp-progress" style={{ width: `${(currentStep / 5) * 100}%` }}></div>
            </div>
            {/* Form Step */}
            {(() => {
              switch (currentStep) {
                case 1:
                  return (
                    <div className="form-step">
                      <h3>👤 Let's get to know you!</h3>
                      <div className="form-group">
                        <label className="form-label">What should we call you?</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter your first name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">What's your age group?</label>
                        <div className="option-grid">
                          {["Under 13", "13–17", "18–24", "25–30", "30+"].map((age) => (
                            <div
                              key={age}
                              className={`option-card ${formData.ageGroup === age ? "selected" : ""}`}
                              onClick={() => handleInputChange("ageGroup", age)}
                            >
                              {age}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                case 2:
                  return (
                    <div className="form-step">
                      <h3>🪙 Money Talk Time!</h3>
                      <div className="form-group">
                        <label className="form-label">How much money do you usually get each month?</label>
                        <p className="form-tip">
                          From pocket money, salary, freelance, side hustles, etc.
                        </p>
                        <div className="option-grid">
                          {[
                            "₹0 – ₹500",
                            "₹500 – ₹1,000",
                            "₹1,000 – ₹3,000",
                            "₹3,000 – ₹5,000",
                            "₹5,000 – ₹10,000",
                            "₹10,000 – ₹25,000",
                            "₹25,000 – ₹50,000",
                            "₹50,000+",
                          ].map((income) => (
                            <div
                              key={income}
                              className={`option-card ${formData.monthlyIncome === income ? "selected" : ""}`}
                              onClick={() => handleInputChange("monthlyIncome", income)}
                            >
                              {income}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                case 3:
                  return (
                    <div className="form-step">
                      <h3>💸 Spending Vibes Check</h3>
                      <div className="form-group">
                        <label className="form-label">What do you usually spend on the most?</label>
                        <p className="form-tip">
                          Pick all that apply! 👆
                        </p>
                        <div className="option-grid multi-select">
                          {[
                            "🍔 Food & Drinks",
                            "🚗 Travel / Fuel",
                            "🛍️ Shopping",
                            "🎮 Gaming / Subscriptions",
                            "💝 Gifting / Dating",
                            "📚 College / Books",
                          ].map((habit) => (
                            <div
                              key={habit}
                              className={`option-card ${formData.spendingHabits.includes(habit) ? "selected" : ""}`}
                              onClick={() => handleMultiSelect("spendingHabits", habit)}
                            >
                              {habit}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Do you keep track of your expenses right now?</label>
                        <div className="option-grid">
                          {["Not at all", "A little", "Yes, I try!"].map((track) => (
                            <div
                              key={track}
                              className={`option-card ${formData.trackingLevel === track ? "selected" : ""}`}
                              onClick={() => handleInputChange("trackingLevel", track)}
                            >
                              {track}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                case 4:
                  return (
                    <div className="form-step">
                      <h3>🎯 What's your saving goal?</h3>
                      <div className="form-group">
                        <label className="form-label">Are you saving for something cool right now?</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="PS5, iPhone 15, Trip to Goa, Emergency Fund..."
                          value={formData.savingGoal}
                          onChange={(e) => handleInputChange("savingGoal", e.target.value)}
                        />
                      </div>
                      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">How much do you want to save for it?</label>
                          <input
                            type="number"
                            className="form-input"
                            placeholder="₹ Amount"
                            value={formData.goalAmount}
                            onChange={(e) => handleInputChange("goalAmount", e.target.value)}
                          />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">By when do you want to achieve this?</label>
                          <input
                            type="date"
                            className="form-input"
                            value={formData.goalDate}
                            onChange={(e) => handleInputChange("goalDate", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">How much have you already saved towards this goal?</label>
                        <input
                          type="number"
                          className="form-input"
                          placeholder="₹ Amount"
                          value={formData.alreadySaved}
                          onChange={(e) => handleInputChange("alreadySaved", e.target.value)}
                          min="0"
                        />
                      </div>
                    </div>
                  );
                case 5:
                  return (
                    <div className="form-step">
                      <h3>⚡ Last bit - Your habits!</h3>
                      <div className="form-group">
                        <label className="form-label">How often do you want to be reminded to save or track your money?</label>
                        <div className="option-grid">
                          {["Every day", "2–3 times a week", "Once a week", "Only when I overspend 😅"].map((freq) => (
                            <div
                              key={freq}
                              className={`option-card ${formData.reminderFreq === freq ? "selected" : ""}`}
                              onClick={() => handleInputChange("reminderFreq", freq)}
                            >
                              {freq}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">What motivates you to save?</label>
                        <p className="form-tip">Pick all that apply! 🎯</p>
                        <div className="option-grid multi-select">
                          {[
                            "🏆 Unlocking rewards",
                            "🛒 Buying something big",
                            "😌 Feeling secure",
                            "👥 Competing with friends",
                            "🤖 Getting praise from AI",
                          ].map((motivation) => (
                            <div
                              key={motivation}
                              className={`option-card ${formData.motivation.includes(motivation) ? "selected" : ""}`}
                              onClick={() => handleMultiSelect("motivation", motivation)}
                            >
                              {motivation}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                default:
                  return null;
              }
            })()}
            <div className="modal-nav">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="modal-btn"
                style={{
                  background: "transparent",
                  color: "#fff",
                  opacity: currentStep === 1 ? 0.5 : 1,
                  cursor: currentStep === 1 ? "not-allowed" : "pointer",
                }}
              >
                ← Back
              </button>
              {currentStep < 5 ? (
                <button onClick={nextStep} className="cta-button">
                  Next →
                </button>
              ) : (
                <button onClick={submitOnboarding} className="cta-button">
                  🎉 Finish Setup
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Income Modal */}
      <TransactionModal
        show={showIncomeModal}
        type="income"
        onClose={() => setShowIncomeModal(false)}
        onSubmit={handleAddIncome}
      />
      {/* Add Expense Modal */}
      <TransactionModal
        show={showExpenseModal}
        type="expense"
        onClose={() => setShowExpenseModal(false)}
        onSubmit={handleAddExpense}
        categories={expenseCategories}
        defaultCategory={expenseCategories[0]}
      />

      {/* --- Styles --- */}
      <style jsx>{`
        .onboarding-prompt {
          background: linear-gradient(135deg, #ff6b6b, #ffd93d);
          border-radius: 15px;
          padding: 1rem 2rem;
          margin: 0 0 2rem 0;
          text-align: center;
          color: #000;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
        }
        .cta-button {
          margin-left: 1rem;
          padding: 0.5rem 1.5rem;
          font-size: 1rem;
          background: linear-gradient(45deg, #00d4ff, #00ff88);
          color: #000;
          border-radius: 18px;
          border: none;
          font-weight: 700;
          cursor: pointer;
        }
        .add-income-btn, .add-expense-btn {
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 16px;
          border: none;
          padding: 0.7rem 1.7rem;
          cursor: pointer;
          background: linear-gradient(45deg, #00ff88, #00d4ff);
          color: #000;
          transition: box-shadow .2s;
        }
        .add-expense-btn {
          background: linear-gradient(45deg, #ff6b6b, #ffd93d);
        }
        .add-income-btn:hover, .add-expense-btn:hover {
          box-shadow: 0 2px 15px rgba(0,0,0,0.10);
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }
        .card {
          background: rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 2rem;
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 5px 25px 0 rgba(0,0,0,0.08);
        }
        .budget-meter {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .meter-circle {
          width: 170px;
          height: 170px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .meter-inner {
          width: 120px;
          height: 120px;
          background: rgba(10,10,10,0.9);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .voice-bubble {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 1rem 1.5rem;
          margin-bottom: 1rem;
          color: #fff;
          font-size: 1.1rem;
        }
        .xp-bar {
          width: 100%;
          height: 12px;
          background: rgba(255,255,255,0.12);
          border-radius: 8px;
          overflow: hidden;
          margin-top: 0.2rem;
        }
        .xp-progress {
          height: 100%;
          background: linear-gradient(90deg, #ffd93d, #ff6b6b);
          border-radius: 8px;
          transition: width 0.35s cubic-bezier(0.4,0,0.2,1);
        }
        .modal-overlay {
          position: fixed;
          top:0;left:0;right:0;bottom:0;
          background: rgba(0,0,0,0.8);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .onboarding-modal {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 25px;
          padding: 2rem;
          max-width: 600px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          border: 1px solid rgba(255,255,255,0.09);
          position: relative;
          animation: fadeInModal 0.25s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeInModal {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .close-btn {
          position: absolute;
          top: 0.7rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #fff;
          cursor: pointer;
          z-index: 2;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.7rem;
        }
        .modal-nav {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
          gap: 1rem;
        }
        .modal-btn {
          padding: 0.8rem 1.5rem;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.2);
          background: transparent;
          color: #fff;
        }
        /* --- Form Step Styles --- */
        .form-step {
          animation: fadeIn .3s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-label {
          display: block;
          margin-bottom: 0.8rem;
          font-weight: 600;
          color: #00d4ff;
          font-size: 1.1rem;
        }
        .form-tip {
          opacity: 0.7;
          font-size: 0.98rem;
          margin-bottom: 1rem;
        }
        .form-input {
          width: 100%;
          padding: 1rem;
          background: rgba(255,255,255,0.05);
          border: 2px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #ffffff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .form-input:focus {
          outline: none;
          border-color: #00d4ff;
          box-shadow: 0 0 15px rgba(0,212,255,0.16);
        }
        .form-input::placeholder {
          color: rgba(255,255,255,0.5);
        }
        .option-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
        }
        .option-grid.multi-select {
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        }
        .option-card {
          padding: 1rem;
          background: rgba(255,255,255,0.07);
          border: 2px solid rgba(255,255,255,0.13);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.25s;
          text-align: center;
          font-weight: 500;
          font-size: 1.07rem;
        }
        .option-card:hover, .option-card.selected {
          background: linear-gradient(45deg, #00d4ff, #00ff88);
          color: #000;
          border-color: #00d4ff;
          box-shadow: 0 6px 18px 0 rgba(0,212,255,0.15);
        }
        @media (max-width: 700px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;