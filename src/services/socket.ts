import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:8080', {
  withCredentials: true,
  extraHeaders: {
     'x-app-token': import.meta.env.VITE_APP_TOKEN || 'AuralixToken2026'
  }
});

export default socket;
