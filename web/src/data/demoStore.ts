import {
    demoAssets,
    demoWorkOrders,
    demoUsers,
    demoInventoryItems,
    demoSuppliers,
    demoPreventivePlans,
    demoOxygenCylinders,
    demoUtilityReadings,
    demoRequisitions,
    demoDashboardStats,
    demoWorkOrderStats,
    demoAssetHealth
} from './demo';

type AssetDemo = (typeof demoAssets)[number] & {
    purchaseDate?: string;
};

type WorkOrderDemo = {
    id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    createdAt: string;
    asset?: { id: string; name: string; location: string };
    assignedTo?: { id: string; name: string };
    createdBy: { name: string };
    attachments?: { id: string; url: string; fileName: string; fileType: string; createdAt: string }[];
    timeLogs?: { id: string; minutes: number; description: string; user: { name: string }; createdAt: string }[];
};

type UserDemo = (typeof demoUsers)[number] & {
    status?: string;
};

type InventoryDemo = {
    id: string;
    name: string;
    sku: string;
    description?: string;
    quantity: number;
    minimumStock: number;
    unit: string;
    supplier?: { name: string };
};

type SupplierDemo = {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
};

type PreventiveDemo = Omit<(typeof demoPreventivePlans)[number], 'asset' | 'assignedTo'> & {
    asset?: { name: string };
    assignedTo?: { name: string };
};

type OxygenDemo = {
    id: string;
    serialNumber: string;
    status: 'FULL' | 'IN_USE' | 'EMPTY';
    location: string;
    size: string;
    logs: unknown[];
};

type UtilityDemo = {
    id: string;
    type: 'ELECTRICITY' | 'WATER' | 'DIESEL';
    value: number;
    unit: string;
    recordedAt: string;
    recordedBy?: { name: string };
};

type RequisitionDemo = {
    id: string;
    title: string;
    description?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    requesterId: string;
    requester: { name: string; email: string };
    approverId?: string;
    approver?: { name: string };
    createdAt: string;
};

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

let assets: AssetDemo[] = [...demoAssets];
let workOrders: WorkOrderDemo[] = [...demoWorkOrders];
let users: UserDemo[] = [...demoUsers];
let inventoryItems: InventoryDemo[] = [...demoInventoryItems];
let suppliers: SupplierDemo[] = [...demoSuppliers];
let preventivePlans: PreventiveDemo[] = [...demoPreventivePlans];
let oxygenCylinders: OxygenDemo[] = [...demoOxygenCylinders];
let utilityReadings: UtilityDemo[] = [...demoUtilityReadings];
let requisitions: RequisitionDemo[] = [...demoRequisitions];

