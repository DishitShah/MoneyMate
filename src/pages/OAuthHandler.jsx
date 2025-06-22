import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuthHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromURL = params.get('token');

    if (tokenFromURL) {
      localStorage.setItem('token', tokenFromURL);
      // Clean the URL (remove ?token=...)
      window.history.replaceState({}, document.title, location.pathname);
      navigate('/dashboard', { replace: true }); // or navigate to last requested protected route if you want
    } else {
      navigate('/auth', { replace: true }); // fallback
    }
  }, [location, navigate]);

  return <div>Loading...</div>;
};

export default OAuthHandler;