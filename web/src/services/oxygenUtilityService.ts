import api from './api';

// Types
export interface OxygenCylinder {
    id: string;
    serialNumber: string;
    status: 'FULL' | 'EMPTY' | 'IN_USE';
    location: string;
    size: string;
    logs: any[];
}

export interface UtilityReading {
    id: string;
    type: 'ELECTRICITY' | 'WATER' | 'DIESEL';
    value: number;
    unit: string;
    recordedAt: string;
    recordedBy?: { name: string };
}

// Oxygen API
export const getCylinders = async (): Promise<OxygenCylinder[]> => {
    const response = await api.get('/oxygen');
    return response.data;
};

export const createCylinder = async (data: Partial<OxygenCylinder>) => {
    const response = await api.post('/oxygen', data);
    return response.data;
};

export const logCylinderMovement = async (id: string, action: string, location: string, status?: string) => {
    const response = await api.patch(`/oxygen/${id}/move`, { action, location, status });
    return response.data;
};

// Utility API
export const getReadings = async (): Promise<UtilityReading[]> => {
    const response = await api.get('/utilities');
    return response.data;
};

export const recordReading = async (type: string, value: number, unit: string) => {
    const response = await api.post('/utilities', { type, value, unit });
    return response.data;
};
