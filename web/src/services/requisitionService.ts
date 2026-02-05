import api from './api';

export interface Requisition {
    id: string;
    title: string;
    description?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    requesterId: string;
    requester: { name: string; email: string };
    approverId?: string;
    approver?: { name: string };
    createdAt: string;
}

export const getRequisitions = async (): Promise<Requisition[]> => {
    const response = await api.get('/requisitions');
    return response.data;
};

export const createRequisition = async (data: { title: string; description?: string }): Promise<Requisition> => {
    const response = await api.post('/requisitions', data);
    return response.data;
};

export const approveRequisition = async (id: string): Promise<Requisition> => {
    const response = await api.patch(`/requisitions/${id}/approve`);
    return response.data;
};

export const rejectRequisition = async (id: string): Promise<Requisition> => {
    const response = await api.patch(`/requisitions/${id}/reject`);
    return response.data;
};
