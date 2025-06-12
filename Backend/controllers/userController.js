import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Mendaftarkan pengguna baru
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validasi input
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Mohon isi semua field');
    }

    // 2. Cek apakah pengguna sudah ada
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('Pengguna dengan email ini sudah terdaftar');
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Buat pengguna baru di database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      // 5. Kirim respon sukses beserta data user (tanpa password) dan token
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Data pengguna tidak valid');
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Mengautentikasi / Login pengguna
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Cek apakah pengguna ada di database
    const user = await User.findOne({ email });

    // 2. Jika user ada DAN password cocok
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        token: generateToken(user._id),
      });
    } else {
      res.status(401); // Unauthorized
      throw new Error('Email atau password salah');
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Mencari & mendapatkan semua pengguna (terproteksi)
// @route   GET /api/users?search=...
// @access  Private (butuh token)
const getAllUsers = async (req, res) => {
  try {
    // keyword untuk pencarian, diambil dari query URL (?search=)
    const keyword = req.query.search
      ? {
          $or: [{ name: { $regex: req.query.search, $options: 'i' } }, { email: { $regex: req.query.search, $options: 'i' } }],
        }
      : {};

    // Cari pengguna berdasarkan keyword, tapi kecualikan diri sendiri
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Fungsi untuk membuat JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token akan kadaluwarsa dalam 30 hari
  });
};

// Export controller agar bisa digunakan di file lain
export { registerUser, loginUser, getAllUsers };
