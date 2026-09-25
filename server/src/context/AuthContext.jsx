// ============================================
// AuthContext.jsx - Global Authentication State
// ============================================
// Provides user, loading, login, register,
// and logout to the entire component tree.
// On mount, validates any stored JWT by calling
// the /auth/me endpoint.
// ============================================

import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Lazy-initialise user from localStorage so the UI doesn't
  // flash "logged out" before the token check completes.
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // ── Token validation on mount ──────────────────────────────
  // TODO: Add a useEffect that:
  //   1. Reads 'token' from localStorage
  //   2. If present, calls authAPI.getMe()
  //      - On success: setUser(data.user) and update localStorage 'user'
  //      - On error: remove 'token' and 'user' from localStorage, setUser(null)
  //      - In both cases: setLoading(false)
  //   3. If no token: setLoading(false) immediately
  useEffect(() => {
    // TODO: implement
  }, []);

  // ── login ──────────────────────────────────────────────────
  // TODO: Implement login(email, password)
  // - Call authAPI.login({ email, password })
  // - Save returned token and user object to localStorage
  // - Call setUser with the returned user
  // - Return the response data
  const login = async (email, password) => {
    // TODO: implement
  };

  // ── register ───────────────────────────────────────────────
  // TODO: Implement register(formData)
  // - Call authAPI.register(formData)
  // - Save returned token and user object to localStorage
  // - Call setUser with the returned user
  // - Return the response data
  const register = async (formData) => {
    // TODO: implement
  };

  // ── logout ─────────────────────────────────────────────────
  // TODO: Implement logout()
  // - Remove 'token' and 'user' from localStorage
  // - Call setUser(null)
  const logout = () => {
    // TODO: implement
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
