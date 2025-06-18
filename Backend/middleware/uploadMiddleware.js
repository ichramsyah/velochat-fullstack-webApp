// backend/middleware/uploadMiddleware.js
import multer from 'multer';

// Konfigurasi untuk menyimpan file sementara di memori, bukan di disk server.
// Ini adalah praktik terbaik untuk platform deployment seperti Render/Heroku.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Hanya izinkan file dengan tipe image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('File yang diunggah harus berupa gambar!'), false);
  }
};

// Batasi ukuran file maksimal 5MB
const limits = { fileSize: 5 * 1024 * 1024 };

const upload = multer({ storage, fileFilter, limits });

export default upload;
