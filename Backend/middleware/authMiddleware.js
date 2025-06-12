import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Ambil token dari header (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Ambil data pengguna dari DB berdasarkan ID di token (tanpa password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Lanjutkan ke controller berikutnya
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Tidak terotorisasi, token gagal');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Tidak terotorisasi, tidak ada token');
  }
};

export { protect };
