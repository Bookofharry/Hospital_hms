import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Image, Modal, TextInput, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getWorkOrderById, updateWorkOrderStatus, uploadAttachment, addTimeLog, WorkOrder, Attachment, TimeLog } from '../../services/workOrderService';
import StatusBadge from '../../components/StatusBadge';
import { ArrowLeft, Camera, Clock, Plus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function WorkOrderDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [logMinutes, setLogMinutes] = useState('');
    const [logDescription, setLogDescription] = useState('');
    const [submittingLog, setSubmittingLog] = useState(false);

    useEffect(() => {
        fetchWorkOrder();
    }, [id]);

    const fetchWorkOrder = async () => {
        try {
            const data = await getWorkOrderById(id as string);
            setWorkOrder(data);
        } catch (error) {
            console.error('Failed to fetch work order', error);
            Alert.alert('Error', 'Failed to load details');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            await updateWorkOrderStatus(id as string, newStatus);
            fetchWorkOrder(); // Refresh
            Alert.alert('Success', 'Status updated');
        } catch (error) {
            Alert.alert('Error', 'Failed to update status');
        }
    };

    const pickImage = async () => {
        // Request permissions first
        // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        // if (status !== 'granted') {
        //   Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
        //   return;
        // }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            uploadImage(result.assets[0].uri);
        }
    };

    const uploadImage = async (uri: string) => {
        try {
            await uploadAttachment(id as string, uri);
            fetchWorkOrder();
            Alert.alert("Success", "Photo uploaded");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to upload photo");
        }
    };

    const handleSubmitTimeLog = async () => {
        if (!logMinutes) {
            Alert.alert("Error", "Please enter minutes");
            return;
        }
        setSubmittingLog(true);
        try {
            await addTimeLog(id as string, parseInt(logMinutes), logDescription);
            setModalVisible(false);
            setLogMinutes('');
            setLogDescription('');
            fetchWorkOrder();
            Alert.alert("Success", "Time logged");
        } catch (error) {
            Alert.alert("Error", "Failed to log time");
        } finally {
            setSubmittingLog(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    if (!workOrder) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Work Offer Not Found</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <ArrowLeft size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-gray-900">Details</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <View className="flex-row justify-between items-start mb-2">
                        <Text className="text-xl font-bold text-gray-900 flex-1 mr-2">{workOrder.title}</Text>
                        <StatusBadge status={workOrder.status} />
                    </View>
                    <Text className="text-gray-500 mb-4">{workOrder.description}</Text>

                    <View className="flex-row mt-2">
                        <Text className="font-semibold text-gray-700 w-20">Priority:</Text>
                        <Text className="xml-2 text-gray-900">{workOrder.priority}</Text>
                    </View>
                    <View className="flex-row mt-2">
                        <Text className="font-semibold text-gray-700 w-20">Asset:</Text>
                        <Text className="ml-2 text-blue-600 font-medium">
                            {workOrder.asset ? workOrder.asset.name : 'General'}
                        </Text>
                    </View>
                    {workOrder.asset?.location && (
                        <View className="flex-row mt-2">
                            <Text className="font-semibold text-gray-700 w-20">Location:</Text>
                            <Text className="ml-2 text-gray-900">{workOrder.asset.location}</Text>
                        </View>
                    )}
                </View>

                {/* Attachments Section */}
                <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold text-gray-900">Photos</Text>
                        <TouchableOpacity onPress={pickImage} className="flex-row items-center bg-gray-100 px-3 py-1 rounded-full">
                            <Camera size={16} color="#4B5563" />
                            <Text className="ml-1 text-gray-600 text-xs font-semibold">Add Photo</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                        {workOrder.attachments?.map((att) => (
                            <View key={att.id} className="mr-3">
                                <Image
                                    source={{ uri: `http://localhost:3000${att.url}` }}
                                    className="w-24 h-24 rounded-md bg-gray-200"
                                />
                            </View>
                        ))}
                        {(!workOrder.attachments || workOrder.attachments.length === 0) && (
                            <Text className="text-gray-400 italic">No photos attached</Text>
                        )}
                    </ScrollView>
                </View>

                {/* Time Logs Section */}
                <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold text-gray-900">Time Logs</Text>
                        <TouchableOpacity onPress={() => setModalVisible(true)} className="flex-row items-center bg-gray-100 px-3 py-1 rounded-full">
                            <Clock size={16} color="#4B5563" />
                            <Text className="ml-1 text-gray-600 text-xs font-semibold">Log Time</Text>
                        </TouchableOpacity>
                    </View>

                    {workOrder.timeLogs?.map((log) => (
                        <View key={log.id} className="border-b border-gray-100 py-2">
                            <View className="flex-row justify-between">
                                <Text className="font-semibold text-gray-700">{log.user.name}</Text>
                                <Text className="text-gray-500 text-xs">{new Date(log.createdAt).toLocaleDateString()}</Text>
                            </View>
                            <View className="flex-row justify-between mt-1">
                                <Text className="text-gray-600 text-sm flex-1 mr-2">{log.description || 'Work performed'}</Text>
                                <Text className="font-bold text-blue-600">{log.minutes} mins</Text>
                            </View>
                        </View>
                    ))}
                    {(!workOrder.timeLogs || workOrder.timeLogs.length === 0) && (
                        <Text className="text-gray-400 italic">No time logged yet</Text>
                    )}
                </View>

                {/* Status Actions */}
                <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Actions</Text>

                    <View className="flex-row flex-wrap gap-2">
                        {workOrder.status === 'ASSIGNED' && (
                            <TouchableOpacity
                                className="bg-blue-600 px-4 py-3 rounded-lg flex-1"
                                onPress={() => handleStatusUpdate('IN_PROGRESS')}
                            >
                                <Text className="text-white text-center font-bold">Start Job</Text>
                            </TouchableOpacity>
                        )}

                        {workOrder.status === 'IN_PROGRESS' && (
                            <TouchableOpacity
                                className="bg-green-600 px-4 py-3 rounded-lg flex-1"
                                onPress={() => handleStatusUpdate('COMPLETED')}
                            >
                                <Text className="text-white text-center font-bold">Complete Job</Text>
                            </TouchableOpacity>
                        )}

                        {workOrder.status === 'COMPLETED' && (
                            <View className="bg-gray-100 px-4 py-3 rounded-lg flex-1">
                                <Text className="text-gray-500 text-center">Job Completed. Pending Closure.</Text>
                            </View>
                        )}
                    </View>
                </View>
                <View className="h-20" />
            </ScrollView>

            {/* Time Log Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white p-6 rounded-t-3xl">
                        <Text className="text-xl font-bold mb-4 text-gray-900">Log Time</Text>

                        <Text className="font-semibold text-gray-700 mb-1">Minutes Spent</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg p-3 mb-4 bg-gray-50"
                            placeholder="e.g. 60"
                            keyboardType="numeric"
                            value={logMinutes}
                            onChangeText={setLogMinutes}
                        />

                        <Text className="font-semibold text-gray-700 mb-1">Description</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg p-3 mb-6 bg-gray-50"
                            placeholder="What did you do?"
                            value={logDescription}
                            onChangeText={setLogDescription}
                        />

                        <TouchableOpacity
                            className="bg-blue-600 p-4 rounded-xl mb-3"
                            onPress={handleSubmitTimeLog}
                            disabled={submittingLog}
                        >
                            <Text className="text-white text-center font-bold text-lg">
                                {submittingLog ? 'Saving...' : 'Save Log'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="p-3"
                            onPress={() => setModalVisible(false)}
                        >
                            <Text className="text-gray-500 text-center font-medium">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
