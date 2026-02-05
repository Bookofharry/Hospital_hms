import express from 'express';
import { getDashboardStats, getWorkOrderStats, getAssetHealth, getUtilityTrends } from '../controllers/reportController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();
router.use(authenticate);

router.get('/stats', getDashboardStats);
router.get('/work-orders', getWorkOrderStats);
router.get('/assets', getAssetHealth);
router.get('/utilities', getUtilityTrends);

export default router;
