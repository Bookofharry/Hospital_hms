"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreventivePlans = exports.createPreventivePlan = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const createPreventivePlan = async (req, res) => {
    try {
        const { name, description, frequency, assetId, assignedToId } = req.body;
        const nextDue = calculateNextDue(new Date(), frequency);
        const plan = await prisma_1.default.preventivePlan.create({
            data: {
                name,
                description,
                frequency: frequency,
                assetId: assetId || null,
                assignedToId: assignedToId || null,
                nextDue
            }
        });
        res.status(201).json(plan);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating preventive plan', error });
    }
};
exports.createPreventivePlan = createPreventivePlan;
const getPreventivePlans = async (req, res) => {
    try {
        const plans = await prisma_1.default.preventivePlan.findMany({
            include: {
                asset: { select: { name: true } },
                assignedTo: { select: { name: true } }
            }
        });
        res.json(plans);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching plans', error });
    }
};
exports.getPreventivePlans = getPreventivePlans;
// Internal Helper
function calculateNextDue(current, freq) {
    const next = new Date(current);
    switch (freq) {
        case 'DAILY':
            next.setDate(next.getDate() + 1);
            break;
        case 'WEEKLY':
            next.setDate(next.getDate() + 7);
            break;
        case 'MONTHLY':
            next.setMonth(next.getMonth() + 1);
            break;
        case 'YEARLY':
            next.setFullYear(next.getFullYear() + 1);
            break;
    }
    return next;
}
