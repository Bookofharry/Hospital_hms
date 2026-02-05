import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { Role } from '@prisma/client';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
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
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// Save Push Token
export const savePushToken = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.userId;
        const { pushToken } = req.body;

        await prisma.user.update({
            where: { id: userId },
            data: { pushToken }
        });

        res.json({ message: 'Push token saved' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving push token' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, departmentId, section } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password || 'Hospital@123', 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || Role.TECHNICIAN,
                departmentId: departmentId || null,
                section: section || null,
                status: 'ACTIVE',
            },
            select: { id: true, name: true, email: true, role: true },
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const { name, email, role, departmentId, section, status } = req.body;

        const user = await prisma.user.update({
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
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

// Simplified delete (can be soft delete in production)
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        // Prevent deleting self
        if (req.user?.userId === id) {
            return res.status(400).json({ message: 'Cannot delete yourself' });
        }

        await prisma.user.delete({ where: { id } });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};
