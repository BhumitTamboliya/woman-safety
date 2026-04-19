import { io } from 'socket.io-client';

let socket = null;

export const initSocket = (userId) => {
  if (socket) return socket;

  socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
    withCredentials: true,
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    if (userId) socket.emit('join', userId);
  });

  socket.on('disconnect', () => console.log('Socket disconnected'));

  return socket;
};

export const getSocket = () => socket;

export const joinVolunteerRoom = () => {
  if (socket) socket.emit('joinVolunteerRoom', 'all');
};

export const joinAlertRoom = (alertId) => {
  if (socket) socket.emit('joinAlert', alertId);
};

export const sendLocationUpdate = (alertId, location) => {
  if (socket) socket.emit('locationUpdate', { alertId, location });
};

export const disconnectSocket = () => {
  if (socket) { socket.disconnect(); socket = null; }
};
