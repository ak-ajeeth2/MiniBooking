import axios from 'axios';

// const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

const api = axios.create({ baseURL: API_BASE });

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
}

const saved = localStorage.getItem('token');
if (saved) setAuthToken(saved);

export default api;
