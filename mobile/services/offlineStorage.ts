import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    WORK_ORDERS: 'offline_work_orders',
    PENDING_UPDATES: 'offline_pending_updates',
    LAST_SYNC: 'offline_last_sync'
};

export interface PendingUpdate {
    id: string;
    type: 'STATUS_CHANGE' | 'TIME_LOG' | 'PHOTO_UPLOAD';
    payload: any;
    timestamp: number;
}

// Cache work orders for offline access
export const cacheWorkOrders = async (workOrders: any[]) => {
    try {
        await AsyncStorage.setItem(KEYS.WORK_ORDERS, JSON.stringify(workOrders));
        await AsyncStorage.setItem(KEYS.LAST_SYNC, new Date().toISOString());
    } catch (error) {
        console.error('Error caching work orders:', error);
    }
};

// Get cached work orders
export const getCachedWorkOrders = async (): Promise<any[]> => {
    try {
        const data = await AsyncStorage.getItem(KEYS.WORK_ORDERS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting cached work orders:', error);
        return [];
    }
};

// Get last sync timestamp
export const getLastSyncTime = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(KEYS.LAST_SYNC);
    } catch (error) {
        return null;
    }
};

// Add a pending update to the queue
export const addPendingUpdate = async (update: Omit<PendingUpdate, 'id' | 'timestamp'>) => {
    try {
        const existing = await getPendingUpdates();
        const newUpdate: PendingUpdate = {
            ...update,
            id: Date.now().toString(),
            timestamp: Date.now()
        };
        await AsyncStorage.setItem(KEYS.PENDING_UPDATES, JSON.stringify([...existing, newUpdate]));
        return newUpdate;
    } catch (error) {
        console.error('Error adding pending update:', error);
        throw error;
    }
};

// Get all pending updates
export const getPendingUpdates = async (): Promise<PendingUpdate[]> => {
    try {
        const data = await AsyncStorage.getItem(KEYS.PENDING_UPDATES);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting pending updates:', error);
        return [];
    }
};

// Remove a pending update after successful sync
export const removePendingUpdate = async (id: string) => {
    try {
        const updates = await getPendingUpdates();
        const filtered = updates.filter(u => u.id !== id);
        await AsyncStorage.setItem(KEYS.PENDING_UPDATES, JSON.stringify(filtered));
    } catch (error) {
        console.error('Error removing pending update:', error);
    }
};

// Clear all pending updates
export const clearPendingUpdates = async () => {
    try {
        await AsyncStorage.removeItem(KEYS.PENDING_UPDATES);
    } catch (error) {
        console.error('Error clearing pending updates:', error);
    }
};

// Clear all offline data
export const clearOfflineData = async () => {
    try {
        await AsyncStorage.multiRemove([KEYS.WORK_ORDERS, KEYS.PENDING_UPDATES, KEYS.LAST_SYNC]);
    } catch (error) {
        console.error('Error clearing offline data:', error);
    }
};
