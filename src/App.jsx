import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import VoiceAssistant from './pages/VoiceAssistant';
import Gamification from './pages/Gamification';
import Analytics from './pages/Analytics';
import Investment from './pages/Investment';
import Profile from './pages/Profile';
import Founder from './pages/Founder';
import Auth from './pages/Auth';
import Footer from './components/Footer';
import Particles from './components/Particles';
import FloatingActionButton from './components/FloatingActionButton';
import MoneyMateComingSoon from './components/MoneyMetComingSoon';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Particles />
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/voice" element={<VoiceAssistant />} />
          <Route path="/gamification" element={<Gamification />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/invest" element={<Investment />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/founder" element={<Founder />} />
          <Route path='/coming-soon' element={<MoneyMateComingSoon/>}/>
        </Routes>
        <Footer />
        <FloatingActionButton />
      </div>
    </Router>
  );
}

export default App;