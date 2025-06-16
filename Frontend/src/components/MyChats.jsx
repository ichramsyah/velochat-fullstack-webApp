// src/components/MyChats.jsx

import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import useUserStore from '../store/userStore';
import useChatStore from '../store/chatStore';

// Helper function untuk mendapatkan nama lawan bicara di chat 1-on-1
const getSenderName = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

const MyChats = () => {
  const { userInfo } = useUserStore((state) => state);
  const { selectedChat, setSelectedChat } = useChatStore((state) => state);

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      if (!userInfo?.token) return;
      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

const MyChats = () => {
  const { userInfo } = useUserStore((state) => state);
  const { selectedChat, setSelectedChat } = useChatStore((state) => state);

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      if (!userInfo?.token) return;
      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
const MyChats = () => {
  const { userInfo } = useUserStore((state) => state);
  const { selectedChat, setSelectedChat } = useChatStore((state) => state);

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      if (!userInfo?.token) return;
      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        
const MyChats = () => {
  const { userInfo } = useUserStore((state) => state);
  const { selectedChat, setSelectedChat } = useChatStore((state) => state);

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      if (!userInfo?.token) return;
      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await api.get('/api/chat', config);
        setChats(data);
      } catch (error) {
        console.error('Gagal mengambil data chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userInfo]);

  return (
    <div className="flex flex-col w-1/3 p-4 bg-white border-r">
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-xl font-bold">My Chats</h2>
      </div>
      <div className="flex-grow mt-4 overflow-y-auto">
        {loading ? (
          <p className="text-gray-500">Loading chats...</p>
        ) : (
          <div className="flex flex-col space-y-2">
            {chats.map((chat) => (
              <div key={chat._id} onClick={() => setSelectedChat(chat)} className={`p-3 rounded-lg cursor-pointer ${selectedChat?._id === chat._id ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <p className="font-semibold">{!chat.isGroupChat ? getSenderName(userInfo, chat.users) : chat.chatName}</p>
                {chat.latestMessage && (
                  <p className="text-sm truncate">
                    <span className="font-bold">{chat.latestMessage.sender.name}: </span>
                    {chat.latestMessage.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChats;
