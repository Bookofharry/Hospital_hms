"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWorkOrder = exports.getAllWorkOrders = exports.createWorkOrder = exports.getWorkOrderById = exports.uploadAttachment = exports.addTimeLog = void 0;
const index_1 = require("../index"); // Import socket io instance
const prisma_1 = __importDefault(require("../utils/prisma"));
const client_1 = require("@prisma/client");
const expo_server_sdk_1 = require("expo-server-sdk");
const expo = new expo_server_sdk_1.Expo();
const sendPushNotification = async (userId, message, data = {}) => {
    try {
        const user = await prisma_1.default.user.findUnique({ where: { id: userId }, select: { pushToken: true } });
        if (!user || !user.pushToken || !expo_server_sdk_1.Expo.isExpoPushToken(user.pushToken))
            return;
        await expo.sendPushNotificationsAsync([{
                to: user.pushToken,
                sound: 'default',
                body: message,
                data: data,
            }]);
    }
    catch (error) {
        console.error('Error sending push notification', error);
    }
};
// ... existing imports ...
// Add this new method
const addTimeLog = async (req, res) => {
    try {
        const { id } = req.params;
        const { minutes, description } = req.body;
        // @ts-ignore
        const userId = req.user.userId;
        if (!minutes || minutes <= 0) {
            return res.status(400).json({ message: 'Valid minutes are required' });
        }
        const timeLog = await prisma_1.default.workOrderTimeLog.create({
            data: {
                minutes: parseInt(minutes),
                description,
                workOrderId: id,
                userId: userId
            },
            include: {
                user: { select: { name: true } }
            }
        });
        res.status(201).json(timeLog);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding time log', error });
    }
};
exports.addTimeLog = addTimeLog;
const uploadAttachment = async (req, res) => {
    try {
        const { id } = req.params;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const attachment = await prisma_1.default.attachment.create({
            data: {
                url: `/uploads/${file.filename}`,
                fileType: 'IMAGE',
                fileName: file.originalname,
                workOrderId: id,
            },
        });
        res.status(201).json(attachment);
    }
    catch (error) {
        res.status(500).json({ message: 'Error uploading attachment', error });
    }
};
exports.uploadAttachment = uploadAttachment;
// Update getWorkOrderById to include attachments
const getWorkOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const workOrder = await prisma_1.default.workOrder.findUnique({
            where: { id: id },
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching work order', error });
    }
};
exports.getWorkOrderById = getWorkOrderById;
// ... keep other existing functions ...
const createWorkOrder = async (req, res) => {
    try {
        const { title, description, priority, assetId, assignedToId } = req.body;
        // @ts-ignore
        const userId = req.user.userId;
        const workOrder = await prisma_1.default.workOrder.create({
            data: {
                title,
                description,
                priority,
                status: client_1.WorkOrderStatus.PENDING, // Keep existing status
                createdById: req.user.userId,
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
            index_1.io.to(assignedToId).emit('notification', {
                type: 'NEW_ASSIGNMENT',
                message: `New Work Order: ${workOrder.title}`,
                workOrderId: workOrder.id
            });
            await sendPushNotification(assignedToId, `New Work Order Assigned: ${workOrder.title}`, { workOrderId: workOrder.id });
        }
        res.status(201).json(workOrder);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating work order', error });
    }
};
exports.createWorkOrder = createWorkOrder;
const getAllWorkOrders = async (req, res) => {
    try {
        const { status, priority, assignedToId } = req.query;
        const where = {};
        if (status)
            where.status = status;
        if (priority)
            where.priority = priority;
        if (assignedToId)
            where.assignedToId = assignedToId;
        const workOrders = await prisma_1.default.workOrder.findMany({
            where,
            include: {
                asset: { select: { name: true, location: true } },
                assignedTo: { select: { name: true } },
                createdBy: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(workOrders);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching work orders', error });
    }
};
exports.getAllWorkOrders = getAllWorkOrders;
const updateWorkOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priority, status, assetId, assignedToId } = req.body; // Destructure all possible fields
        const existingWO = await prisma_1.default.workOrder.findUnique({
            where: { id: id },
            select: { assignedToId: true, createdById: true, title: true }
        });
        if (!existingWO) {
            return res.status(404).json({ message: 'Work order not found' });
        }
        const updatedWorkOrder = await prisma_1.default.workOrder.update({
            where: { id },
            data: {
                ...(title && { title: title }),
                ...(description && { description: description }),
                ...(priority && { priority: priority }),
                ...(status && { status: status }),
                ...(assetId && { assetId: assetId }),
                ...(assignedToId && { assignedToId: assignedToId })
            },
            include: {
                assignedTo: true,
                createdBy: true
            }
        });
        // Notify Manager if status changes to COMPLETED
        if (status === 'COMPLETED' && updatedWorkOrder.createdById) {
            index_1.io.to(updatedWorkOrder.createdById).emit('notification', {
                type: 'WORK_ORDER_COMPLETED',
                message: `Work Order Completed: ${updatedWorkOrder.title}`,
                workOrderId: updatedWorkOrder.id
            });
        }
        // Notify Technician if assigned
        if (assignedToId && assignedToId !== existingWO.assignedToId) {
            index_1.io.to(assignedToId).emit('notification', {
                type: 'NEW_ASSIGNMENT',
                message: `You have been assigned to: ${updatedWorkOrder.title}`,
                workOrderId: updatedWorkOrder.id
            });
            await sendPushNotification(assignedToId, `You have been assigned to: ${updatedWorkOrder.title}`, { workOrderId: updatedWorkOrder.id });
        }
        res.json(updatedWorkOrder);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating work order', error });
    }
};
exports.updateWorkOrder = updateWorkOrder;
