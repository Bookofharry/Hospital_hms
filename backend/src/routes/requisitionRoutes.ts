import express from 'express';
import { createRequisition, getRequisitions, approveRequisition, rejectRequisition } from '../controllers/requisitionController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();
router.use(authenticate);

router.post('/', createRequisition);
router.get('/', getRequisitions);
router.patch('/:id/approve', approveRequisition);
router.patch('/:id/reject', rejectRequisition);

export default router;
