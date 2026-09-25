// ============================================
// api.js - Axios Instance with Interceptors
// ============================================
// Creates a single reusable Axios instance that:
//   1. Attaches JWT token to every outgoing request
//   2. Auto-redirects to /login on 401 responses
// Also exports all authAPI and chatAPI helper methods.
// ============================================

import axios from 'axios';

const API_BASE = '/api';

// Create axios instance with base URL and timeout
const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000, // 60s for AI responses
});

// ── Request Interceptor ──────────────────────────────────────
// TODO: Add a request interceptor that reads `token` from
// localStorage and, if present, sets
// config.headers.Authorization = `Bearer ${token}`
// Return config at the end.
api.interceptors.request.use((config) => {
  // TODO: implement
  return config;
});

// ── Response Interceptor ─────────────────────────────────────
// TODO: Add a response interceptor.
// - On success: pass the response through unchanged.
// - On error: if error.response?.status === 401, clear
//   localStorage ('token' and 'user') and redirect to /login.
//   Always return Promise.reject(error).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: implement 401 handling
    return Promise.reject(error);
  }
);

// ── Auth API ─────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  getMe:    ()     => api.get('/auth/me'),
};

// ── Chat API ─────────────────────────────────────────────────
export const chatAPI = {
  getAll:   ()    => api.get('/chats'),
  getById:  (id)  => api.get(`/chats/${id}`),
  create:   (data = {}) => api.post('/chats', data),
  delete:   (id)  => api.delete(`/chats/${id}`),
  getStats: ()    => api.get('/chats/stats'),

  // TODO: Implement askText
  // POST /chats/:chatId/text  with body { question, subject }
  askText: (chatId, question, subject) => {
    // TODO: implement
  },

  // TODO: Implement askImage
  // Build a FormData object: append 'image', optional 'question', optional 'subject'
  // POST /chats/:chatId/image  with multipart/form-data header and timeout: 90000
  askImage: (chatId, imageFile, question, subject) => {
    // TODO: implement
  },

  // TODO: Implement askVoice
  // Build a FormData object: append 'audio' blob as 'voice_recording.webm',
  // optional 'subject'
  // POST /chats/:chatId/voice  with multipart/form-data header and timeout: 90000
  askVoice: (chatId, audioBlob, subject) => {
    // TODO: implement
  },
};

export default api;
