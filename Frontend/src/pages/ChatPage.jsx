// src/pages/ChatPage.jsx

import React, { useEffect, useState, useCallback } from 'react';
import useUserStore from '../store/userStore';
import useChatStore from '../store/chatStore';
import Header from '../components/Header';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
import { io } from 'socket.io-client';
import { fetchChats } from '../api/chatAPI';
import toast from 'react-hot-toast';

const ENDPOINT = 'http://localhost:5000';

const ChatPage = () => {
  const { userInfo } = useUserStore((state) => state);
  const { selectedChat, addNotification } = useChatStore((state) => state);

  const [socket, setSocket] = useState(null);
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [newMessage, setNewMessage] = useState(null);

  const loadChats = useCallback(async () => {
    if (!userInfo?.token) return;
    setLoadingChats(true);
    try {
      const data = await fetchChats(userInfo.token);
      setChats(data);
    } catch (error) {
      toast.error('Gagal memuat percakapan.');
    } finally {
      setLoadingChats(false);
    }
  }, [userInfo?.token]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    if (userInfo) {
      const newSocket = io(ENDPOINT);
      setSocket(newSocket);
      newSocket.emit('setup', userInfo);
    }
    return () => {
      socket?.disconnect();
    };
  }, [userInfo]);

  useEffect(() => {
    if (!socket) return;

    const messageListener = (newMessageReceived) => {
      if (!selectedChat || selectedChat._id !== newMessageReceived.chat._id) {
        addNotification(newMessageReceived);
        loadChats();
      } else {
        setNewMessage(newMessageReceived);
      }
    };

    const contactListUpdateListener = () => loadChats();

    socket.on('message received', messageListener);
    socket.on('contact_list_updated', contactListUpdateListener);

    return () => {
      socket.off('message received', messageListener);
      socket.off('contact_list_updated', contactListUpdateListener);
    };
  }, [socket, chats, selectedChat, addNotification, loadChats]);

  return (
    <div className="flex flex-col w-full h-screen">
      {userInfo && <Header socket={socket} />}
      <div className="flex flex-grow w-full overflow-hidden">
        {userInfo && <MyChats chats={chats} loading={loadingChats} />}
        {userInfo && <ChatBox socket={socket} newMessage={newMessage} onNewMessageSent={loadChats} />}
      </div>
    </div>
  );
};

export default ChatPage;
