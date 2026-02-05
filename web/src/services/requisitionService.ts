import { demoStore } from '../data/demoStore';

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
    return demoStore.getRequisitions();
};

export const createRequisition = async (data: { title: string; description?: string }): Promise<Requisition> => {
    const newReq: Requisition = {
        id: `req-${Date.now()}`,
        title: data.title,
        description: data.description,
        status: 'PENDING',
        requesterId: 'u-005',
        requester: { name: 'Grace Njeri', email: 'grace.njeri@hmms.demo' },
        createdAt: new Date().toISOString()
    };
    return demoStore.addRequisition(newReq);
};

export const approveRequisition = async (id: string): Promise<Requisition> => {
    const updated = await demoStore.approveRequisition(id);
    return updated as Requisition;
};

export const rejectRequisition = async (id: string): Promise<Requisition> => {
    const updated = await demoStore.rejectRequisition(id);
    return updated as Requisition;
};
