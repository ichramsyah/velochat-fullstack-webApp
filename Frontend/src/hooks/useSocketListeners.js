// src/hooks/useSocketListeners.js
import { useEffect } from 'react';
import useChatStore from '../store/chatStore';
import useUserStore from '../store/userStore';

const useSocketListeners = (socket, { setMessages, setIsTyping, refreshMessages }) => {
  const { selectedChat, setSelectedChat, triggerChatListRefresh } = useChatStore();
  const { userInfo, setUserInfo } = useUserStore();

  useEffect(() => {
    if (!socket || !userInfo) return;

    const typingListener = (room) => {
      if (selectedChat && room === selectedChat._id) {
        setIsTyping(true);
      }
    };

    const stopTypingListener = (room) => {
      if (selectedChat && room === selectedChat._id) {
        setIsTyping(false);
      }
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

    const profileUpdatedListener = (updatedUserData) => {
      console.log('[FRONTEND LOG] Profile updated received:', updatedUserData);

      if (userInfo._id === updatedUserData._id) {
        setUserInfo({ ...userInfo, ...updatedUserData });
        console.log('[FRONTEND LOG] User info updated for current user.');
      }

      if (selectedChat && selectedChat.users) {
        const userInCurrentChat = selectedChat.users.find((u) => u._id === updatedUserData._id);
        if (userInCurrentChat) {
          const updatedChatUsers = selectedChat.users.map((u) => (u._id === updatedUserData._id ? { ...u, ...updatedUserData } : u));
          setSelectedChat({ ...selectedChat, users: updatedChatUsers });
          console.log('[FRONTEND LOG] Selected chat users updated.');
        }
      }

      setMessages((prevMessages) => prevMessages.map((msg) => (msg.sender._id === updatedUserData._id ? { ...msg, sender: { ...msg.sender, ...updatedUserData } } : msg)));
      console.log('[FRONTEND LOG] Messages sender info updated.');

      triggerChatListRefresh();
    };

    socket.on('typing', typingListener);
    socket.on('stop typing', stopTypingListener);
    socket.on('message received', messageListener);
    socket.on('messages updated', messagesUpdatedListener);
    socket.on('profile updated', profileUpdatedListener);

    return () => {
      socket.off('typing', typingListener);
      socket.off('stop typing', stopTypingListener);
      socket.off('message received', messageListener);
      socket.off('messages updated', messagesUpdatedListener);
      socket.off('profile updated', profileUpdatedListener);
    };
  }, [socket, selectedChat, userInfo, setMessages, setIsTyping, refreshMessages, triggerChatListRefresh, setUserInfo, setSelectedChat]);
};

export default useSocketListeners;
