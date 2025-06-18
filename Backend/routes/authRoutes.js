// backend/routes/authRoutes.js
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Helper untuk membuat token JWT VeloChat
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Rute untuk memulai proses login Google
// Frontend akan diarahkan ke sini
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'], // Data yang kita minta dari Google
  })
);

// Rute Callback, tempat Google me-redirect user kembali
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login/failed' }), (req, res) => {
  // Jika autentikasi berhasil, user ada di req.user
  // Buatkan token JWT VeloChat untuk user tersebut
  const token = generateToken(req.user._id);

  // Redirect kembali ke frontend dengan membawa token
  res.redirect(`http://localhost:5173/login-success?token=${token}`);
});

export default router;
