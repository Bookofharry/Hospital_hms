import express from 'express';
import { getCylinders, createCylinder, logMovement } from '../controllers/oxygenController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();
router.use(authenticate);

router.get('/', getCylinders);
router.post('/', createCylinder);
router.patch('/:id/move', logMovement);

export default router;
