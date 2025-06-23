// ✅ MoneyMate Complete Backend - Production Ready
// Voice-powered, gamified personal finance app backend
// Built with Node.js, Express, MongoDB, JWT Auth, OpenAI & ElevenLabs

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';

import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

dotenv.config();
const app = express();

// 🛡️ Middleware
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://moneymate.app',
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Google OAuth Session/Passport Setup ---
app.use(session({
  secret: process.env.SESSION_SECRET || 'super-secret-session',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// 🗄️ Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('🟢 MongoDB Connected Successfully');
  } catch (error) {
    console.error('🔴 MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

// 📊 Database Schemas
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: '👤' },
    googleId: { type: String, default: '' },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    lastCheckIn: { type: Date, default: null },
    badges: [
      {
        name: String,
        icon: String,
        earnedAt: { type: Date, default: Date.now },
      },
    ],
    monthlyBudget: { type: Number, default: 10000 },
    currentBalance: { type: Number, default: 0 },
    totalSaved: { type: Number, default: 0 },
    savingsGoals: [
      {
        goalName: { type: String, required: true },
        targetAmount: { type: Number, required: true },
        currentSaved: { type: Number, default: 0 },
        targetDate: { type: Date, required: true },
        category: {
          type: String,
          enum: [
            'PS5',
            'iPhone',
            'Trip',
            'Emergency',
            'Car',
            'House',
            'Education',
            'Other',
          ],
          default: 'Other',
        },
        priority: {
          type: String,
          enum: ['High', 'Medium', 'Low'],
          default: 'Medium',
        },
        isCompleted: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    transactions: [
      {
        amount: { type: Number, required: true },
        type: { type: String, enum: ['income', 'expense'], required: true },
        category: { type: String, required: true },
        description: { type: String, default: '' },
        date: { type: Date, default: Date.now },
        isRecurring: { type: Boolean, default: false },
        tags: [String],
      },
    ],
    preferences: {
      currency: { type: String, default: 'INR' },
      notifications: { type: Boolean, default: true },
      voiceEnabled: { type: Boolean, default: true },
      theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
    },
    // --- Onboarding custom fields for GenZ UX ---
    ageGroup: { type: String, default: '' },
    spendingHabits: [{ type: String }],
    trackingLevel: { type: String, default: '' },
    reminderFreq: { type: String, default: '' },
    motivation: [{ type: String }],
    onboardingCompleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// 🔐 User Model
const User = mongoose.model('User', userSchema);

// 🛡️ Authentication Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('🔴 Auth Middleware Error:', error.message);
    res.status(401).json({
      success: false,
      message: 'Invalid token.',
    });
  }
};

// --- Google OAuth Logic ---
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value || '',
          avatar:  '👤',
          password: await bcrypt.hash(Math.random().toString(36), 10),
        });
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// --- Google OAuth Routes ---
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.redirect(`${process.env.FRONTEND_URL}/oauth?token=${token}`);
  }
);

// 🎯 Helper Functions
const calculateLevel = (xp) => Math.floor(xp / 1000) + 1;
const calculateProgress = (current, target) => Math.min((current / target) * 100, 100);
const getDaysRemaining = (targetDate) => {
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = target - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
const addXP = async (userId, points, reason) => {
  try {
    const user = await User.findById(userId);
    const oldLevel = user.level;
    user.xp += points;
    user.level = calculateLevel(user.xp);
    if (user.level > oldLevel) {
      user.badges.push({
        name: `Level ${user.level} Achieved`,
        icon: '⚡',
        earnedAt: new Date(),
      });
    }
    await user.save();
    return { levelUp: user.level > oldLevel, newLevel: user.level };
  } catch (error) {
    console.error('🔴 Add XP Error:', error.message);
  }
};

// 🚀 API Routes

// 🧪 Health Check
app.get('/api/ping', (req, res) => {
  res.json({
    success: true,
    message: 'MoneyMate Backend is running ✅',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// 🔑 Authentication Routes

// Register User
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    await addXP(user._id, 100, 'Welcome bonus');

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        level: user.level,
      },
    });
  } catch (error) {
    console.error('🔴 Signup Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during signup',
    });
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    const today = new Date();
    const lastCheckIn = user.lastCheckIn;

    if (lastCheckIn) {
      const daysDiff = Math.floor(
        (today - lastCheckIn) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff === 1) {
        user.streak += 1;
        await addXP(user._id, 50, 'Daily check-in streak');
      } else if (daysDiff > 1) {
        user.streak = 1;
      }
    } else {
      user.streak = 1;
    }

    user.lastCheckIn = today;
    await user.save();

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
      },
    });
  } catch (error) {
    console.error('🔴 Login Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
});

