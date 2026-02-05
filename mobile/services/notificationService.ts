import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';
import api from './api';

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            Alert.alert('Permission needed', 'Failed to get push token for push notification!');
            return;
        }

        try {
            const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
            if (!projectId) {
                // For development without EAS, we might not have a project ID yet.
                // We can try to get the token without it, or log a warning.
            }

            token = await Notifications.getExpoPushTokenAsync({
                projectId,
            });
            console.log("Expo Push Token:", token.data);

            // Save to backend
            await api.patch('/users/push-token', { pushToken: token.data });

        } catch (e) {
            console.error('Error getting push token', e);
        }

    } else {
        Alert.alert('Must use physical device for Push Notifications');
    }

    return token?.data;
}
