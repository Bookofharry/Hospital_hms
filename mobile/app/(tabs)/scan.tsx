import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function ScanScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const router = useRouter();
    const [scanned, setScanned] = useState(false);

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View className="flex-1 justify-center items-center p-4">
                <Text className="text-center mb-4 text-lg">We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        if (scanned) return;
        setScanned(true);
        console.log("Scanned:", data);

        // Expected format: JSON or URL or just ID?
        // Let's assume the QR code contains the Asset ID directly or a JSON object { assetId: "..." }
        // For MVP, if string looks like a UUID or ID, try to go there.

        try {
            let assetId = data;
            // Basic check if JSON
            if (data.startsWith('{')) {
                const parsed = JSON.parse(data);
                if (parsed.assetId) assetId = parsed.assetId;
            }

            Alert.alert(
                "Asset Scanned",
                `ID: ${assetId}`,
                [
                    { text: "Cancel", onPress: () => setScanned(false), style: "cancel" },
                    {
                        text: "View Details", onPress: () => {
                            router.push(`/assets/${assetId}`);
                            setScanned(false);
                        }
                    }
                ]
            );
        } catch (e) {
            Alert.alert("Error", "Invalid QR Code format");
            setScanned(false);
        }
    };

    return (
        <View className="flex-1 bg-black">
            {/* Header Overlay */}
            <View className="absolute top-12 left-4 z-10">
                <TouchableOpacity onPress={() => router.back()} className="bg-black/50 p-2 rounded-full">
                    <ArrowLeft size={24} color="white" />
                </TouchableOpacity>
            </View>

            <CameraView
                style={StyleSheet.absoluteFillObject}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
            />

            {/* Instruction Overlay */}
            <View className="absolute bottom-20 left-0 right-0 items-center">
                <View className="bg-black/70 px-6 py-3 rounded-full">
                    <Text className="text-white font-semibold">Align QR code within frame</Text>
                </View>
            </View>

            {scanned && (
                <View className="absolute bottom-40 left-0 right-0 items-center">
                    <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
                </View>
            )}
        </View>
    );
}
