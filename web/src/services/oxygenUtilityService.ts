import { demoStore } from '../data/demoStore';

// Types
export interface OxygenCylinder {
    id: string;
    serialNumber: string;
    status: 'FULL' | 'EMPTY' | 'IN_USE';
    location: string;
    size: string;
    logs: unknown[];
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
    return demoStore.getOxygenCylinders();
};

export const createCylinder = async (data: Partial<OxygenCylinder>) => {
    const newCylinder: OxygenCylinder = {
        id: `ox-${Date.now()}`,
        serialNumber: data.serialNumber || `O2-${Math.floor(Math.random() * 9000 + 1000)}`,
        status: (data.status as OxygenCylinder['status']) || 'FULL',
        location: data.location || 'Main Store',
        size: data.size || 'Jumbo',
        logs: []
    };
    return demoStore.addOxygenCylinder(newCylinder);
};

export const logCylinderMovement = async (id: string, action: string, location: string, status?: string) => {
    void action;
    return demoStore.moveOxygenCylinder(id, location, status);
};

// Utility API
export const getReadings = async (): Promise<UtilityReading[]> => {
    return demoStore.getUtilityReadings();
};

export const recordReading = async (type: string, value: number, unit: string) => {
    const newReading: UtilityReading = {
        id: `ut-${Date.now()}`,
        type: type as UtilityReading['type'],
        value,
        unit,
        recordedAt: new Date().toISOString()
    };
    return demoStore.addUtilityReading(newReading);
};
