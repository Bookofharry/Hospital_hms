"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAsset = exports.updateAsset = exports.createAsset = exports.getAssetById = exports.getAssets = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getAssets = async (req, res) => {
    try {
        const assets = await prisma_1.default.asset.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(assets);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching assets', error });
    }
};
exports.getAssets = getAssets;
const getAssetById = async (req, res) => {
    try {
        const { id } = req.params;
        const asset = await prisma_1.default.asset.findUnique({
            where: { id },
        });
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }
        res.json(asset);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching asset', error });
    }
};
exports.getAssetById = getAssetById;
const createAsset = async (req, res) => {
    try {
        const { name, model, serialNumber, location, purchaseDate, warrantyExpiry } = req.body;
        const asset = await prisma_1.default.asset.create({
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating asset', error });
    }
};
exports.createAsset = createAsset;
const updateAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, model, serialNumber, location, purchaseDate, warrantyExpiry } = req.body;
        const asset = await prisma_1.default.asset.update({
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating asset', error });
    }
};
exports.updateAsset = updateAsset;
const deleteAsset = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.asset.delete({ where: { id } });
        res.json({ message: 'Asset deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting asset', error });
    }
};
exports.deleteAsset = deleteAsset;
