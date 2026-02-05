import express from 'express';
import { getAssets, getAssetById, createAsset, updateAsset, deleteAsset } from '../controllers/assetController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { Role } from '@prisma/client';

const router = express.Router();

router.use(authenticate);

router.get('/', getAssets);
router.get('/:id', getAssetById);
router.post('/', authorize([Role.ADMIN, Role.MANAGER]), createAsset);
router.put('/:id', authorize([Role.ADMIN, Role.MANAGER]), updateAsset);
router.delete('/:id', authorize([Role.ADMIN]), deleteAsset);

export default router;