// Forget password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and new password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'No user found with this email.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.json({ success: true, message: 'Password has been changed. You can now log in.' });
  } catch (error) {
    console.error('Forgot Password Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error changing password.' });
  }
});

// Get User Profile
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching profile" });
  }
});

// Update User Profile (name, avatar, etc.)
app.patch('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated!',
      user: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        badges: user.badges,
        totalSaved: user.totalSaved,
        savingsGoals: user.savingsGoals,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
});

// --- ONBOARDING PATCH ENDPOINT (UPDATED) ---
app.patch('/api/onboarding', authMiddleware, async (req, res) => {
  try {
    const {
      name,
      ageGroup,
      monthlyIncome,
      spendingHabits,
      trackingLevel,
      savingGoal,
      goalAmount,
      goalDeadline,
      alreadySaved,
      reminderFreq,
      motivation,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (ageGroup) user.ageGroup = ageGroup;
    if (monthlyIncome) user.monthlyIncome = monthlyIncome;
    if (spendingHabits) user.spendingHabits = spendingHabits;
    if (trackingLevel) user.trackingLevel = trackingLevel;
    if (reminderFreq) user.reminderFreq = reminderFreq;
    if (motivation) user.motivation = motivation;

    // Savings Goal logic
    if (savingGoal && goalAmount && goalDeadline) {
      let mainGoal = user.savingsGoals.find(
        g =>
          g.goalName === savingGoal &&
          g.targetAmount == goalAmount &&
          new Date(g.targetDate).toISOString().slice(0, 10) === goalDeadline
      );
      if (!mainGoal) {
        user.savingsGoals.push({
          goalName: savingGoal,
          targetAmount: parseInt(goalAmount),
          targetDate: new Date(goalDeadline),
          currentSaved: parseInt(alreadySaved) || 0,
        });
      } else {
        mainGoal.currentSaved = parseInt(alreadySaved) || 0;
        mainGoal.targetAmount = parseInt(goalAmount);
        mainGoal.targetDate = new Date(goalDeadline);
      }
    }

    user.onboardingCompleted = true;
    await user.save();

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating onboarding',
    });
  }
});

// --- Helper to get dashboard data (FIXED VERSION) ---
const getDashboardData = (user) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  
  // Calculate monthly income and expenses
  const monthIncome = user.transactions
    .filter((t) => t.type === 'income' && new Date(t.date) >= monthStart)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const monthExpenses = user.transactions
    .filter((t) => t.type === 'expense' && new Date(t.date) >= monthStart)
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate budget remaining: monthly budget - expenses spent this month
  const budgetRemainingRaw = user.monthlyBudget + monthIncome - monthExpenses;
const budgetRemaining = Math.max(0, budgetRemainingRaw);
  const budgetUsedPercentage = user.monthlyBudget > 0
  ? Math.min(Math.max((monthExpenses / user.monthlyBudget) * 100, 0), 100)
  : 0;

  // Calculate active goals with updated progress
  const activeGoals = user.savingsGoals
    .filter((g) => !g.isCompleted)
    .map((goal) => {
      // Goal progress includes: initial saved + net income this month
      const netIncomeThisMonth = monthIncome - monthExpenses;
      const totalSavedForGoal = goal.currentSaved + Math.max(0, netIncomeThisMonth);
      
      return {
        ...goal.toObject(),
        currentSaved: totalSavedForGoal,
        progress: goal.targetAmount > 0
  ? Math.min(Math.max(Math.round((totalSavedForGoal / goal.targetAmount) * 100), 0), 100)
  : 0,
        daysRemaining: Math.max(
          0,
          Math.ceil((new Date(goal.targetDate) - today) / (1000 * 60 * 60 * 24))
        ),
      };
    });

  const recentTransactions = user.transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return {
    user: {
      name: user.name,
      level: user.level,
      xp: user.xp,
      streak: user.streak,
      avatar: user.avatar,
      onboardingCompleted: user.onboardingCompleted,
    },
    budget: {
      monthly: user.monthlyBudget,
      used: monthExpenses,
      remaining: budgetRemaining,
      usedPercentage: Math.round(budgetUsedPercentage * 100) / 100,
      income: monthIncome,
      expense: monthExpenses,
    },
    goals: activeGoals,
    recentTransactions,
    quickStats: {
      totalSaved: user.totalSaved,
      currentBalance: user.currentBalance,
      goalsCount: activeGoals.length,
      badgesCount: user.badges.length,
    },
  };
};

