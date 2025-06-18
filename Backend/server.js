import './loadEnv.js';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import friendRequestRoutes from './routes/friendRequestRoutes.js';
import Message from './models/messageModel.js';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routes/authRoutes.js';
import './config/passport-setup.js';

connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API VeloChat sedang berjalan...');
});

app.use(
  session({
    secret: 'keyword cat', // Ganti dengan secret acak yang lebih baik
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/friend-requests', friendRequestRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server berjalan pada port http://localhost:${PORT}`);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT'],
  },
});

app.set('socketio', io);

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

  socket.on('start typing', (room) => {
    socket.in(room).emit('typing', room);
  });
  socket.on('stop typing', (room) => {
    socket.in(room).emit('stop typing', room);
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

  socket.on('messages read', async ({ chatId, userId }) => {
    try {
      await Message.updateMany({ chat: chatId, readBy: { $ne: userId } }, { $addToSet: { readBy: userId } });

      socket.in(chatId).emit('messages updated', { chatId });
    } catch (error) {
      console.error('Gagal mengupdate status pesan terbaca:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[BACKEND LOG] Koneksi socket ${socket.id} terputus.`);
  });
});
