import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import StatusBadge from './StatusBadge';
import { WorkOrder } from '../services/workOrderService';

interface WorkOrderCardProps {
    workOrder: WorkOrder;
}

export default function WorkOrderCard({ workOrder }: WorkOrderCardProps) {
    return (
        <Link href={`/work-orders/${workOrder.id}`} asChild>
            <TouchableOpacity className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-3">
                <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-base font-bold text-gray-900 flex-1 mr-2" numberOfLines={1}>
                        {workOrder.title}
                    </Text>
                    <StatusBadge status={workOrder.status} />
                </View>

                <Text className="text-sm text-gray-500 mb-2" numberOfLines={2}>
                    {workOrder.description}
                </Text>

                <View className="flex-row justify-between items-center mt-2">
                    <Text className="text-xs text-blue-600 font-medium">
                        {workOrder.asset ? workOrder.asset.name : 'General'}
                    </Text>
                    <Text className={
                        workOrder.priority === 'CRITICAL' ? 'text-xs text-red-600 font-bold' :
                            workOrder.priority === 'HIGH' ? 'text-xs text-orange-600 font-bold' :
                                'text-xs text-gray-500'
                    }>
                        {workOrder.priority}
                    </Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
}
