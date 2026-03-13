import axios from 'axios';
import { CONFIG } from '../config/constants';

const api = axios.create({
  baseURL: CONFIG.API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-app-token': CONFIG.APP_TOKEN
  }
});

export default api;
