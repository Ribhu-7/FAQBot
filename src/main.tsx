import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Dynamically inject Material Symbols Outlined stylesheet to ensure icons render out-of-the-box
const linkElement = document.createElement('link');
linkElement.rel = 'stylesheet';
linkElement.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';
document.head.appendChild(linkElement);

// Dynamically inject Google Fonts for Geist and Inter
const fontsLink = document.createElement('link');
fontsLink.rel = 'stylesheet';
fontsLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Geist:wght@400;500;600;700&display=swap';
document.head.appendChild(fontsLink);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
