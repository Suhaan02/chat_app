import { io } from 'socket.io-client';

const socket = io('http://10.252.142.220:3001');
export default socket;