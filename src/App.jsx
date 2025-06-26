import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
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
import OAuthHandler from './pages/OAuthHandler';
import Footer from './components/Footer';
import Particles from './components/Particles';
import FloatingActionButton from './components/FloatingActionButton';
import MoneyMateComingSoon from './components/MoneyMateComingSoon';
import BoltNew from './pages/BoltNew';
import './styles/App.css';

// --- GLOBAL SCROLL TO TOP COMPONENT ---
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Particles />
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/oauth" element={<OAuthHandler />} />
          {/* Protected routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/voice" element={<PrivateRoute><VoiceAssistant /></PrivateRoute>} />
          <Route path="/gamification" element={<PrivateRoute><Gamification /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
          <Route path="/invest" element={<PrivateRoute><Investment /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/founder" element={<PrivateRoute><Founder /></PrivateRoute>} />
          <Route path='/coming-soon' element={<PrivateRoute><MoneyMateComingSoon/></PrivateRoute>} />
          <Route path="/bolt-new" element={<BoltNew />} />
        </Routes>
        <Footer />
        <FloatingActionButton />
      </div>
    </Router>
  );
}

export default App;