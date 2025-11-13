import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const healthCheck = () => api.get('/health/');
export const getItems = () => api.get('/items/');
export const createItem = (data) => api.post('/items/', data);
export const updateItem = (id, data) => api.put(`/items/${id}/`, data);
export const deleteItem = (id) => api.delete(`/items/${id}/`);

export default api;
