import { demoStore } from '../data/demoStore';

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
    return demoStore.getInventoryItems();
};

export const createInventoryItem = async (data: Partial<InventoryItem> & { supplierId?: string }) => {
    const newItem: InventoryItem = {
        id: `inv-${Date.now()}`,
        name: data.name || 'New Item',
        sku: data.sku || 'SKU-NEW',
        description: data.description,
        quantity: data.quantity || 0,
        minimumStock: data.minimumStock || 0,
        unit: data.unit || 'pcs',
        supplier: data.supplierId ? { name: 'Supplier' } : undefined
    };
    return demoStore.addInventoryItem(newItem);
};

export const adjustStock = async (itemId: string, quantity: number, type: 'IN' | 'OUT', notes?: string) => {
    void notes;
    return demoStore.adjustInventoryItem(itemId, quantity, type);
};

export const getSuppliers = async (): Promise<Supplier[]> => {
    return demoStore.getSuppliers();
};
