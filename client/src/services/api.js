import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sportconnect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for global response error formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred.',
      status: error.response?.status,
      errors: error.response?.data?.errors,
    };

    if (error.response?.status === 401) {
      // Clear token if unauthorized / token expired
      localStorage.removeItem('sportconnect_token');
    }

    return Promise.reject(customError);
  }
);

// API Service Functions
export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const sportService = {
  getAll: () => api.get('/sports'),
  create: (data) => api.post('/sports', data),
  update: (id, data) => api.put(`/sports/${id}`, data),
  delete: (id) => api.delete(`/sports/${id}`),
};

export const sessionService = {
  getAll: (params) => api.get('/sessions', { params }),
  getById: (id) => api.get(`/sessions/${id}`),
  getMyCreated: () => api.get('/sessions/my-created'),
  getMyJoined: () => api.get('/sessions/my-joined'),
  create: (data) => api.post('/sessions', data),
  join: (id) => api.post(`/sessions/${id}/join`),
  cancel: (id, data) => api.post(`/sessions/${id}/cancel`, data),
  delete: (id) => api.delete(`/sessions/${id}`),
};

export const reportService = {
  getStats: () => api.get('/reports/stats'),
  getAnalytics: (params) => api.get('/reports/analytics', { params }),
};

export default api;
