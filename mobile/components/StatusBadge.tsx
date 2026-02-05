import { View, Text } from 'react-native';
import clsx from 'clsx';

interface StatusBadgeProps {
    status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const statusColors: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        ASSIGNED: 'bg-blue-100 text-blue-800',
        IN_PROGRESS: 'bg-indigo-100 text-indigo-800',
        COMPLETED: 'bg-green-100 text-green-800',
        CLOSED: 'bg-gray-100 text-gray-800',
    };

    return (
        <View className={clsx("px-2 py-1 rounded-full self-start", statusColors[status] || 'bg-gray-100')}>
            <Text className={clsx("text-xs font-semibold", statusColors[status]?.split(' ')[1] || 'text-gray-800')}>
                {status.replace('_', ' ')}
            </Text>
        </View>
    );
}
