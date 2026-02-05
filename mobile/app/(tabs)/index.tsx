import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getMyWorkOrders, WorkOrder } from '../../services/workOrderService';
import WorkOrderCard from '../../components/WorkOrderCard';

export default function MyJobsScreen() {
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await getMyWorkOrders();
            setWorkOrders(data);
        } catch (error) {
            console.error('Failed to fetch jobs', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchJobs();
        }, [])
    );

    if (loading && workOrders.length === 0) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50 p-4">
            <FlatList
                data={workOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <WorkOrderCard workOrder={item} />}
                ListEmptyComponent={
                    <View className="mt-10 items-center">
                        <Text className="text-gray-500">No jobs assigned yet.</Text>
                    </View>
                }
                refreshing={loading}
                onRefresh={fetchJobs}
            />
        </View>
    );
}
