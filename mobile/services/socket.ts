import { io, Socket } from 'socket.io-client';
import { Platform } from 'react-native';

// Use same base URL logic as api.ts
const SOCKET_URL = Platform.select({
    android: 'http://10.0.2.2:3000',
    ios: 'http://localhost:3000', // Simulator
    default: 'http://localhost:3000',
});

let socket: Socket | null = null;

export const initSocket = (userId: string) => {
    if (socket) {
        socket.disconnect();
    }

    socket = io(SOCKET_URL!, {
        transports: ['websocket'], // Force websocket
    });

    socket.on('connect', () => {
        console.log('Mobile Socket connected');
        socket?.emit('join_room', userId);
    });

    return socket;
};

export const getSocket = () => socket;
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