// ==== POST /api/finance/income (FIXED) ====
app.post('/api/finance/income', authMiddleware, async (req, res) => {
  try {
    const { amount, note } = req.body;
    if (!amount || isNaN(Number(amount))) {
      return res.status(400).json({ success: false, message: 'Valid amount required' });
    }

    const user = await User.findById(req.user._id);

    // Add the new income transaction
    user.transactions.push({
      amount: Number(amount),
      type: 'income',
      category: 'Income',
      description: note || '',
      date: new Date(),
    });

    // Update the current balance
    user.currentBalance += Number(amount);

    // Add XP for income tracking
    await addXP(user._id, 25, 'Income added');

    await user.save();

    // Get fresh dashboard data
    const dashboard = getDashboardData(user);
    
    res.json({ 
      success: true, 
      message: 'Income added successfully!',
      dashboard 
    });
  } catch (error) {
    console.error('🔴 Add Income Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==== POST /api/finance/expense (FIXED) ====
app.post('/api/finance/expense', authMiddleware, async (req, res) => {
  try {
    const { amount, note, category } = req.body;
    if (!amount || isNaN(Number(amount))) {
      return res.status(400).json({ success: false, message: 'Valid amount required' });
    }

    const user = await User.findById(req.user._id);

    // Add the new expense transaction
    user.transactions.push({
      amount: Number(amount),
      type: 'expense',
      category: category || 'Other',
      description: note || '',
      date: new Date(),
    });

    // Update the current balance
    user.currentBalance -= Number(amount);

    // Add XP for expense tracking
    await addXP(user._id, 10, 'Expense tracked');

    await user.save();

    // Get fresh dashboard data
    const dashboard = getDashboardData(user);
    
    res.json({ 
      success: true, 
      message: 'Expense added successfully!',
      dashboard 
    });
  } catch (error) {
    console.error('🔴 Add Expense Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==== Add a new Savings Goal ====
app.post('/api/savings/new-goal', authMiddleware, async (req, res) => {
  try {
    const { goalName, targetAmount, targetDate, currentSaved } = req.body;
    if (!goalName || !targetAmount) {
      return res.status(400).json({ success: false, message: 'Goal name and target amount are required.' });
    }

    const user = await User.findById(req.user._id);

    // Optionally, you can mark all previous goals as completed if only one can be active.
    // user.savingsGoals.forEach(g => { g.isCompleted = true; });

    user.savingsGoals.push({
      goalName,
      targetAmount: parseInt(targetAmount),
      targetDate: targetDate ? new Date(targetDate) : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // Default: 6 months from now
      currentSaved: parseInt(currentSaved) || 0,
      isCompleted: false,
    });

    await user.save();

    // Optionally: return updated dashboard data
    const dashboard = getDashboardData(user);

    res.json({
      success: true,
      message: 'New savings goal added!',
      dashboard,
    });
  } catch (error) {
    console.error('🔴 Add New Goal Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error adding new goal.' });
  }
});

// --- Dashboard endpoint (FIXED) ---
app.get('/api/dashboard', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      dashboard: getDashboardData(user),
    });
  } catch (error) {
    console.error('🔴 Dashboard Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard data',
    });
  }
});

// 🔧 Utility Routes

// Update User Preferences
app.patch('/api/preferences', authMiddleware, async (req, res) => {
  try {
    const { monthlyBudget, currency, notifications, voiceEnabled, theme } = req.body;

    const user = await User.findById(req.user._id);

    if (monthlyBudget) user.monthlyBudget = monthlyBudget;
    if (currency) user.preferences.currency = currency;
    if (notifications !== undefined)
      user.preferences.notifications = notifications;
    if (voiceEnabled !== undefined) user.preferences.voiceEnabled = voiceEnabled;
    if (theme) user.preferences.theme = theme;

    await user.save();

    res.json({
      success: true,
      message: 'Preferences updated successfully!',
      preferences: user.preferences,
    });
  } catch (error) {
    console.error('🔴 Update Preferences Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error updating preferences',
    });
  }
});

// 🎮 Gamification Routes

// Add XP
app.post('/api/xp', authMiddleware, async (req, res) => {
  try {
    const { points, reason } = req.body;

    if (!points || points <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid XP points',
      });
    }

    const result = await addXP(req.user._id, points, reason || 'Manual XP');

    res.json({
      success: true,
      message: `Added ${points} XP!`,
      levelUp: result.levelUp,
      newLevel: result.newLevel,
    });
  } catch (error) {
    console.error('🔴 Add XP Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error adding XP',
    });
  }
});

