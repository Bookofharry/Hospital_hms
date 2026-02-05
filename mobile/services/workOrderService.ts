import api from './api';

export interface Attachment {
    id: string;
    url: string;
    fileName: string;
    fileType: string;
    createdAt: string;
}

export interface TimeLog {
    id: string;
    minutes: number;
    description: string;
    user: { name: string };
    createdAt: string;
}

export interface WorkOrder {
    id: string;
    title: string;
    description: string;
    status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    asset?: {
        name: string;
        location: string;
    };
    createdAt: string;
    attachments?: Attachment[];
    timeLogs?: TimeLog[];
}

export const getMyWorkOrders = async (): Promise<WorkOrder[]> => {
    const response = await api.get('/work-orders');
    return response.data;
};

export const getWorkOrderById = async (id: string): Promise<WorkOrder> => {
    const response = await api.get(`/work-orders/${id}`);
    return response.data;
};

export const updateWorkOrderStatus = async (id: string, status: string) => {
    const response = await api.patch(`/work-orders/${id}`, { status });
    return response.data;
};

export const uploadAttachment = async (workOrderId: string, uri: string) => {
    const formData = new FormData();
    // @ts-ignore
    formData.append('file', {
        uri,
        name: `photo_${Date.now()}.jpg`,
        type: 'image/jpeg',
    });

    const response = await api.post(`/work-orders/${workOrderId}/attachments`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const addTimeLog = async (workOrderId: string, minutes: number, description: string) => {
    const response = await api.post(`/work-orders/${workOrderId}/time-logs`, {
        minutes,
        description
    });
    return response.data;
};
