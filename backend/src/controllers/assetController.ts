import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getAssets = async (req: Request, res: Response) => {
    try {
        const assets = await prisma.asset.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(assets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assets', error });
    }
};

export const getAssetById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const asset = await prisma.asset.findUnique({
            where: { id },
        });
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }
        res.json(asset);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching asset', error });
    }
};

export const createAsset = async (req: Request, res: Response) => {
    try {
        const { name, model, serialNumber, location, purchaseDate, warrantyExpiry } = req.body;

        const asset = await prisma.asset.create({
            data: {
                name,
                model,
                serialNumber,
                location,
                purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
                warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : null,
            },
        });
        res.status(201).json(asset);
    } catch (error) {
        res.status(500).json({ message: 'Error creating asset', error });
    }
};

export const updateAsset = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const { name, model, serialNumber, location, purchaseDate, warrantyExpiry } = req.body;

        const asset = await prisma.asset.update({
            where: { id },
            data: {
                name,
                model,
                serialNumber,
                location,
                purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
                warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : undefined,
            },
        });
        res.json(asset);
    } catch (error) {
        res.status(500).json({ message: 'Error updating asset', error });
    }
};

export const deleteAsset = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        await prisma.asset.delete({ where: { id } });
        res.json({ message: 'Asset deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting asset', error });
    }
};
