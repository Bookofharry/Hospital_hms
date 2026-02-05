import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getSuppliers = async (req: Request, res: Response) => {
    try {
        const suppliers = await prisma.supplier.findMany();
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching suppliers', error });
    }
};

export const createSupplier = async (req: Request, res: Response) => {
    try {
        const { name, contactEmail, phone, address } = req.body;
        const supplier = await prisma.supplier.create({
            data: { name, contactEmail, phone, address }
        });
        res.status(201).json(supplier);
    } catch (error) {
        res.status(500).json({ message: 'Error creating supplier', error });
    }
};
