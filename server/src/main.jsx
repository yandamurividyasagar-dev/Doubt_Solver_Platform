// ============================================
// main.jsx - React Entry Point
// ============================================
// Mounts the React app into the #root DOM element.
// App already wraps everything in BrowserRouter
// and AuthProvider, so nothing extra is needed here.
// ============================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
