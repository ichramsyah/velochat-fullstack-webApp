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


 

  socket.on('disconnect', () => {
    console.log(`[BACKEND LOG] Koneksi socket ${socket.id} terputus.`);
  });
});
