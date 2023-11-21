import axios from 'axios';
import { getCookie } from './cookie.fn';

const { VITE_LMS_API_NONPROD, VITE_LMS_API_PROD } = import.meta.env;

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? VITE_LMS_API_NONPROD : VITE_LMS_API_PROD,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  },
});

api.interceptors.request.use((config) => {
  const token = getCookie('token');
  token && (config.headers['Authorization'] = `Bearer ${token}`);
  return config;
});

export default api;