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

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

let assets = [...demoAssets];
let workOrders = [...demoWorkOrders];
let users = [...demoUsers];
let inventoryItems = [...demoInventoryItems];
let suppliers = [...demoSuppliers];
let preventivePlans = [...demoPreventivePlans];
let oxygenCylinders = [...demoOxygenCylinders];
let utilityReadings = [...demoUtilityReadings];
let requisitions = [...demoRequisitions];

export const demoStore = {
    async getAssets() {
        await delay();
        return [...assets];
    },
    async addAsset(asset: typeof assets[number]) {
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
    async addWorkOrder(data: Partial<typeof workOrders[number]>) {
        const newWO = {
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
    async addUser(user: typeof users[number]) {
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
    async addInventoryItem(item: typeof inventoryItems[number]) {
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
        const newSupplier = { id: `sup-${Date.now()}`, ...data };
        suppliers = [newSupplier, ...suppliers];
        return newSupplier;
    },
    async getPreventivePlans() {
        await delay();
        return [...preventivePlans];
    },
    async addPreventivePlan(data: typeof preventivePlans[number]) {
        preventivePlans = [data, ...preventivePlans];
        return data;
    },
    async getOxygenCylinders() {
        await delay();
        return [...oxygenCylinders];
    },
    async addOxygenCylinder(data: typeof oxygenCylinders[number]) {
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
    async addUtilityReading(data: typeof utilityReadings[number]) {
        utilityReadings = [data, ...utilityReadings];
        return data;
    },
    async getRequisitions() {
        await delay();
        return [...requisitions];
    },
    async addRequisition(data: typeof requisitions[number]) {
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
