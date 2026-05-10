import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (nom, email, motDePasse, role) =>
    api.post('/auth/register', { nom, email, motDePasse, role }),
  login: (email, motDePasse) =>
    api.post('/auth/login', { email, motDePasse })
};

export const productService = {
  getAllProducts: () => api.get('/products'),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`)
};

export const stockService = {
  getAllLots: () => api.get('/stock'),
  addStockEntry: (data) => api.post('/stock/entry', data),
  removeStock: (data) => api.post('/stock/remove', data),
  getStockHistory: (lotId) => api.get(`/stock/history/${lotId}`)
};

export const alertService = {
  getExpirationAlerts: () => api.get('/alerts/expiration'),
  getExpiredProducts: () => api.get('/alerts/expired'),
  getLowStockAlerts: () => api.get('/alerts/low-stock')
};

export const reportService = {
  getDashboardStats: () => api.get('/reports/dashboard'),
  getInventoryReport: () => api.get('/reports/inventory'),
  getMovementStats: () => api.get('/reports/movements')
};

export default api;