// src/pages/ChatPage.jsx
import { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import useUserStore from '../store/userStore';
import useChatStore from '../store/chatStore';
import Header from '../components/chat/Header';
import MyChats from '../components/chat/MyChats';
import ChatBox from '../components/chat/ChatBox';
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
  const { isMyChatOpen, setMyChatOpen } = useOutletContext();

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
    <div className="flex h-screen w-full relative">
      {/* Sidebar kiri */}
      {userInfo && <MyChats chats={chats} loading={loadingChats} socket={socket} refreshChats={loadChats} isOpen={isMyChatOpen} setIsOpen={setMyChatOpen} />}

      {/* Konten kanan */}
      <div className="flex flex-col flex-grow bg-[#F8FAFB] overflow-hidden">
        {userInfo && <Header socket={socket} />}
        {userInfo && <ChatBox socket={socket} newMessage={newMessage} onNewMessageSent={loadChats} />}
      </div>
    </div>
  );
};

export default ChatPage;
