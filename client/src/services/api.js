import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// ===== AUTH =====
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// ===== WORKERS =====
export const getWorkers = (params) => API.get('/workers', { params });
export const getWorkerById = (id) => API.get(`/workers/${id}`);
export const createWorkerProfile = (data) => API.post('/workers', data);
export const updateWorkerProfile = (id, data) => API.put(`/workers/${id}`, data);

// ===== SERVICES =====
export const getServices = (params) => API.get('/services', { params });
export const getServiceById = (id) => API.get(`/services/${id}`);
export const createService = (data) => API.post('/services', data);
export const updateService = (id, data) => API.put(`/services/${id}`, data);
export const deleteService = (id) => API.delete(`/services/${id}`);

// ===== REQUESTS =====
export const sendRequest = (data) => API.post('/requests', data);
export const getMyRequests = () => API.get('/requests/my');
export const updateRequestStatus = (id, data) => API.put(`/requests/${id}`, data);

// ===== REVIEWS =====
export const createReview = (data) => API.post('/reviews', data);
export const getWorkerReviews = (workerId) => API.get(`/reviews/${workerId}`);
