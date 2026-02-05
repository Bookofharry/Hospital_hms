import cron from 'node-cron';
import prisma from '../utils/prisma';
import { WorkOrderStatus, Priority, Frequency } from '@prisma/client';
import { io } from '../index'; // import socket io for notifications
import { Expo } from 'expo-server-sdk';

const expo = new Expo();

// Helper to push notification (duplicated for now, ideally in utils)
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

export const initCronJobs = () => {
    // Run every minute for testing. For prod: '0 0 * * *' (midnight)
    cron.schedule('* * * * *', async () => {
        console.log('Running PM Generator...');
        try {
            const now = new Date();
            const duePlans = await prisma.preventivePlan.findMany({
                where: {
                    isActive: true,
                    nextDue: {
                        lte: now
                    }
                }
            });

            console.log(`Found ${duePlans.length} due plans.`);

            for (const plan of duePlans) {
                // 1. Create Work Order
                const workOrder = await prisma.workOrder.create({
                    data: {
                        title: `PM: ${plan.name}`,
                        description: plan.description || 'Scheduled Preventive Maintenance',
                        priority: Priority.MEDIUM,
                        status: WorkOrderStatus.PENDING,
                        createdById: plan.assignedToId || 'SYSTEM_ADMIN', // Ideally a dedicated system user
                        assignedToId: plan.assignedToId,
                        assetId: plan.assetId
                    }
                });

                console.log(`Created WO: ${workOrder.id} for Plan: ${plan.name}`);

                // 2. Notify Assignee
                if (plan.assignedToId) {
                    io.to(plan.assignedToId).emit('notification', {
                        type: 'NEW_ASSIGNMENT',
                        message: `New PM Work Order: ${workOrder.title}`,
                        workOrderId: workOrder.id
                    });
                    await sendPushNotification(plan.assignedToId, `New PM Work Order: ${workOrder.title}`, { workOrderId: workOrder.id });
                }

                // 3. Update Next Due
                const nextDue = calculateNextDue(plan.nextDue, plan.frequency);
                await prisma.preventivePlan.update({
                    where: { id: plan.id },
                    data: { nextDue }
                });
            }
        } catch (error) {
            console.error('Error in PM Cron:', error);
        }
    });
};

function calculateNextDue(current: Date, freq: Frequency): Date {
    const next = new Date(current);
    switch (freq) {
        case 'DAILY': next.setDate(next.getDate() + 1); break;
        case 'WEEKLY': next.setDate(next.getDate() + 7); break;
        case 'MONTHLY': next.setMonth(next.getMonth() + 1); break;
        case 'YEARLY': next.setFullYear(next.getFullYear() + 1); break;
    }
    return next;
}
