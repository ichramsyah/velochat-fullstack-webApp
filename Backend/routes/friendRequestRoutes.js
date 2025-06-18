// backend/routes/friendRequestRoutes.js

import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { sendFriendRequest, getPendingRequests, respondToRequest } from '../controllers/friendRequestController.js';

const router = express.Router();

router.route('/').post(protect, sendFriendRequest);
router.route('/pending').get(protect, getPendingRequests);
router.route('/:requestId/respond').put(protect, respondToRequest);

export default router;
