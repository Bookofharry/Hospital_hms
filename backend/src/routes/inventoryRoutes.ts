import express from 'express';
import { getInventoryItems, createInventoryItem, adjustStock } from '../controllers/inventoryController';
import { getSuppliers, createSupplier } from '../controllers/supplierController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();
router.use(authenticate);

// Items
router.get('/items', getInventoryItems);
router.post('/items', createInventoryItem);
router.post('/items/:itemId/adjust', adjustStock);

// Suppliers
router.get('/suppliers', getSuppliers);
router.post('/suppliers', createSupplier);

export default router;
