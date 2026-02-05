import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getAssetById, Asset } from '../../services/assetService';
import StatusBadge from '../../components/StatusBadge'; // Assuming we can reuse or I'll create a simple one
import { ArrowLeft, Wrench, MapPin, Box } from 'lucide-react-native';

export default function AssetDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [asset, setAsset] = useState<Asset | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAsset();
    }, [id]);

    const fetchAsset = async () => {
        try {
            const data = await getAssetById(id as string);
            setAsset(data);
        } catch (error) {
            console.error('Failed to fetch asset', error);
            Alert.alert('Error', 'Failed to load asset details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    if (!asset) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Asset Not Found</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <ArrowLeft size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-gray-900">Asset Details</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Main Card */}
                <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <View className="flex-row justify-between items-start mb-2">
                        <Text className="text-xl font-bold text-gray-900 flex-1 mr-2">{asset.name}</Text>
                        <Text className={`px-2 py-1 rounded-full text-xs font-bold ${asset.status === 'OPERATIONAL' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {asset.status}
                        </Text>
                    </View>

                    <View className="flex-row items-center mt-2">
                        <Box size={16} color="#6B7280" />
                        <Text className="ml-2 text-gray-600">{asset.model} (SN: {asset.serialNumber})</Text>
                    </View>

                    <View className="flex-row items-center mt-2">
                        <MapPin size={16} color="#6B7280" />
                        <Text className="ml-2 text-gray-600">{asset.location} {asset.department ? ` - ${asset.department.name}` : ''}</Text>
                    </View>
                </View>

                {/* Actions */}
                <TouchableOpacity
                    className="bg-blue-600 p-4 rounded-lg flex-row justify-center items-center mb-6"
                    onPress={() => Alert.alert('Coming Soon', 'Create Work Order from Asset is coming in next update.')}
                >
                    <Wrench size={20} color="white" />
                    <Text className="text-white font-bold ml-2">Report Issue</Text>
                </TouchableOpacity>

                {/* History? (Placeholder for now) */}
                <Text className="text-lg font-bold text-gray-900 mb-2">Recent Work Orders</Text>
                {(!asset.workOrders || asset.workOrders.length === 0) ? (
                    <Text className="text-gray-400 italic">No history found</Text>
                ) : (
                    asset.workOrders.map((wo: any) => (
                        <View key={wo.id} className="bg-white p-3 rounded-lg border border-gray-100 mb-2">
                            <Text className="font-semibold">{wo.title}</Text>
                            <Text className="text-xs text-gray-500">{new Date(wo.createdAt).toLocaleDateString()}</Text>
                        </View>
                    ))
                )}

            </ScrollView>
        </View>
    );
}
