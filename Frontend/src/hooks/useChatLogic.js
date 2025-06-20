// src/hooks/useChatLogic.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { getMessages, sendMessage as sendMessageAPI } from '../api/messageAPI';
import useChatStore from '../store/chatStore';
import useUserStore from '../store/userStore';

const useChatLogic = (socket) => {
  const { selectedChat, triggerChatListRefresh } = useChatStore();
  const { userInfo } = useUserStore();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const refreshMessages = useCallback(async () => {
    if (!selectedChat || !userInfo?.token) return;
    try {
      const data = await getMessages(selectedChat._id, userInfo.token);
      setMessages(data);
    } catch (error) {
      console.error('Failed to refresh messages:', error);
    }
  }, [selectedChat, userInfo?.token]);

  const loadAndReadMessages = useCallback(async () => {
    if (!selectedChat || !userInfo?.token) {
      setMessages([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getMessages(selectedChat._id, userInfo.token);
      setMessages(data);
      if (socket) {
        socket.emit('join chat', selectedChat._id);
        socket.emit('messages read', { chatId: selectedChat._id, userId: userInfo._id });
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedChat, userInfo?.token, socket, userInfo?._id]);

  useEffect(() => {
    loadAndReadMessages();
  }, [loadAndReadMessages]);

  const handleSendMessage = async (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && newMessage.trim()) {
      e.preventDefault();
      if (socket) socket.emit('stop typing', selectedChat._id);
      const messageContent = newMessage;
      setNewMessage('');
      try {
        const data = await sendMessageAPI({ content: messageContent, chatId: selectedChat._id }, userInfo.token);
        if (socket) socket.emit('new message', data);
        setMessages((prevMessages) => [...prevMessages, data]);
        triggerChatListRefresh();
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!socket || !selectedChat) return;

    socket.emit('start typing', selectedChat._id);

    if (typingTimeout) clearTimeout(typingTimeout);
    const timer = setTimeout(() => {
      socket.emit('stop typing', selectedChat._id);
      setTypingTimeout(null);
    }, 1500);
    setTypingTimeout(timer);
  };

  return {
    messages,
    setMessages,
    loading,
    newMessage,
    setNewMessage,
    isTyping,
    setIsTyping,
    handleSendMessage,
    handleTyping,
    refreshMessages,
    messagesEndRef,
  };
};

export default useChatLogic;
