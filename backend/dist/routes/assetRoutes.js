"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assetController_1 = require("../controllers/assetController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticate);
router.get('/', assetController_1.getAssets);
router.get('/:id', assetController_1.getAssetById);
router.post('/', (0, authMiddleware_1.authorize)([client_1.Role.ADMIN, client_1.Role.MANAGER]), assetController_1.createAsset);
router.put('/:id', (0, authMiddleware_1.authorize)([client_1.Role.ADMIN, client_1.Role.MANAGER]), assetController_1.updateAsset);
router.delete('/:id', (0, authMiddleware_1.authorize)([client_1.Role.ADMIN]), assetController_1.deleteAsset);
exports.default = router;
