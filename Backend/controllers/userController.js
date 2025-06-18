// backend/controllers/userController.js

import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from '../config/cloudinary.js';

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Mohon isi semua field');
    }

    const allowedDomain = '@gmail.com';
    if (!email.endsWith(allowedDomain)) {
      res.status(400);
      throw new Error(`Pendaftaran hanya diizinkan untuk email Google ${allowedDomain}`);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('Pengguna dengan email ini sudah terdaftar');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashedPassword });
    if (user) {
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

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Email atau password salah');
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// --- PERBAIKAN PADA getAllUsers ---
// @desc    Mencari & mendapatkan semua pengguna (terproteksi)
// @route   GET /api/users?search=...
// @access  Private (butuh token)
const getAllUsers = async (req, res) => {
  try {
    const searchQuery = req.query.search;

    // Jika tidak ada query pencarian, kembalikan array kosong
    if (!searchQuery || searchQuery.trim() === '') {
      return res.status(200).json([]);
    }

    const users = await User.find({
      email: { $regex: `^${searchQuery}$`, $options: 'i' },
      _id: { $ne: req.user._id }, // Tetap kecualikan diri sendiri
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error di getAllUsers:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
// @desc    Mendapatkan daftar kontak pengguna
// @route   GET /api/users/contacts
// @access  Protected
const getContacts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'contacts',
      select: '_id name email profilePic',
    });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.status(200).json(user.contacts);
  } catch (error) {
    console.error('Error di getContacts:', error);
    res.status(500).json({ message: 'Server Error saat mengambil kontak' });
  }
};

// @desc    Memperbarui profil pengguna
// @route   PUT /api/users/profile
// @access  Protected
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;

      // Jika pengguna mengirim password baru, hash dan update
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();

      // Kirim kembali data yang sudah diupdate beserta token baru
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error('User tidak ditemukan');
    }
  } catch (error) {
    console.error('Error di updateUserProfile:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- FUNGSI BARU DI SINI ---
// @desc    Memperbarui foto profil pengguna
// @route   PUT /api/users/profile/picture
// @access  Protected
const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Tidak ada file yang diunggah.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Unggah file dari buffer memori ke Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'velochat_pfp' }, async (error, result) => {
      if (error) {
        console.error('Cloudinary Error:', error);
        return res.status(500).json({ message: 'Gagal mengunggah gambar.' });
      }

      // Update URL profilePic di database
      user.profilePic = result.secure_url;
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic,
        token: generateToken(updatedUser._id), // Kirim token baru jika diperlukan
      });
    });

    // Kirim buffer file ke stream Cloudinary
    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error('Error di updateProfilePicture:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

export { registerUser, loginUser, getAllUsers, getContacts, getMe, updateUserProfile, updateProfilePicture };
