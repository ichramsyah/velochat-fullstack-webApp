import express from 'express';
import { registerUser, loginUser, getAllUsers, getContacts, getMe, updateUserProfile, updateProfilePicture } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', protect, getAllUsers);
router.get('/contacts', protect, getContacts);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateUserProfile);
router.put('/profile/picture', protect, upload.single('profilePicFile'), updateProfilePicture);

export default router;
