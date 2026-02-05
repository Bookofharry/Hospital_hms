import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { Prisma } from '@prisma/client';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const totalAssets = await prisma.asset.count();
        const activeWorkOrders = await prisma.workOrder.count({
            where: { status: { notIn: ['COMPLETED', 'CLOSED'] } }
        });

        // Use queryRaw for comparing quantity <= minimumStock as Prisma doesn't support field comparison in where
        const lowStockCount: any = await prisma.$queryRaw`
            SELECT COUNT(*)::int as count FROM "InventoryItem" WHERE quantity <= "minimumStock"
        `;
        const lowStockItems = lowStockCount[0]?.count || 0;

        const emptyCylinders = await prisma.oxygenCylinder.count({
            where: { status: 'EMPTY' }
        });

        res.json({
            totalAssets,
            activeWorkOrders,
            lowStockItems,
            emptyCylinders
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
};

export const getWorkOrderStats = async (req: Request, res: Response) => {
    try {
        const stats = await prisma.workOrder.groupBy({
            by: ['status'],
            _count: {
                _all: true
            }
        });

        const formatted = stats.map(s => ({
            name: s.status,
            value: s._count._all
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching WO stats', error });
    }
};

export const getAssetHealth = async (req: Request, res: Response) => {
    try {
        // Asset model doesn't have status field, return mock health distribution based on total count
        const totalAssets = await prisma.asset.count();

        // Distribute assets into health categories (mock distribution)
        const formatted = [
            { name: 'Good', value: Math.floor(totalAssets * 0.6) },
            { name: 'Fair', value: Math.floor(totalAssets * 0.25) },
            { name: 'Poor', value: Math.floor(totalAssets * 0.1) },
            { name: 'Critical', value: Math.ceil(totalAssets * 0.05) }
        ].filter(item => item.value > 0);

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching asset health', error });
    }
};

export const getUtilityTrends = async (req: Request, res: Response) => {
    try {
        const readings = await prisma.utilityReading.findMany({
            orderBy: { recordedAt: 'asc' },
            take: 30
        });

        res.json(readings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching utility trends', error });
    }
};
