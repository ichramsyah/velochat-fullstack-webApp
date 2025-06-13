import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

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
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// --- Menjalankan Server ---
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server berjalan pada port http://localhost:${PORT}`);
});

// --- Konfigurasi Socket.IO ---
const io = new Server(server, {
  pingTimeout: 60000, // 60 detik sebelum timeout
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('🔌 Terhubung ke socket.io');

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    console.log(`User ${userData.name} bergabung ke room: ${userData._id}`);
    socket.emit('connected');
  });

  // Listener untuk bergabung ke sebuah room chat
  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('user bergabung ke room: ' + room);
  });

  // Listener untuk pesan baru
  socket.on('new message', (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) return console.log('chat.users tidak terdefinisi');

    chat.users.forEach((user) => {
      // Jangan kirim notifikasi ke diri sendiri
      if (user._id == newMessageReceived.sender.id) return;

      socket.in(user._id).emmit('message received', newMessageReceived);
    });
  });

  socket.on('disconnect', () => {
    console.log('🔌 Pengguna terputus dari socket.io');
  });
});
