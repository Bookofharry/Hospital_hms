"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// All user management routes require Authentication and ADMIN role
router.use(authMiddleware_1.authenticate);
router.use((0, authMiddleware_1.authorize)([client_1.Role.ADMIN]));
router.get('/', userController_1.getAllUsers);
router.post('/', userController_1.createUser);
router.put('/:id', userController_1.updateUser);
router.delete('/:id', userController_1.deleteUser);
router.patch('/push-token', userController_1.savePushToken); // New endpoint
exports.default = router;
