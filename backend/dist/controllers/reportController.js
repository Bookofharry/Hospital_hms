"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getDashboardStats = async (req, res) => {
    try {
        const totalAssets = await prisma_1.default.asset.count();
        const totalWorkOrders = await prisma_1.default.workOrder.count();
        // Count status distribution
        const statusCounts = await prisma_1.default.workOrder.groupBy({
            by: ['status'],
            _count: {
                status: true,
            },
        });
        // Count priority distribution
        const priorityCounts = await prisma_1.default.workOrder.groupBy({
            by: ['priority'],
            _count: {
                priority: true,
            },
        });
        // Simply map data for frontend charts
        const statusData = statusCounts.map(item => ({
            name: item.status,
            count: item._count.status,
        }));
        const priorityData = priorityCounts.map(item => ({
            name: item.priority,
            count: item._count.priority,
        }));
        res.json({
            totalAssets,
            totalWorkOrders,
            statusData,
            priorityData,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
};
exports.getDashboardStats = getDashboardStats;
