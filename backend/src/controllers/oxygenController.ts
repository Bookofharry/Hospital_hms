import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { CylinderStatus, CylinderAction } from '@prisma/client';

export const getCylinders = async (req: Request, res: Response) => {
    try {
        const cylinders = await prisma.oxygenCylinder.findMany({
            include: { logs: { take: 1, orderBy: { timestamp: 'desc' } } }
        });
        res.json(cylinders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cylinders', error });
    }
};

export const createCylinder = async (req: Request, res: Response) => {
    try {
        const { serialNumber, size, location } = req.body;
        const cylinder = await prisma.oxygenCylinder.create({
            data: { serialNumber, size, location }
        });
        res.status(201).json(cylinder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating cylinder', error });
    }
};

export const logMovement = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { action, location, status } = req.body; // status is optional override

        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Log
            await tx.cylinderLog.create({
                data: {
                    cylinderId: id as string,
                    action: action as CylinderAction,
                    location
                }
            });

            // 2. Update Cylinder
            const updatedCylinder = await tx.oxygenCylinder.update({
                where: { id: id as string },
                data: {
                    location,
                    status: status ? (status as CylinderStatus) : undefined
                }
            });

            return updatedCylinder;
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error logging movement', error });
    }
};
