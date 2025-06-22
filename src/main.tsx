// src/main.tsx or index.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // ✅ Correct
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
