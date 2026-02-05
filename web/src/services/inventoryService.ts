import api from './api';

export interface InventoryItem {
    id: string;
    name: string;
    sku: string;
    description?: string;
    quantity: number;
    minimumStock: number;
    unit: string;
    supplier?: { name: string };
}

export interface Supplier {
    id: string;
    name: string;
    email?: string;
    phone?: string;
}

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
    const response = await api.get('/inventory/items');
    return response.data;
};

export const createInventoryItem = async (data: Partial<InventoryItem> & { supplierId?: string }) => {
    const response = await api.post('/inventory/items', data);
    return response.data;
};

export const adjustStock = async (itemId: string, quantity: number, type: 'IN' | 'OUT', notes?: string) => {
    const response = await api.post(`/inventory/items/${itemId}/adjust`, { quantity, type, notes });
    return response.data;
};

export const getSuppliers = async (): Promise<Supplier[]> => {
    const response = await api.get('/inventory/suppliers');
    return response.data;
};
