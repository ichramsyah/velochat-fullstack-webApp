// frontend/src/components/ChatBox.jsx

import React, { useEffect, useState, useRef } from 'react';
import useChatStore from '../store/chatStore';
import useUserStore from '../store/userStore';
import api from '../api/axiosConfig';

const getSenderName = (loggedUser, users) => {
  if (!users || users.length < 2) return '';
  return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
};

const ChatBox = ({ socket }) => {
  const { selectedChat } = useChatStore((state) => state);
  const { userInfo } = useUserStore((state) => state);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {


    const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    setLoading(true);const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    setLoading(true);
    const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    setLoading(true);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    setLoading(true);

    const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    setLoading(true);
  };

  useEffect(scrollToBottom, [messages]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await api.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      if (socket) {
        socket.emit('join chat', selectedChat._id);
      }
    } catch (error) {
      console.error('Gagal mengambil pesan:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && newMessage) {
      e.preventDefault();
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const messageContent = newMessage;
        setNewMessage('');
        const { data } = await api.post(
          '/api/message',
          {
            content: messageContent,
            chatId: selectedChat._id,
          },
          config
        );

        if (socket) {
          socket.emit('new message', data);
        }
        setMessages([...messages, data]);
      } catch (error) {
        console.error('Gagal mengirim pesan:', error);
      }
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  // useEffect untuk mendengarkan pesan masuk
  useEffect(() => {
    if (!socket) {
      console.log('[FRONTEND LOG] Socket belum siap.');
      return;
    }

    console.log(`[FRONTEND LOG] Menyiapkan listener 'message received' untuk chat: ${selectedChat?._id}`);

    const messageListener = (newMessageReceived) => {
      console.log('[FRONTEND LOG] EVENT "message received" TERDETEKSI!', newMessageReceived);

      if (!selectedChat || selectedChat._id !== newMessageReceived.chat._id) {
        console.log('[FRONTEND LOG] Pesan masuk bukan untuk chat yang sedang dibuka.');
      } else {
        console.log('[FRONTEND LOG] Pesan sesuai dengan chat yang dibuka. Memperbarui state...');
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    };

    socket.on('message received', messageListener);

    // Cleanup listener
    return () => {
      console.log(`[FRONTEND LOG] Membersihkan listener 'message received' untuk chat: ${selectedChat?._id}`);
      socket.off('message received', messageListener);
    };
  }, [socket, selectedChat, messages]);

  return (
    <div className="flex flex-col w-2/3 bg-gray-50 h-screen">
      {selectedChat ? (
        <>
          <div className="flex items-center w-full p-4 border-b">
            <h3 className="text-lg font-bold">{!selectedChat.isGroupChat ? getSenderName(userInfo, selectedChat.users) : selectedChat.chatName}</h3>
          </div>
          <div className="flex-grow p-4 overflow-y-auto bg-gray-100">
            {loading ? (
              <p>Loading messages...</p>
            ) : (
              <div className="flex flex-col">
                {messages.map((m) => (
                  <div key={m._id} className={`flex ${m.sender._id === userInfo._id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 my-1 rounded-lg lg:max-w-md ${m.sender._id === userInfo._id ? 'bg-indigo-500 text-white' : 'bg-white text-gray-800'}`}>{m.content}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          <div className="flex items-center p-4 bg-white border-t">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={sendMessage}
              className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button onClick={sendMessage} className="px-4 py-2 ml-2 font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700">
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
