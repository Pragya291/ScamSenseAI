import axios from 'axios';
import { auth } from '../lib/firebase';

const normalizeUrl = (url) => {
  if (!url) return 'https://scamsense-backend.onrender.com/api';
  const clean = String(url).replace(/^["'`]+|["'`]+$/g, '').trim().replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

// Smart resolution of Backend API Base URL
export const getApiBaseUrl = () => {
  // 1. Explicit user override from localStorage (can be adjusted in Settings)
  if (typeof window !== 'undefined') {
    const storedUrl = localStorage.getItem('scamsense_api_base_url');
    if (storedUrl && storedUrl.trim()) {
      return normalizeUrl(storedUrl.trim());
    }
  }

  // 2. Vite environment variable from build / deploy config
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim() && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return normalizeUrl(envUrl.trim());
  }

  // 3. Localhost development check
  const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isLocal) {
    return normalizeUrl(envUrl || 'http://localhost:8000');
  }

  // 4. Production deployed fallback (Render backend web service)
  // Ensures deployed frontend NEVER calls localhost in production!
  return normalizeUrl(envUrl || 'https://scamsense-backend.onrender.com');
};

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000, // 45 seconds to accommodate Render free-tier cold starts
});

// Request interceptor to attach fresh Firebase or JWT Auth Token
api.interceptors.request.use(async (config) => {
  // Dynamically update baseURL if changed in runtime
  config.baseURL = getApiBaseUrl();

  // Attach fresh Firebase token if user is signed in
  try {
    if (auth && auth.currentUser) {
      const freshToken = await auth.currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${freshToken}`;
      localStorage.setItem('scamsense_token', freshToken);
      return config;
    }
  } catch (tokErr) {
    // fallback to stored token
  }

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
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      error.friendlyMessage = 'Server response timed out. The backend server may be waking up from cold start (~30-45s on free tier). Please retry in a moment.';
    } else if (!error.response) {
      const activeBase = getApiBaseUrl();
      error.friendlyMessage = `Unable to connect to ScamSense AI server at ${activeBase}. Please ensure backend is running or update endpoint in Settings.`;
    } else if (error.response.status === 401) {
      error.friendlyMessage = 'Session expired or unauthorized. Please sign in again.';
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('scamsense_auth_expired'));
      }
    } else if (error.response.status === 403) {
      error.friendlyMessage = error.response.data?.detail || 'Operation forbidden. You do not have permission to access this resource.';
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
