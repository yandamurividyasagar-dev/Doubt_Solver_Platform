import axios from 'axios';

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally - auto logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const chatAPI = {
  getAll: () => api.get('/chats'),
  getById: (id) => api.get(`/chats/${id}`),
  create: (data = {}) => api.post('/chats', data),
  delete: (id) => api.delete(`/chats/${id}`),
  getStats: () => api.get('/chats/stats'),

  askText: (chatId, question, subject) =>
    api.post(`/chats/${chatId}/text`, { question, subject }),

  askImage: (chatId, imageFile, question, subject) => {
    const form = new FormData();
    form.append('image', imageFile);
    if (question) form.append('question', question);
    if (subject) form.append('subject', subject);
    return api.post(`/chats/${chatId}/image`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 90000,
    });
  },

  askVoice: (chatId, audioBlob, subject) => {
    const form = new FormData();
    form.append('audio', audioBlob, 'voice_recording.webm');
    if (subject) form.append('subject', subject);
    return api.post(`/chats/${chatId}/voice`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 90000,
    });
  },
};
