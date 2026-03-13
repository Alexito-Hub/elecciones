import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
  transports: ['websocket'],
  extraHeaders: {
    'x-app-token': import.meta.env.VITE_APP_TOKEN
  }
});

export default socket;
