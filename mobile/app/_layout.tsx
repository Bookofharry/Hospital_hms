import { Stack } from 'expo-router';
import "../global.css";
import { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initSocket, disconnectSocket, getSocket } from '../services/socket';
import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '../services/notificationService';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true
    }),
});

export default function Layout() {
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    useEffect(() => {
        const checkAuthAndConnect = async () => {
            const token = await AsyncStorage.getItem('token');
            const userStr = await AsyncStorage.getItem('user');
            if (token && userStr) {
                const user = JSON.parse(userStr);
                const socket = initSocket(user.id);

                socket.on('notification', (payload: { message: string }) => {
                    // We can show alert, or rely on the native push if app is background
                    // For foreground, socket is faster.
                    Alert.alert('Notification', payload.message);
                });

                // Register function
                await registerForPushNotificationsAsync();
            }
        };

        checkAuthAndConnect();

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            // notification received in foreground
            console.log(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            // notification tapped
            console.log(response);
            // navigate to detail screen if needed
        });

        return () => {
            disconnectSocket();
            notificationListener.current && notificationListener.current.remove();
            responseListener.current && responseListener.current.remove();
        };
    }, []);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(app)" />
        </Stack>
    );
}
