import NetInfo from '@react-native-community/netinfo';
import { getMyWorkOrders, updateWorkOrderStatus, addTimeLog } from './workOrderService';
import {
    cacheWorkOrders,
    getCachedWorkOrders,
    getPendingUpdates,
    removePendingUpdate,
    type PendingUpdate
} from './offlineStorage';

let isOnline = true;
let syncInProgress = false;

// Initialize network listener
export const initNetworkListener = () => {
    NetInfo.addEventListener(state => {
        const wasOffline = !isOnline;
        isOnline = state.isConnected ?? false;

        // If we just came back online, sync pending updates
        if (wasOffline && isOnline) {
            console.log('Network restored, syncing pending updates...');
            syncPendingUpdates();
        }
    });
};

// Check if device is online
export const checkOnline = async (): Promise<boolean> => {
    const state = await NetInfo.fetch();
    isOnline = state.isConnected ?? false;
    return isOnline;
};

export const getIsOnline = () => isOnline;

// Fetch work orders with offline fallback
export const fetchWorkOrdersWithOfflineFallback = async () => {
    try {
        if (await checkOnline()) {
            // Online: fetch from API and cache
            const workOrders = await getMyWorkOrders();
            await cacheWorkOrders(workOrders);
            return { workOrders, isFromCache: false };
        } else {
            // Offline: return cached data
            const workOrders = await getCachedWorkOrders();
            return { workOrders, isFromCache: true };
        }
    } catch (error) {
        // API error: fallback to cache
        console.log('API error, falling back to cache:', error);
        const workOrders = await getCachedWorkOrders();
        return { workOrders, isFromCache: true };
    }
};

// Sync all pending updates to server
export const syncPendingUpdates = async (): Promise<{ success: number; failed: number }> => {
    if (syncInProgress) {
        console.log('Sync already in progress');
        return { success: 0, failed: 0 };
    }

    if (!(await checkOnline())) {
        console.log('Cannot sync: offline');
        return { success: 0, failed: 0 };
    }

    syncInProgress = true;
    const updates = await getPendingUpdates();
    let success = 0;
    let failed = 0;

    for (const update of updates) {
        try {
            await processPendingUpdate(update);
            await removePendingUpdate(update.id);
            success++;
        } catch (error) {
            console.error('Failed to sync update:', update.id, error);
            failed++;
        }
    }

    syncInProgress = false;
    console.log(`Sync complete: ${success} success, ${failed} failed`);
    return { success, failed };
};

// Process a single pending update
const processPendingUpdate = async (update: PendingUpdate) => {
    switch (update.type) {
        case 'STATUS_CHANGE':
            await updateWorkOrderStatus(update.payload.workOrderId, update.payload.status);
            break;
        case 'TIME_LOG':
            await addTimeLog(
                update.payload.workOrderId,
                update.payload.minutes,
                update.payload.description
            );
            break;
        case 'PHOTO_UPLOAD':
            // Photo uploads are more complex, skip for now
            console.log('Photo upload sync not implemented yet');
            break;
        default:
            console.warn('Unknown update type:', update.type);
    }
};

// Get pending updates count for UI indicator
export const getPendingUpdatesCount = async (): Promise<number> => {
    const updates = await getPendingUpdates();
    return updates.length;
};
