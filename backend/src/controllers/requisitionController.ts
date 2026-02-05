import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { Role, RequisitionStatus } from '@prisma/client';

interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: Role;
    };
}

export const createRequisition = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const requisition = await prisma.requisition.create({
            data: {
                title,
                description,
                requesterId: userId
            },
            include: {
                requester: { select: { name: true, email: true } }
            }
        });

        res.status(201).json(requisition);
    } catch (error) {
        res.status(500).json({ message: 'Error creating requisition', error });
    }
};

export const getRequisitions = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const role = req.user?.role;

        let where = {};
        if (role !== 'ADMIN' && role !== 'MANAGER') {
            where = { requesterId: userId };
        }

        const requisitions = await prisma.requisition.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                requester: { select: { name: true, email: true } },
                approver: { select: { name: true } }
            }
        });

        res.json(requisitions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requisitions', error });
    }
};

export const approveRequisition = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const role = req.user?.role;

        if (role !== 'ADMIN' && role !== 'MANAGER') {
            res.status(403).json({ message: 'Only Admin/Manager can approve' });
            return;
        }

        const requisition = await prisma.requisition.update({
            where: { id: id as string },
            data: {
                status: RequisitionStatus.APPROVED,
                approverId: userId
            }
        });

        res.json(requisition);
    } catch (error) {
        res.status(500).json({ message: 'Error approving requisition', error });
    }
};

export const rejectRequisition = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const role = req.user?.role;

        if (role !== 'ADMIN' && role !== 'MANAGER') {
            res.status(403).json({ message: 'Only Admin/Manager can reject' });
            return;
        }

        const requisition = await prisma.requisition.update({
            where: { id: id as string },
            data: {
                status: RequisitionStatus.REJECTED,
                approverId: userId
            }
        });

        res.json(requisition);
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting requisition', error });
    }
};
