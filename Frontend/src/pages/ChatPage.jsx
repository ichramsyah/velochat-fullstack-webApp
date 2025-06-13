// src/pages/ChatPage.jsx

import React, { useEffect, useState } from 'react';
import useUserStore from '../store/userStore';
import Header from '../components/Header';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
import { io } from 'socket.io-client';

const ENDPOINT = 'http://localhost:5000';

const ChatPage = () => {
  const { userInfo } = useUserStore((state) => state);
  // 1. Deklarasikan socket sebagai state, bukan variabel biasa
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    if (userInfo) {
      // 2. Buat instance socket baru dan simpan ke state
      const newSocket = io(ENDPOINT);
      setSocket(newSocket);

      newSocket.emit('setup', userInfo);
      newSocket.on('connected', () => setSocketConnected(true));
    }

    // Cleanup function akan berjalan saat user logout (userInfo menjadi null)
    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [userInfo]);

  return (
    <div className="flex flex-col w-full h-screen">
      {userInfo && <Header />}
      <div className="flex flex-grow w-full overflow-hidden">
        {/* 3. Teruskan 'socket' dari state ke komponen anak */}
        {userInfo && <MyChats />}
        {userInfo && <ChatBox socket={socket} />}
      </div>
    </div>
  );
};

export default ChatPage;
