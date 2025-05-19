import { io } from 'socket.io-client';

const backendURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'https://chatnest-server-13k4.onrender.com';

const socket = io(backendURL);

export default socket;
export { backendURL };