// Update Streak
app.post('/api/streak', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const today = new Date();
    const lastCheckIn = user.lastCheckIn;

    if (lastCheckIn) {
      const daysDiff = Math.floor(
        (today - lastCheckIn) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 0) {
        return res.json({
          success: true,
          message: 'Already checked in today!',
          streak: user.streak,
        });
      } else if (daysDiff === 1) {
        user.streak += 1;
        await addXP(user._id, 50, 'Daily streak');
      } else {
        user.streak = 1;
      }
    } else {
      user.streak = 1;
    }

    user.lastCheckIn = today;
    await user.save();

    res.json({
      success: true,
      message: 'Daily check-in complete!',
      streak: user.streak,
    });
  } catch (error) {
    console.error('🔴 Update Streak Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error updating streak',
    });
  }
});

// 🧠 AI Assistant Routes

// Ask AI
app.post('/api/ask-ai', authMiddleware, async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a question',
      });
    }

    const user = await User.findById(req.user._id);
    const recentTransactions = user.transactions.slice(-5);
    const activeGoals = user.savingsGoals.filter((g) => !g.isCompleted);

    const context = `
User Profile:
- Name: ${user.name}
- Current Balance: ₹${user.currentBalance}
- Monthly Budget: ₹${user.monthlyBudget}
- XP Level: ${user.level}
- Active Goals: ${activeGoals
        .map((g) => `${g.goalName} (₹${g.currentSaved}/₹${g.targetAmount})`)
        .join(', ')}
- Recent Transactions: ${recentTransactions
        .map((t) => `${t.type}: ₹${t.amount} for ${t.category}`)
        .join(', ')}
`;

    const prompt = `You are MoneyMate, a fun and friendly AI financial coach for Gen Z and millennials. 
You speak casually, use emojis, and give practical money advice. 
Keep responses under 100 words and be encouraging.

${context}

User Question: ${question}

Respond as MoneyMate:`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: prompt,
          },
          {
            role: 'user',
            content: question,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content;

    await addXP(user._id, 5, 'AI interaction');

    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('🔴 AI Error:', error.message);

    const fallbackResponses = [
      "Hey! 👋 I'm having a quick brain freeze, but I'm here to help with your money goals! 💪",
      "Oops! 🤖 My circuits are a bit busy right now, but keep tracking those expenses! 📊",
      "Sorry! 😅 I'm updating my financial wisdom. Try asking me again in a moment! ✨",
    ];

    res.json({
      success: true,
      response:
        fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      timestamp: new Date().toISOString(),
      fallback: true,
    });
  }
});

// Voice Synthesis
app.post('/api/voice', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Please provide text to synthesize',
      });
    }

    const response = await axios.post(
      'https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL',
      {
        text: text.substring(0, 500),
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      },
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    const audioBase64 = Buffer.from(response.data).toString('base64');

    res.json({
      success: true,
      audio: `data:audio/mpeg;base64,${audioBase64}`,
      text,
    });
  } catch (error) {
    console.error('🔴 Voice Synthesis Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Voice synthesis temporarily unavailable',
    });
  }
});

