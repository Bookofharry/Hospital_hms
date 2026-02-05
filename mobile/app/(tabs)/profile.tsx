import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function ProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        router.replace('/');
    };

    return (
        <View className="flex-1 bg-gray-50 p-6">
            <View className="bg-white p-6 rounded-lg shadow-sm mb-6 items-center">
                <View className="h-20 w-20 bg-blue-100 rounded-full items-center justify-center mb-4">
                    <Text className="text-2xl font-bold text-blue-600">
                        {user?.name?.charAt(0) || 'U'}
                    </Text>
                </View>
                <Text className="text-xl font-bold text-gray-900">{user?.name}</Text>
                <Text className="text-gray-500">{user?.email}</Text>
                <View className="mt-2 bg-blue-50 px-3 py-1 rounded-full">
                    <Text className="text-xs text-blue-700 font-semibold">{user?.role}</Text>
                </View>
            </View>

            <TouchableOpacity
                className="bg-red-50 p-4 rounded-lg flex-row justify-center items-center"
                onPress={handleLogout}
            >
                <Text className="text-red-600 font-bold">Log Out</Text>
            </TouchableOpacity>
        </View>
    );
}
