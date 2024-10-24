// src/socket.js
import { io } from 'socket.io-client';

const socket = io('https://real-time-chat-app-peach.vercel.app/'); // Adjust the URL if your server is hosted elsewhere
export default socket;
