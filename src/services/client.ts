import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-app-token': import.meta.env.VITE_APP_TOKEN
  }
});

export default api;
