import { Tabs } from 'expo-router';
import { ClipboardList, User, QrCode } from 'lucide-react-native';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#2563EB' }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'My Jobs',
                    tabBarIcon: ({ color }) => <ClipboardList size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="scan"
                options={{
                    title: 'Scan',
                    tabBarIcon: ({ color }) => <QrCode size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <User size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
