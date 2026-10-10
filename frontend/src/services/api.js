import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach Auth Token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('scamsense_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// API helper functions
export const scanText = (text, sender = '') => api.post('/scan/text', { text, sender });
export const scanUrl = (url) => api.post('/scan/url', { url });
export const scanQr = (formData) => api.post('/scan/qr', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getScanHistory = () => api.get('/scan/history');
export const deleteScanHistory = (scanId) => api.delete(`/scan/history/${scanId}`);

export const loginUser = (email, password) => api.post('/v1/auth/login', { email, password });
export const registerUser = (email, password, fullName) => api.post('/v1/auth/register', { email, password, full_name: fullName });
export const getMe = () => api.get('/v1/auth/me');

export const getReports = (params) => api.get('/v1/reports', { params });
export const createReport = (data) => api.post('/v1/reports', data);
export const upvoteReport = (id) => api.post(`/v1/reports/${id}/upvote`);

export const checkBlacklist = (entityValue) => api.post('/v1/blacklist/check', { entity_value: entityValue });
export const getAnalyticsSummary = () => api.get('/v1/analytics/summary');
