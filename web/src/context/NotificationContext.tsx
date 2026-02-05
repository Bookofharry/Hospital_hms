import React, { createContext, useEffect, useContext, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const SOCKET_URL = 'http://localhost:3000';

interface NotificationContextType {
    socket: Socket | null;
}

const NotificationContext = createContext<NotificationContextType>({ socket: null });

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const socketRef = React.useRef<Socket | null>(null);

    useEffect(() => {
        if (user) {
            // Connect to socket
            socketRef.current = io(SOCKET_URL);

            // Join user room
            socketRef.current.emit('join_room', user.id);

            // Listen for notifications
            socketRef.current.on('notification', (payload: { message: string, type: string }) => {
                toast(payload.message, {
                    icon: payload.type === 'NEW_ASSIGNMENT' ? '🔔' : '✅',
                    duration: 5000,
                    position: 'top-right',
                });

                // Play a simple sound if browser allows (optional, skipping for now)
            });

            return () => {
                socketRef.current?.disconnect();
            };
        }
    }, [user]);

    return (
        <NotificationContext.Provider value={{ socket: socketRef.current }}>
            {children}
        </NotificationContext.Provider>
    );
};
