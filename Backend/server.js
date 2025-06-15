import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';



// Konfigurasi Dasar
dotenv.config();
connectDB();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rute API
app.get('/', (req, res) => {
  res.send('API VeloChat sedang berjalan...');
});
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server berjalan pada port http://localhost:${PORT}`);
});


// Socket.IO
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`[BACKEND LOG] Terhubung ke socket.io dengan ID: ${socket.id}`);

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    console.log(`[BACKEND LOG] User ${userData._id} bergabung ke room pribadinya.`);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log(`[BACKEND LOG] User bergabung ke room chat: ${room}`);
  });

  socket.on('new message', (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    if (!chat.users) return console.log('[BACKEND LOG] Error: chat.users tidak terdefinisi');

    console.log(`[BACKEND LOG] Pesan baru diterima untuk chat ${chat._id}: "${newMessageReceived.content}"`);

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      console.log(`[BACKEND LOG] Mengirim pesan ke room user: ${user._id}`);
      socket.in(user._id).emit('message received', newMessageReceived);
    });
  });
   socket.on('new message', (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    if (!chat.users) return console.log('[BACKEND LOG] Error: chat.users tidak terdefinisi');

    console.log(`[BACKEND LOG] Pesan baru diterima untuk chat ${chat._id}: "${newMessageReceived.content}"`);

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      console.log(`[BACKEND LOG] Mengirim pesan ke room user: ${user._id}`);
      socket.in(user._id).emit('message received', newMessageReceived);
    });
  });

  socket.on('disconnect', () => {
    console.log(`[BACKEND LOG] Koneksi socket ${socket.id} terputus.`);
  });
});
