import axios from 'axios';

// Dynamically normalize API Base URL ensuring trailing /api is present
const rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_BASE_URL = rawBase.endsWith('/api') ? rawBase : `${rawBase.replace(/\/+$/, '')}/api`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Request interceptor to attach Firebase or JWT Auth Token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('scamsense_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to catch network / connection errors with friendly messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.friendlyMessage = 'Unable to connect to ScamSense AI server. Please ensure the backend is running and try again.';
    } else if (error.response.status === 401) {
      error.friendlyMessage = 'Session expired or unauthorized. Please sign in again.';
    } else if (error.response.status === 404) {
      error.friendlyMessage = error.response.data?.detail || 'Requested resource not found.';
    } else if (error.response.status >= 500) {
      error.friendlyMessage = error.response.data?.detail || 'ScamSense AI server encountered an error analyzing this input. Please try again.';
    } else {
      error.friendlyMessage = error.response.data?.detail || error.message || 'An error occurred during scan.';
    }
    return Promise.reject(error);
  }
);

// Health check endpoint
export const checkHealth = () => api.get('/health');

// Universal and specialized scan endpoints
export const scanContent = (payload) => api.post('/scan', payload);
export const scanText = (text, sender = '') => api.post('/scan/text', { text, sender });
export const scanUrl = (url) => api.post('/scan/url', { url });
export const scanPhone = (phoneNumber) => api.post('/scan/phone', { phone_number: phoneNumber });
export const scanMulti = (data) => api.post('/scan/multi', data);
export const scanQr = (formData) => api.post('/scan/qr', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// User scan history endpoints
export const getScanHistory = () => api.get('/scan/history');
export const getScanById = (scanId) => api.get(`/scan/history/${scanId}`);
export const deleteScanHistory = (scanId) => api.delete(`/scan/history/${scanId}`);

// User authentication endpoints
export const loginUser = (email, password) => api.post('/v1/auth/login', { email, password });
export const registerUser = (email, password, fullName) => api.post('/v1/auth/register', { email, password, full_name: fullName });
export const getMe = () => api.get('/v1/auth/me');

// Community reports & intelligence
export const getReports = (params) => api.get('/v1/reports', { params });
export const createReport = (data) => api.post('/v1/reports', data);
export const upvoteReport = (id) => api.post(`/v1/reports/${id}/upvote`);

// Threat intel & analytics
export const checkBlacklist = (entityValue) => api.post('/v1/blacklist/check', { entity_value: entityValue });
export const getAnalyticsSummary = () => api.get('/v1/analytics/summary');

export default api;
