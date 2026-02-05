import { demoStore } from '../data/demoStore';

export interface DashboardStats {
    totalAssets: number;
    activeWorkOrders: number;
    lowStockItems: number;
    emptyCylinders: number;
}

export interface ChartData {
    name: string;
    value: number;
}

export interface UtilityReading {
    id: string;
    type: string;
    value: number;
    unit: string;
    recordedAt: string;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    return demoStore.getDashboardStats();
};

export const getWorkOrderStats = async (): Promise<ChartData[]> => {
    return demoStore.getWorkOrderStats();
};

export const getAssetHealth = async (): Promise<ChartData[]> => {
    return demoStore.getAssetHealth();
};

export const getUtilityTrends = async (): Promise<UtilityReading[]> => {
    return demoStore.getUtilityTrends();
};
