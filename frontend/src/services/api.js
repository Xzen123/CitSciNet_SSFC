import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Add token to requests
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default {
    // Auth
    login: (data) => axios.post(`${API_URL}/api/auth/login`, data),
    register: (data) => axios.post(`${API_URL}/api/auth/register`, data),

    // Projects
    getProjects: () => axios.get(`${API_URL}/api/projects`),
    createProject: (data) => axios.post(`${API_URL}/api/projects`, data),

    // Observations
    getObservations: () => axios.get(`${API_URL}/api/observations`),
    submitObservation: (data) => axios.post(`${API_URL}/api/observations`, data),

    // Uploads
    uploadImage: (formData) => axios.post(`${API_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // Export
    exportData: () => axios.get(`${API_URL}/api/export/csv`, { responseType: 'blob' }),

    // Gamification
    getProfile: (userId) => axios.get(`${API_URL}/api/gamification/profile/${userId}`),
    getLeaderboard: () => axios.get(`${API_URL}/api/gamification/leaderboard`),

    // Validation
    getPendingValidation: () => axios.get(`${API_URL}/api/validation/pending`),
    submitReview: (data) => axios.post(`${API_URL}/api/validation/review`, data),
};
