import { demoStore } from '../data/demoStore';

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
    return demoStore.getPreventivePlans();
};

export const createPreventivePlan = async (data: Partial<PreventivePlan>) => {
    const newPlan: PreventivePlan = {
        id: `pm-${Date.now()}`,
        name: data.name || 'New Plan',
        description: data.description,
        frequency: (data.frequency as PreventivePlan['frequency']) || 'MONTHLY',
        assetId: data.assetId,
        assignedToId: data.assignedToId,
        nextDue: data.nextDue || new Date().toISOString(),
        isActive: true,
        asset: data.asset,
        assignedTo: data.assignedTo
    };
    return demoStore.addPreventivePlan(newPlan as any);
};
