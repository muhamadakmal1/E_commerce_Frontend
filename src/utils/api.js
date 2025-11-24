import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://e-commerce-backend-0icu.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('minimal_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const registerUser = async (payload) => {
  const response = await api.post('/auth/signup', payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await api.post('/auth/login', payload);
  return response.data;
};

export const getCurrentUser = async (tokenOverride) => {
  const response = await api.get('/auth/me', {
    headers: tokenOverride
      ? {
          Authorization: `Bearer ${tokenOverride}`,
        }
      : undefined,
  });
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put('/auth/profile', data);
  return response.data;
};

export const updateProfilePicture = async (profilePicture) => {
  const response = await api.put('/auth/profile-picture', { profilePicture });
  return response.data;
};

export default api;
