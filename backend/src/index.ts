import express from 'express';
import cors from 'cors';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
export const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins for now (Web & Mobile)
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join user-specific room for private notifications
    socket.on('join_room', (userId) => {
        if (userId) {
            socket.join(userId);
            console.log(`User ${userId} joined room ${userId}`);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.use(cors());
app.use(express.json());

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

import authRoutes from './routes/authRoutes';
app.use('/api/auth', authRoutes);

import assetRoutes from './routes/assetRoutes';
app.use('/api/assets', assetRoutes);

import workOrderRoutes from './routes/workOrderRoutes';
app.use('/api/work-orders', workOrderRoutes);

import userRoutes from './routes/userRoutes';
app.use('/api/users', userRoutes);

import preventiveRoutes from './routes/preventiveRoutes';
app.use('/api/preventive', preventiveRoutes);

import reportRoutes from './routes/reportRoutes';
app.use('/api/reports', reportRoutes);

import inventoryRoutes from './routes/inventoryRoutes';
app.use('/api/inventory', inventoryRoutes);

import oxygenRoutes from './routes/oxygenRoutes';
app.use('/api/oxygen', oxygenRoutes);

import utilityRoutes from './routes/utilityRoutes';
app.use('/api/utilities', utilityRoutes);

import requisitionRoutes from './routes/requisitionRoutes';
app.use('/api/requisitions', requisitionRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

import { initCronJobs } from './services/cronService';

initCronJobs();

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
