// ============================================
// App.jsx - Root Component with Routing
// ============================================
// Sets up BrowserRouter, AuthProvider, global toast,
// and all client-side routes with route guards.
// ============================================

import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import Landing from './pages/Landing';
import LoadingSpinner from './components/common/LoadingSpinner';

// ── Route Guards ────────────────────────────────────────────

// TODO: Implement PrivateRoute
// - Read `user` and `loading` from AuthContext
// - If still loading → show <LoadingSpinner fullScreen />
// - If user exists → render children
// - Otherwise → <Navigate to="/login" replace />
const PrivateRoute = ({ children }) => {
  // TODO: implement
};

// TODO: Implement PublicRoute
// - Read `user` and `loading` from AuthContext
// - If still loading → show <LoadingSpinner fullScreen />
// - If user already logged in → <Navigate to="/dashboard" replace />
// - Otherwise → render children
const PublicRoute = ({ children }) => {
  // TODO: implement
};

// ── Route Definitions ───────────────────────────────────────
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
    <Route
      path="/dashboard"
      element={
        <PrivateRoute>
          <ChatProvider><Dashboard /></ChatProvider>
        </PrivateRoute>
      }
    />
    <Route
      path="/chat/:id"
      element={
        <PrivateRoute>
          <ChatProvider><ChatPage /></ChatProvider>
        </PrivateRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { background: '#1f2937', color: '#f9fafb', fontSize: '14px' },
            success: { iconTheme: { primary: '#10b981', secondary: '#f9fafb' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#f9fafb' } },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
