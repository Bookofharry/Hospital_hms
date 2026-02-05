import express from 'express';
import { getAllUsers, createUser, updateUser, deleteUser, savePushToken } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { Role } from '@prisma/client';

const router = express.Router();

// All user management routes require Authentication and ADMIN role
router.use(authenticate);
router.use(authorize([Role.ADMIN]));

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/push-token', savePushToken); // New endpoint

export default router;
