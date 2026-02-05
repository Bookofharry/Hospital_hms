import express from 'express';
import { createWorkOrder, getAllWorkOrders, getWorkOrderById, updateWorkOrder } from '../controllers/workOrderController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticate);

router.post('/', createWorkOrder);
router.get('/', getAllWorkOrders);
router.get('/:id', getWorkOrderById);
router.patch('/:id', updateWorkOrder);

import { upload } from '../middleware/uploadMiddleware';
import { uploadAttachment, addTimeLog } from '../controllers/workOrderController';

router.post('/:id/attachments', upload.single('file'), uploadAttachment);
router.post('/:id/time-logs', addTimeLog);

export default router;
