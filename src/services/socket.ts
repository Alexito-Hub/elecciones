import { io } from 'socket.io-client';
import { CONFIG } from '../config/constants';

const socket = io(CONFIG.API_URL, {
  withCredentials: true,
  transports: ['websocket'],
  extraHeaders: {
    'x-app-token': CONFIG.APP_TOKEN
  }
});

export default socket;
