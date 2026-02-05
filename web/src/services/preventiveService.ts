import api from './api';

export interface PreventivePlan {
    id: string;
    name: string;
    description?: string;
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    assetId?: string;
    assignedToId?: string;
    nextDue: string;
    isActive: boolean;
    asset?: { name: string };
    assignedTo?: { name: string };
}

export const getPreventivePlans = async (): Promise<PreventivePlan[]> => {
    const response = await api.get('/preventive');
    return response.data;
};

export const createPreventivePlan = async (data: Partial<PreventivePlan>) => {
    const response = await api.post('/preventive', data);
    return response.data;
};
