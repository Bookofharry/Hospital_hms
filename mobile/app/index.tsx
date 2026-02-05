import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await api.post('/auth/login', { email, password });

            if (response.data && response.data.token) {
                await AsyncStorage.setItem('token', response.data.token);
                await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

                router.replace('/(tabs)');
            } else {
                Alert.alert('Login Failed', 'Invalid credentials');
            }
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || 'Network error';
            Alert.alert('Error', message);
        }
    };

    return (
        <View className="flex-1 justify-center items-center bg-gray-100 p-4">
            <View className="bg-white p-6 rounded-xl w-full max-w-sm shadow-md">
                <Text className="text-2xl font-bold text-center mb-6 text-gray-800">
                    HMMS Technician
                </Text>

                <TextInput
                    className="border border-gray-300 rounded-lg p-3 mb-4 bg-gray-50"
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    className="border border-gray-300 rounded-lg p-3 mb-6 bg-gray-50"
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    className="bg-blue-600 rounded-lg p-4"
                    onPress={handleLogin}
                >
                    <Text className="text-white text-center font-semibold text-lg">
                        Sign In
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
