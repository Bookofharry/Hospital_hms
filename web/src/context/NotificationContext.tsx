/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useContext, useState, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const SOCKET_URL = 'http://localhost:3000';
const ENABLE_SOCKET = import.meta.env.VITE_ENABLE_SOCKET === 'true';

interface NotificationContextType {
    socket: Socket | null;
}

const NotificationContext = createContext<NotificationContextType>({ socket: null });

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (user && ENABLE_SOCKET) {
            const socketInstance = io(SOCKET_URL);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSocket(socketInstance);

            socketInstance.emit('join_room', user.id);

            socketInstance.on('notification', (payload: { message: string; type: string }) => {
                toast(payload.message, {
                    icon: payload.type === 'NEW_ASSIGNMENT' ? '🔔' : '✅',
                    duration: 5000,
                    position: 'top-right',
                });
            });

            return () => {
                socketInstance.disconnect();
            };
        }
    }, [user]);

    return (
        <NotificationContext.Provider value={{ socket }}>
            {children}
        </NotificationContext.Provider>
    );
};
