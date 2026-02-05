import api from './api';

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
    const response = await api.get('/reports/stats');
    return response.data;
};

export const getWorkOrderStats = async (): Promise<ChartData[]> => {
    const response = await api.get('/reports/work-orders');
    return response.data;
};

export const getAssetHealth = async (): Promise<ChartData[]> => {
    const response = await api.get('/reports/assets');
    return response.data;
};

export const getUtilityTrends = async (): Promise<UtilityReading[]> => {
    const response = await api.get('/reports/utilities');
    return response.data;
};
