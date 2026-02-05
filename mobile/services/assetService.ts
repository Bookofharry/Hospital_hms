import api from './api';

export interface Asset {
    id: string;
    name: string;
    type: string;
    model: string;
    serialNumber: string;
    location: string;
    department?: { name: string };
    status: string;
    workOrders?: any[]; // Simplified for list
}

export const getAssetById = async (id: string): Promise<Asset> => {
    const response = await api.get(`/assets/${id}`);
    return response.data;
};

export const getAssetHistory = async (id: string) => {
    const response = await api.get(`/assets/${id}/history`);
    return response.data;
};
