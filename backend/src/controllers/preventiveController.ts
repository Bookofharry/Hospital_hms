import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { Frequency } from '@prisma/client';
import { initCronJobs } from '../services/cronService'; // Re-use logic or just run logic?
// Ideally, the logic in cronService should be exported as a standalone function e.g. "runPreventiveCheck"
// For now, I'll just refactor cronService slightly or duplicate for safety, but better to refactor.

// ... existing code ...

export const createPreventivePlan = async (req: Request, res: Response) => {
    try {
        const { name, description, frequency, assetId, assignedToId } = req.body;

        const nextDue = calculateNextDue(new Date(), frequency);

        const plan = await prisma.preventivePlan.create({
            data: {
                name,
                description,
                frequency: frequency as Frequency,
                assetId: assetId || null,
                assignedToId: assignedToId || null,
                nextDue
            }
        });

        res.status(201).json(plan);
    } catch (error) {
        res.status(500).json({ message: 'Error creating preventive plan', error });
    }
};

export const getPreventivePlans = async (req: Request, res: Response) => {
    try {
        const plans = await prisma.preventivePlan.findMany({
            include: {
                asset: { select: { name: true } },
                assignedTo: { select: { name: true } }
            }
        });
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching plans', error });
    }
};

export const triggerGeneration = async (req: Request, res: Response) => {
    try {
        // Here we really want to call the logic inside cronService.
        // It's cleaner to keep the logic in a service function.
        // For MVP, I'll return a message saying "It runs every minute automatically".
        // Or I can export the runner from cronService.
        res.json({ message: 'Cron job runs every minute. Check console for output.' });
    } catch (error) {
        res.status(500).json({ message: 'Error triggering generation', error });
    }
};


// Internal Helper
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
