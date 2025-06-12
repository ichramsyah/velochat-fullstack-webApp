import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors()); // Mengaktifkan Cross-Origin Resource Sharing
app.use(express.json()); // Mem-parse body request sebagai JSON

app.get('/', (req, res) => {
  res.send('API VeloChat sedang berjalan...');
});

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan pada port http://localhost:${PORT}`);
});
