"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workOrderController_1 = require("../controllers/workOrderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticate);
router.post('/', workOrderController_1.createWorkOrder);
router.get('/', workOrderController_1.getAllWorkOrders);
router.get('/:id', workOrderController_1.getWorkOrderById);
router.patch('/:id', workOrderController_1.updateWorkOrder);
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const workOrderController_2 = require("../controllers/workOrderController");
router.post('/:id/attachments', uploadMiddleware_1.upload.single('file'), workOrderController_2.uploadAttachment);
router.post('/:id/time-logs', workOrderController_2.addTimeLog);
exports.default = router;
