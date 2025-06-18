import React, { useEffect, useState, useRef, useCallback } from 'react';
import useChatStore from '../store/chatStore';
import useUserStore from '../store/userStore';
import { getMessages, sendMessage as sendMessageAPI } from '../api/messageAPI';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';

const SingleCheckIcon = ({ color = 'currentColor' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={color} className="w-5 h-5 ml-1 flex-shrink-0">
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
  </svg>
);
const DoubleCheckIcon = ({ color = 'currentColor' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={color} className="w-5 h-5 ml-1 flex-shrink-0">
    <path fillRule="evenodd" d="M10.202 4.133a.75.75 0 01.996 1.12l-5.25 4.667a.75.75 0 01-1.002-1.114l5.256-4.673zM8.952 8.383a.75.75 0 01.996 1.12l-5.25 4.667a.75.75 0 01-1.002-1.114l5.256-4.673z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M15.456 4.133a.75.75 0 01.996 1.12l-5.25 4.667a.75.75 0 01-1.002-1.114l5.256-4.673z" clipRule="evenodd" />
  </svg>
);
const getSenderName = (loggedUser, users) => {
  if (!users || users.length < 2) return '';
  return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
};
const formatDateSeparator = (dateString) => {
  const date = new Date(dateString);
  if (isToday(date)) return 'Hari Ini';
  if (isYesterday(date)) return 'Kemarin';
  return format(date, 'd MMMM yyyy');
};

const ChatBox = ({ socket }) => {
  const { selectedChat } = useChatStore((state) => state);
  const { userInfo } = useUserStore((state) => state);
  const { triggerChatListRefresh } = useChatStore((state) => state);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollToBottom, [messages]);

  const refreshMessages = useCallback(async () => {
    if (!selectedChat) return;
    try {
      const data = await getMessages(selectedChat._id, userInfo.token);
      setMessages(data);
    } catch (error) {
      console.error('Gagal refresh pesan:', error);
    }
  }, [selectedChat, userInfo.token]);

  const loadAndReadMessages = useCallback(async () => {
    if (!selectedChat) return;
    setLoading(true);
    try {
      const data = await getMessages(selectedChat._id, userInfo.token);
      setMessages(data);
      if (socket) {
        socket.emit('join chat', selectedChat._id);
        socket.emit('messages read', { chatId: selectedChat._id, userId: userInfo._id });
      }
    } catch (error) {
      console.error('Gagal mengambil pesan:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedChat, userInfo.token, socket]);

  useEffect(() => {
    loadAndReadMessages();
  }, [loadAndReadMessages]);

  useEffect(() => {
    if (!socket) return;

    const typingListener = (room) => {
      if (room === selectedChat?._id) setIsTyping(true);
    };
    const stopTypingListener = (room) => {
      if (room === selectedChat?._id) setIsTyping(false);
    };

    const messageListener = (newMessageReceived) => {
      triggerChatListRefresh();
      if (selectedChat && selectedChat._id === newMessageReceived.chat._id) {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
        socket.emit('messages read', { chatId: selectedChat._id, userId: userInfo._id });
      }
    };

    const messagesUpdatedListener = () => {
      refreshMessages();
    };

    socket.on('typing', typingListener);
    socket.on('stop typing', stopTypingListener);
    socket.on('message received', messageListener);
    socket.on('messages updated', messagesUpdatedListener);

    return () => {
      socket.off('typing', typingListener);
      socket.off('stop typing', stopTypingListener);
      socket.off('message received', messageListener);
      socket.off('messages updated', messagesUpdatedListener);
    };
  }, [socket, selectedChat, refreshMessages, triggerChatListRefresh]);

  const handleSendMessage = async (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && newMessage) {
      e.preventDefault();
      if (socket) socket.emit('stop typing', selectedChat._id);
      const messageContent = newMessage;
      setNewMessage('');
      try {
        const data = await sendMessageAPI({ content: messageContent, chatId: selectedChat._id }, userInfo.token);
        if (socket) socket.emit('new message', data);
        setMessages([...messages, data]);
        triggerChatListRefresh();
      } catch (error) {
        console.error('Gagal mengirim pesan:', error);
      }
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!socket) return;
    socket.emit('start typing', selectedChat._id);
    if (typingTimeout) clearTimeout(typingTimeout);
    const timer = setTimeout(() => {
      socket.emit('stop typing', selectedChat._id);
    }, 3000);
    setTypingTimeout(timer);
  };

  return (
    <div className="flex flex-col w-2/3 bg-gray-50 h-screen">
      {selectedChat ? (
        <>
          <div className="flex items-center w-full p-4 border-b">
            <h3 className="text-lg font-bold">{!selectedChat.isGroupChat ? getSenderName(userInfo, selectedChat.users) : selectedChat.chatName}</h3>
          </div>
          <div className="flex-grow p-4 overflow-y-auto bg-gray-100">
            {loading ? (
              <div className="space-y-4"> {/* ... skeleton ... */} </div>
            ) : (
              <div className="flex flex-col">
                {messages.map((m, index) => {
                  const isMyMessage = m.sender._id === userInfo._id;
                  const otherUser = selectedChat.users.find((u) => u._id !== userInfo._id);
                  const isRead = m.readBy.some((readerId) => readerId === otherUser?._id);
                  const showDateSeparator = index === 0 || !isSameDay(new Date(m.createdAt), new Date(messages[index - 1].createdAt));
                  return (
                    <React.Fragment key={m._id}>
                      {showDateSeparator && <div className="self-center px-3 py-1 my-4 text-sm text-gray-600 bg-gray-200 rounded-full">{formatDateSeparator(m.createdAt)}</div>}
                      <div className={`flex my-1 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-end ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                          <img src={isMyMessage ? userInfo.profilePic : otherUser?.profilePic} alt={isMyMessage ? userInfo.name : otherUser?.name} className="w-8 h-8 rounded-full mx-2 object-cover" />

                          {!isMyMessage && <span className="text-xs text-gray-400 mr-2">{format(new Date(m.createdAt), 'HH:mm')}</span>}

                          <div className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md ${isMyMessage ? 'bg-indigo-500 text-white' : 'bg-white text-gray-800'}`}>{m.content}</div>

                          {isMyMessage && (
                            <div className="flex items-center ml-2">
                              <span className="text-xs text-gray-400">{format(new Date(m.createdAt), 'HH:mm')}</span>
                              {isRead ? <DoubleCheckIcon color="#22C55E" /> : <SingleCheckIcon color="#9CA3AF" />}
                            </div>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                {isTyping && <div className="text-sm text-gray-500 mt-2">Typing...</div>}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          <div className="flex items-center p-4 bg-white border-t">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={handleTyping}
              onKeyDown={handleSendMessage}
              className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button onClick={handleSendMessage} className="px-4 py-2 ml-2 font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700">
              Send
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-center text-gray-500">
            <h3 className="text-xl">Select a chat to start messaging</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
