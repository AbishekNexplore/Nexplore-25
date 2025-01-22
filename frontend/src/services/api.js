import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:10001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Don't override Content-Type if it's already set (for multipart/form-data)
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const careerAPI = {
  getRecommendations: () => api.get('/recommendations'),
  generateRecommendations: () => api.post('/recommendations/generate'),
  getTrends: () => api.get('/recommendations/trends')
};

export const chatAPI = {
  startChat: () => api.post('/chat/start'),
  sendMessage: (chatId, message) => api.post(`/chat/${chatId}/message`, { message }),
  getChatHistory: () => api.get('/chat/history'),
  getCareerAdvice: () => api.get('/chat/advice')
};

export const resumeAPI = {
  uploadResume: (formData) => api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAnalysis: () => api.get('/resume/analysis'),
  deleteResume: (id) => api.delete(`/resume/${id}`)
};

export const analyticsAPI = {
  getPublicTrends: () => api.get('/analytics/trends/public'),
  getDetailedTrends: () => api.get('/analytics/trends/detailed'),
  getSkillTrends: () => api.get('/analytics/skills'),
  getIndustryTrends: () => api.get('/analytics/industries')
};

export default api;
