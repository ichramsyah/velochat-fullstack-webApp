// src/store/chatStore.js
import { create } from 'zustand';

const useChatStore = create((set) => ({
  selectedChat: null,
  notifications: [],
  chatListVersion: 0,

  setSelectedChat: (chat) =>
    set((state) => ({
      selectedChat: chat,
      notifications: state.notifications.filter((n) => n.chat._id !== chat?._id),
    })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  removeNotificationsForChat: (chatId) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.chat._id !== chatId),
    })),

  triggerChatListRefresh: () => set((state) => ({ chatListVersion: state.chatListVersion + 1 })),
}));

export default useChatStore;
