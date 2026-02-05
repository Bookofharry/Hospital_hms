"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Create HTTP server
const server = http_1.default.createServer(app);
// Initialize Socket.io
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: '*', // Allow all origins for now (Web & Mobile)
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
    }
});
exports.io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    // Join user-specific room for private notifications
    socket.on('join_room', (userId) => {
        if (userId) {
            socket.join(userId);
            console.log(`User ${userId} joined room ${userId}`);
        }
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static uploads
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
app.use('/api/auth', authRoutes_1.default);
const assetRoutes_1 = __importDefault(require("./routes/assetRoutes"));
app.use('/api/assets', assetRoutes_1.default);
const workOrderRoutes_1 = __importDefault(require("./routes/workOrderRoutes"));
app.use('/api/work-orders', workOrderRoutes_1.default);
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
app.use('/api/users', userRoutes_1.default);
const preventiveRoutes_1 = __importDefault(require("./routes/preventiveRoutes"));
app.use('/api/preventive', preventiveRoutes_1.default);
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
app.use('/api/reports', reportRoutes_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