// 📊 Analytics Routes

app.get('/api/analytics', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { period = 'month' } = req.query;

    const now = new Date();
    let startDate;
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const periodTransactions = user.transactions.filter(
      (t) => new Date(t.date) >= startDate
    );

    const totalIncome = periodTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = periodTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryBreakdown = {};
    periodTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryBreakdown[t.category] =
          (categoryBreakdown[t.category] || 0) + t.amount;
      });

    const budgetUsed = (totalExpenses / user.monthlyBudget) * 100;

    const goalsProgress = user.savingsGoals.map((goal) => ({
      name: goal.goalName,
      progress: calculateProgress(goal.currentSaved, goal.targetAmount),
      daysRemaining: getDaysRemaining(goal.targetDate),
      onTrack:
        goal.currentSaved >=
        goal.targetAmount * (1 - getDaysRemaining(goal.targetDate) / 365),
    }));

    const topCategories = Object.entries(categoryBreakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalExpenses) * 100,
      }));

    const savingsRate =
      totalIncome > 0
        ? ((totalIncome - totalExpenses) / totalIncome) * 100
        : 0;

    res.json({
      success: true,
      analytics: {
        period,
        summary: {
          totalIncome,
          totalExpenses,
          netSavings: totalIncome - totalExpenses,
          savingsRate: Math.round(savingsRate * 100) / 100,
          budgetUsed: Math.round(budgetUsed * 100) / 100,
          transactionCount: periodTransactions.length,
        },
        categoryBreakdown,
        topCategories,
        goalsProgress,
        gamification: {
          xp: user.xp,
          level: user.level,
          streak: user.streak,
          badgeCount: user.badges.length,
          xpToNextLevel: user.level * 1000 - user.xp,
        },
        insights: [
          budgetUsed > 80
            ? "⚠️ You're close to your monthly budget limit!"
            : '✅ Great job staying within budget!',
          savingsRate > 20
            ? '🎉 Excellent savings rate!'
            : '💡 Try to save at least 20% of your income',
          user.streak > 7
            ? '🔥 Amazing streak! Keep it up!'
            : '📅 Try to check in daily for better habits',
        ],
      },
    });
  } catch (error) {
    console.error('🔴 Analytics Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching analytics',
    });
  }
});

// 🚫 Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('🔴 Unhandled Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// 🚫 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    availableEndpoints: [
      'GET /api/ping',
      'POST /api/auth/signup',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'PATCH /api/auth/me',
      'PATCH /api/onboarding',
      'GET /api/dashboard',
      'POST /api/finance/income',
      'POST /api/finance/expense',
      'POST /api/xp',
      'POST /api/streak',
      'POST /api/ask-ai',
      'POST /api/voice',
      'GET /api/analytics',
      'PATCH /api/preferences',
    ],
  });
});

// 🚀 Server Startup
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`
🚀 MoneyMate Backend Server Started Successfully!
📡 Server running on port ${PORT}
🌐 Environment: ${process.env.NODE_ENV || 'development'}
🗄️  Database: Connected to MongoDB
🔐 JWT Secret: Configured
🤖 OpenAI API: ${process.env.OPENAI_API_KEY ? 'Configured' : 'Not configured'}
🎤 ElevenLabs API: ${process.env.ELEVENLABS_API_KEY ? 'Configured' : 'Not configured'}

📋 Available Endpoints:
   GET  /api/ping                 - Health check
   POST /api/auth/signup          - User registration
   POST /api/auth/login           - User login
   GET  /api/auth/me              - Get user profile
   PATCH /api/auth/me             - Update user profile
   PATCH /api/onboarding          - Save onboarding info
   GET  /api/dashboard            - Dashboard data
   POST /api/finance/income       - Add income
   POST /api/finance/expense      - Add expense
   POST /api/xp                   - Add XP points
   POST /api/streak               - Update daily streak
   POST /api/ask-ai               - AI assistant
   POST /api/voice                - Text-to-speech
   GET  /api/analytics            - Financial analytics
   PATCH /api/preferences         - Update preferences

💡 Ready to power your MoneyMate frontend!
      `);
    });
  } catch (error) {
    console.error('🔴 Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

startServer();