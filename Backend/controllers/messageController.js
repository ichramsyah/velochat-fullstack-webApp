import Message from '../models/messageModel.js';
import User from '../models/userModel.js';
import Chat from '../models/chatModel.js';

// @desc    Mengirim sebuah pesan
// @route   POST /api/message
// @access  Protected
const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log('Konten atau ChatId tidak valid!');
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);
    message = await message.populate('sender', 'name profilePic');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name profilePic email',
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Mengambil semua pesan dari sebuah chat
// @route   GET /api/message/:chatId
// @access  Protected
const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate('sender', 'name profilePic email').populate('chat');
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

export { allMessages, sendMessage };
