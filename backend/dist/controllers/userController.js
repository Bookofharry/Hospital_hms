"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.savePushToken = exports.getAllUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const client_1 = require("@prisma/client");
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: { select: { id: true, name: true } },
                section: true,
                status: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};
exports.getAllUsers = getAllUsers;
// Save Push Token
const savePushToken = async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user.userId;
        const { pushToken } = req.body;
        await prisma_1.default.user.update({
            where: { id: userId },
            data: { pushToken }
        });
        res.json({ message: 'Push token saved' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error saving push token' });
    }
};
exports.savePushToken = savePushToken;
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, departmentId, section } = req.body;
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password || 'Hospital@123', 10);
        const user = await prisma_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || client_1.Role.TECHNICIAN,
                departmentId: departmentId || null,
                section: section || null,
                status: 'ACTIVE',
            },
            select: { id: true, name: true, email: true, role: true },
        });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, departmentId, section, status } = req.body;
        const user = await prisma_1.default.user.update({
            where: { id },
            data: {
                name,
                email,
                role,
                departmentId: departmentId || null,
                section,
                status,
            },
            select: { id: true, name: true, email: true, role: true, status: true },
        });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};
exports.updateUser = updateUser;
// Simplified delete (can be soft delete in production)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Prevent deleting self
        if (req.user?.userId === id) {
            return res.status(400).json({ message: 'Cannot delete yourself' });
        }
        await prisma_1.default.user.delete({ where: { id } });
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};
exports.deleteUser = deleteUser;
