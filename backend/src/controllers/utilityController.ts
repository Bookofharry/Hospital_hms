import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { UtilityType, Role } from '@prisma/client';

// Extend Request type to include user (added by auth middleware)
interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: Role;
    };
}

export const recordReading = async (req: AuthRequest, res: Response) => {
    try {
        const { type, value, unit } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return; // Ensure return to stop execution
        }

        const reading = await prisma.utilityReading.create({
            data: {
                type: type as UtilityType,
                value: Number(value),
                unit,
                recordedById: userId
            }
        });

        res.status(201).json(reading);
    } catch (error) {
        res.status(500).json({ message: 'Error recording reading', error });
    }
};

export const getReadings = async (req: Request, res: Response) => {
    try {
        const readings = await prisma.utilityReading.findMany({
            orderBy: { recordedAt: 'desc' },
            take: 100, // Limit for now
            include: { recordedBy: { select: { name: true } } }
        });
        res.json(readings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching readings', error });
    }
};
