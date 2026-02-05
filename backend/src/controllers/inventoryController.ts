import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { TransactionType } from '@prisma/client';

export const getInventoryItems = async (req: Request, res: Response) => {
    try {
        const items = await prisma.inventoryItem.findMany({
            include: { supplier: true }
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inventory', error });
    }
};

export const createInventoryItem = async (req: Request, res: Response) => {
    try {
        const { name, sku, description, minimumStock, unit, supplierId } = req.body;
        const item = await prisma.inventoryItem.create({
            data: { name, sku, description, minimumStock: Number(minimumStock), unit, supplierId }
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error creating item', error });
    }
};

export const adjustStock = async (req: Request, res: Response) => {
    try {
        const { itemId } = req.params;
        const { quantity, type, notes, workOrderId } = req.body; // quantity should be positive

        const finalQuantity = type === 'OUT' ? -Math.abs(quantity) : Math.abs(quantity);

        const transaction = await prisma.$transaction(async (tx) => {
            // 1. Create Transaction Record
            const trans = await tx.inventoryTransaction.create({
                data: {
                    itemId: itemId as string,
                    quantity: finalQuantity,
                    type: type as TransactionType,
                    notes: notes as string,
                    workOrderId: workOrderId as string
                }
            });

            // 2. Update Item Stock
            const item = await tx.inventoryItem.update({
                where: { id: itemId as string },
                data: {
                    quantity: { increment: finalQuantity }
                }
            });

            return { transaction: trans, item };
        });

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Error adjusting stock', error });
    }
};
