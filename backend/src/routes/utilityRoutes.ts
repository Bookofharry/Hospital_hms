import express from 'express';
import { getReadings, recordReading } from '../controllers/utilityController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();
router.use(authenticate);

router.get('/', getReadings);
router.post('/', recordReading);

export default router;
