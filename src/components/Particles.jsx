import React, { useEffect } from 'react';

const Particles = () => {
  useEffect(() => {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    // Clear existing particles
    particlesContainer.innerHTML = '';

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 20 + 's';
      particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
      particlesContainer.appendChild(particle);
    }
  }, []);

  return <div className="particles" id="particles"></div>;
};

export default Particles;