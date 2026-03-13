import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
    'x-app-token': import.meta.env.VITE_APP_TOKEN || 'AuralixToken2026' // Valor por defecto para dev
  }
});

export default api;
