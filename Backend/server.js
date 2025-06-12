import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io'; // <-- Import Server dari socket.io
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

// --- Konfigurasi Dasar ---
dotenv.config();
connectDB();
const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Rute API ---
app.get('/', (req, res) => {
  res.send('API VeloChat sedang berjalan...');
});
app.use('/api/users', userRoutes);

// --- Menjalankan Server ---
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server berjalan pada port http://localhost:${PORT}`);
});

// --- Konfigurasi Socket.IO ---
const io = new Server(server, {
  pingTimeout: 60000, // 60 detik sebelum timeout
  cors: {
    origin: 'http://localhost:3000', // Sesuaikan dengan URL frontend Anda nanti
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('🔌 Terhubung ke socket.io');

  // Membuat room personal untuk setiap user yang terhubung
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    console.log(`User ${userData.name} bergabung ke room: ${userData._id}`);
    socket.emit('connected');
  });

  socket.on('disconnect', () => {
    console.log('🔌 Pengguna terputus dari socket.io');
  });
});