export const demoStore = {
    async getAssets() {
        await delay();
        return [...assets];
    },
    async addAsset(asset: AssetDemo) {
        assets = [asset, ...assets];
        return asset;
    },
    async getWorkOrders() {
        await delay();
        return [...workOrders];
    },
    async getWorkOrder(id: string) {
        await delay();
        return workOrders.find((wo) => wo.id === id) ?? null;
    },
    async addWorkOrder(data: Partial<WorkOrderDemo>) {
        const newWO: WorkOrderDemo = {
            id: `wo-${Date.now()}`,
            title: data.title || 'Untitled request',
            description: data.description || 'No description provided.',
            priority: data.priority || 'MEDIUM',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            asset: data.asset,
            assignedTo: data.assignedTo,
            createdBy: data.createdBy || { name: 'Current User' },
            attachments: [],
            timeLogs: []
        };
        workOrders = [newWO, ...workOrders];
        return newWO;
    },
    async updateWorkOrderStatus(id: string, status: string) {
        workOrders = workOrders.map((wo) => (wo.id === id ? { ...wo, status } : wo));
        return workOrders.find((wo) => wo.id === id) ?? null;
    },
    async addWorkOrderTimeLog(id: string, log: { minutes: number; description: string; user: { name: string } }) {
        workOrders = workOrders.map((wo) =>
            wo.id === id
                ? {
                    ...wo,
                    timeLogs: [
                        ...(wo.timeLogs || []),
                        {
                            id: `log-${Date.now()}`,
                            minutes: log.minutes,
                            description: log.description,
                            user: log.user,
                            createdAt: new Date().toISOString()
                        }
                    ]
                }
                : wo
        );
        return workOrders.find((wo) => wo.id === id) ?? null;
    },
    async addWorkOrderAttachment(id: string, attachment: { fileName: string }) {
        workOrders = workOrders.map((wo) =>
            wo.id === id
                ? {
                    ...wo,
                    attachments: [
                        ...(wo.attachments || []),
                        {
                            id: `att-${Date.now()}`,
                            url: '/demo/wo/uploaded.jpg',
                            fileName: attachment.fileName,
                            fileType: 'image/jpeg',
                            createdAt: new Date().toISOString()
                        }
                    ]
                }
                : wo
        );
        return workOrders.find((wo) => wo.id === id) ?? null;
    },
    async getUsers() {
        await delay();
        return [...users];
    },
    async addUser(user: UserDemo) {
        users = [user, ...users];
        return user;
    },
    async deleteUser(id: string) {
        users = users.filter((u) => u.id !== id);
    },
    async getInventoryItems() {
        await delay();
        return [...inventoryItems];
    },
    async addInventoryItem(item: InventoryDemo) {
        inventoryItems = [item, ...inventoryItems];
        return item;
    },
    async adjustInventoryItem(id: string, quantity: number, type: 'IN' | 'OUT') {
        inventoryItems = inventoryItems.map((item) =>
            item.id === id
                ? {
                    ...item,
                    quantity: type === 'IN' ? item.quantity + quantity : Math.max(item.quantity - quantity, 0)
                }
                : item
        );
        return inventoryItems.find((item) => item.id === id) ?? null;
    },
    async getSuppliers() {
        await delay();
        return [...suppliers];
    },
    async addSupplier(data: { name: string; email?: string; phone?: string; address?: string }) {
        const newSupplier: SupplierDemo = { id: `sup-${Date.now()}`, ...data };
        suppliers = [newSupplier, ...suppliers];
        return newSupplier;
    },
    async getPreventivePlans() {
        await delay();
        return [...preventivePlans];
    },
    async addPreventivePlan(data: PreventiveDemo) {
        preventivePlans = [data, ...preventivePlans];
        return data;
    },
    async getOxygenCylinders() {
        await delay();
        return [...oxygenCylinders];
    },
    async addOxygenCylinder(data: OxygenDemo) {
        oxygenCylinders = [data, ...oxygenCylinders];
        return data;
    },
    async moveOxygenCylinder(id: string, location: string, status?: string) {
        oxygenCylinders = oxygenCylinders.map((c) =>
            c.id === id
                ? {
                    ...c,
                    location,
                    status: (status as typeof c.status) || c.status
                }
                : c
        );
        return oxygenCylinders.find((c) => c.id === id) ?? null;
    },
    async getUtilityReadings() {
        await delay();
        return [...utilityReadings];
    },
    async addUtilityReading(data: UtilityDemo) {
        utilityReadings = [data, ...utilityReadings];
        return data;
    },
    async getRequisitions() {
        await delay();
        return [...requisitions];
    },
    async addRequisition(data: RequisitionDemo) {
        requisitions = [data, ...requisitions];
        return data;
    },
    async approveRequisition(id: string, approverName = 'Dr. Amina Kone') {
        requisitions = requisitions.map((req) =>
            req.id === id
                ? { ...req, status: 'APPROVED', approver: { name: approverName } }
                : req
        );
        return requisitions.find((req) => req.id === id) ?? null;
    },
    async rejectRequisition(id: string, approverName = 'Dr. Amina Kone') {
        requisitions = requisitions.map((req) =>
            req.id === id
                ? { ...req, status: 'REJECTED', approver: { name: approverName } }
                : req
        );
        return requisitions.find((req) => req.id === id) ?? null;
    },
    async getDashboardStats() {
        await delay();
        return { ...demoDashboardStats };
    },
    async getWorkOrderStats() {
        await delay();
        return [...demoWorkOrderStats];
    },
    async getAssetHealth() {
        await delay();
        return [...demoAssetHealth];
    },
    async getUtilityTrends() {
        await delay();
        return [...utilityReadings].reverse();
    }
};
