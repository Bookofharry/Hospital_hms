import { Request, Response } from 'express';
import { io } from '../index'; // Import socket io instance
import prisma from '../utils/prisma';
import { WorkOrderStatus, Priority } from '@prisma/client';
import { Expo } from 'expo-server-sdk';

const expo = new Expo();

const sendPushNotification = async (userId: string, message: string, data: any = {}) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { pushToken: true } });
        if (!user || !user.pushToken || !Expo.isExpoPushToken(user.pushToken)) return;

        await expo.sendPushNotificationsAsync([{
            to: user.pushToken,
            sound: 'default',
            body: message,
            data: data,
        }]);
    } catch (error) {
        console.error('Error sending push notification', error);
    }
};

// ... existing imports ...

// Add this new method
export const addTimeLog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { minutes, description } = req.body;
        // @ts-ignore
        const userId = req.user.userId;

        if (!minutes || minutes <= 0) {
            return res.status(400).json({ message: 'Valid minutes are required' });
        }

        const timeLog = await prisma.workOrderTimeLog.create({
            data: {
                minutes: parseInt(minutes),
                description,
                workOrderId: id as string,
                userId: userId
            },
            include: {
                user: { select: { name: true } }
            }
        });

        res.status(201).json(timeLog);
    } catch (error) {
        res.status(500).json({ message: 'Error adding time log', error });
    }
};

export const uploadAttachment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const attachment = await prisma.attachment.create({
            data: {
                url: `/uploads/${file.filename}`,
                fileType: 'IMAGE',
                fileName: file.originalname,
                workOrderId: id as string,
            },
        });

        res.status(201).json(attachment);
    } catch (error) {
        res.status(500).json({ message: 'Error uploading attachment', error });
    }
};

// Update getWorkOrderById to include attachments
export const getWorkOrderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const workOrder = await prisma.workOrder.findUnique({
            where: { id: id as string },
            include: {
                asset: { select: { id: true, name: true, location: true } },
                assignedTo: { select: { id: true, name: true } },
                createdBy: { select: { id: true, name: true } },
                attachments: true, // Include attachments
                timeLogs: {
                    include: { user: { select: { name: true } } },
                    orderBy: { createdAt: 'desc' }
                }
            },
        });

        if (!workOrder) {
            return res.status(404).json({ message: 'Work order not found' });
        }

        res.json(workOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching work order', error });
    }
};

// ... keep other existing functions ...
export const createWorkOrder = async (req: Request, res: Response) => {
    try {
        const { title, description, priority, assetId, assignedToId } = req.body;
        // @ts-ignore
        const userId = req.user.userId;

        const workOrder = await prisma.workOrder.create({
            data: {
                title,
                description,
                priority,
                status: WorkOrderStatus.PENDING, // Keep existing status
                createdById: req.user!.userId,
                assetId: assetId || null,
                assignedToId: assignedToId || null, // Add assignedToId
            },
            include: {
                assignedTo: true,
                asset: true,
                createdBy: true
            }
        });

        // Notify the assigned technician
        if (assignedToId) {
            io.to(assignedToId).emit('notification', {
                type: 'NEW_ASSIGNMENT',
                message: `New Work Order: ${workOrder.title}`,
                workOrderId: workOrder.id
            });
            await sendPushNotification(assignedToId, `New Work Order Assigned: ${workOrder.title}`, { workOrderId: workOrder.id });
        }

        res.status(201).json(workOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating work order', error });
    }
};

export const getAllWorkOrders = async (req: Request, res: Response) => {
    try {
        const { status, priority, assignedToId } = req.query;

        const where: any = {};
        if (status) where.status = status;
        if (priority) where.priority = priority;
        if (assignedToId) where.assignedToId = assignedToId;

        const workOrders = await prisma.workOrder.findMany({
            where,
            include: {
                asset: { select: { name: true, location: true } },
                assignedTo: { select: { name: true } },
                createdBy: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(workOrders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching work orders', error });
    }
};

export const updateWorkOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, priority, status, assetId, assignedToId } = req.body; // Destructure all possible fields

        const existingWO = await prisma.workOrder.findUnique({
            where: { id: id as string },
            select: { assignedToId: true, createdById: true, title: true }
        });

        if (!existingWO) {
            return res.status(404).json({ message: 'Work order not found' });
        }

        const updatedWorkOrder = await prisma.workOrder.update({
            where: { id: id as string },
            data: {
                ...(title && { title: title as string }),
                ...(description && { description: description as string }),
                ...(priority && { priority: priority as Priority }),
                ...(status && { status: status as WorkOrderStatus }),
                ...(assetId && { assetId: assetId as string }),
                ...(assignedToId && { assignedToId: assignedToId as string })
            },
            include: {
                assignedTo: true,
                createdBy: true
            }
        });

        // Notify Manager if status changes to COMPLETED
        if (status === 'COMPLETED' && updatedWorkOrder.createdById) {
            io.to(updatedWorkOrder.createdById).emit('notification', {
                type: 'WORK_ORDER_COMPLETED',
                message: `Work Order Completed: ${updatedWorkOrder.title}`,
                workOrderId: updatedWorkOrder.id
            });
        }

        // Notify Technician if assigned
        if (assignedToId && assignedToId !== existingWO.assignedToId) {
            io.to(assignedToId).emit('notification', {
                type: 'NEW_ASSIGNMENT',
                message: `You have been assigned to: ${updatedWorkOrder.title}`,
                workOrderId: updatedWorkOrder.id
            });
            await sendPushNotification(assignedToId, `You have been assigned to: ${updatedWorkOrder.title}`, { workOrderId: updatedWorkOrder.id });
        }

        res.json(updatedWorkOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error updating work order', error });
    }
};
