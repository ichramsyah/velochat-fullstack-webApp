// backend/controllers/friendRequestController.js

import FriendRequest from '../models/friendRequestModel.js';
import User from '../models/userModel.js';
import Chat from '../models/chatModel.js';

// @desc    Mengirim permintaan pertemanan
// @route   POST /api/friend-requests
// @access  Protected
export const sendFriendRequest = async (req, res) => {
  const { toUserId } = req.body;
  const fromUserId = req.user._id;

  if (!toUserId) {
    return res.status(400).json({ message: 'User ID penerima tidak ada' });
  }

  if (toUserId === fromUserId.toString()) {
    return res.status(400).json({ message: 'Tidak bisa menambah diri sendiri' });
  }

  const fromUser = await User.findById(fromUserId);
  const toUser = await User.findById(toUserId);

  if (!fromUser || !toUser) {
    return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
  }

  if (fromUser.contacts && fromUser.contacts.includes(toUserId)) {
    return res.status(400).json({ message: 'Anda sudah berteman dengan pengguna ini' });
  }

  const existingRequest = await FriendRequest.findOne({
    $or: [
      { fromUser: fromUserId, toUser: toUserId },
      { fromUser: toUserId, toUser: fromUserId },
    ],
  });

  if (existingRequest) {
    return res.status(400).json({ message: 'Permintaan pertemanan sudah ada atau sedang tertunda' });
  }

  const newRequest = await FriendRequest.create({
    fromUser: fromUserId,
    toUser: toUserId,
  });

  const io = req.app.get('socketio');
  const populatedRequest = await FriendRequest.findById(newRequest._id).populate('fromUser', 'name profilePic');
  io.to(toUserId).emit('receive_friend_request', populatedRequest);

  res.status(201).json(newRequest);
};

// @desc    Mendapatkan permintaan pertemanan yang masuk
// @route   GET /api/friend-requests/pending
// @access  Protected
export const getPendingRequests = async (req, res) => {
  const pendingRequests = await FriendRequest.find({
    toUser: req.user._id,
    status: 'pending',
  }).populate('fromUser', 'name email profilePic');
  res.status(200).json(pendingRequests);
};

// @desc    Merespon permintaan pertemanan
// @route   PUT /api/friend-requests/:id/respond
// @access  Protected
export const respondToRequest = async (req, res) => {
  const { requestId } = req.params;
  const { action } = req.body;
  const userId = req.user._id;

  const request = await FriendRequest.findById(requestId);

  if (!request) {
    return res.status(404).json({ message: 'Permintaan tidak ditemukan' });
  }

  if (request.toUser.toString() !== userId.toString()) {
    return res.status(401).json({ message: 'Tidak terotorisasi' });
  }

  if (request.status !== 'pending') {
    return res.status(400).json({ message: `Permintaan sudah di-${request.status}` });
  }

  if (action === 'accept') {
    request.status = 'accepted';

    await User.findByIdAndUpdate(userId, { $addToSet: { contacts: request.fromUser } });
    await User.findByIdAndUpdate(request.fromUser, { $addToSet: { contacts: userId } });

    const existingChat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [userId, request.fromUser] },
    });

    if (!existingChat) {
      await Chat.create({
        chatName: 'sender',
        isGroupChat: false,
        users: [userId, request.fromUser],
      });
      console.log('Chat baru dibuat antara', userId, 'dan', request.fromUser);
    }

    const io = req.app.get('socketio');
    const populatedRequest = await request.populate('toUser', 'name profilePic');
    io.to(request.fromUser.toString()).emit('friend_request_accepted', populatedRequest);

    io.to(userId.toString()).emit('contact_list_updated');
    io.to(request.fromUser.toString()).emit('contact_list_updated');
  } else if (action === 'decline') {
    await FriendRequest.findByIdAndDelete(requestId);
    return res.status(200).json({ message: 'Permintaan pertemanan ditolak dan dihapus' });
  } else {
    return res.status(400).json({ message: 'Aksi tidak valid' });
  }

  await request.save();
  res.status(200).json(request);
};
