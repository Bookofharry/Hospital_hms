import express from 'express';
import { createPreventivePlan, getPreventivePlans, triggerGeneration } from '../controllers/preventiveController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticate);

router.get('/', getPreventivePlans);
router.post('/', createPreventivePlan);
router.post('/run', triggerGeneration); // Manual trigger

export default router;
