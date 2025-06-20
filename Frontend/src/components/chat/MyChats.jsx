// src/components/MyChats.jsx
import React, { useState, useEffect } from 'react';
import useUserStore from '../../store/userStore';
import useChatStore from '../../store/chatStore';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SearchModal from '../ui/SearchModal';
import AddContactButton from '../common/AddContactButton';
import { getSenderName, getOtherUser } from '../../utils/chatUtils';
import { format } from 'date-fns';
import { FaTimes } from 'react-icons/fa';

const MyChats = ({ chats, loading, socket, refreshChats, isOpen, setIsOpen }) => {
  const { userInfo } = useUserStore((state) => state);
  const { selectedChat, setSelectedChat, notifications } = useChatStore((state) => state);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredChats, setFilteredChats] = useState(chats);

  const defaultGroupPic = 'https://res.cloudinary.com/dvf402g7e/image/upload/v1720894031/group-chat-default.webp';
  const defaultProfilePic = 'https://res.cloudinary.com/dvf402g7e/image/upload/v1720894031/pfp-default.webp';

  useEffect(() => {
    if (!socket) return;
    const handleMessageReceived = () => {
      refreshChats();
    };
    socket.on('message received', handleMessageReceived);
    socket.on('contact_list_updated', handleMessageReceived);
    return () => {
      socket.off('message received', handleMessageReceived);
      socket.off('contact_list_updated', handleMessageReceived);
    };
  }, [socket, refreshChats]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!searchTerm.trim()) {
        setFilteredChats(chats);
      } else {
        const lower = searchTerm.toLowerCase();
        setFilteredChats(
          chats.filter((chat) => {
            const name = !chat.isGroupChat ? getSenderName(userInfo, chat.users) : chat.chatName;
            return name.toLowerCase().includes(lower);
          })
        );
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, chats, userInfo]);

  return (
    <>
      <div
        className={`flex flex-col bg-[#F8FAFB] border-r border-[#D6D8D9] transition-all duration-300 z-50
        md:relative md:w-1/3
        ${isOpen ? 'fixed top-0 left-0 w-full h-full' : 'hidden'}
        md:flex`}
      >
        {/* Tombol X untuk menutup di layar kecil */}
        <div className="flex items-center justify-between mt-2 px-5 md:hidden">
          <h2 className="text-2xl text-[#20195D] font-bold">Messages</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Judul dan Search Input */}
        <div className="px-5 hidden md:block">
          <h2 className="text-2xl text-[#20195D] mt-3 font-bold pb-4">Messages</h2>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Cari kontak"
              className="w-full py-1 pl-8 rounded-lg bg-gray-200 border-2 border-transparent focus:outline-none focus:bg-transparent focus:border-[#6363FC] text-[#20195D] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search left-3 absolute text-gray-400"></i>
          </div>
        </div>

        {/* Daftar Chat */}
        <div className="flex-grow mt-4 overflow-y-auto px-5">
          {loading ? (
            <div className="space-y-1">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-[#F8FAFB] rounded-lg shadow-sm">
                  <Skeleton circle width={35} height={35} />
                  <div className="flex flex-col flex-grow">
                    <Skeleton width="60%" height={12} />
                    <Skeleton width="80%" height={10} />
                  </div>
                  <Skeleton width={30} height={10} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex space-y-1 flex-col">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => {
                  const chatNotifications = notifications.filter((n) => n.chat._id === chat._id);
                  const chatProfilePic = !chat.isGroupChat ? getOtherUser(userInfo, chat.users)?.profilePic || defaultProfilePic : chat.groupChatPicture || defaultGroupPic;

                  return (
                    <div
                      key={chat._id}
                      onClick={() => {
                        setSelectedChat(chat);
                        setIsOpen(false);
                      }}
                      className={`flex items-center justify-between transition-all p-3 pb-4 rounded-lg cursor-pointer ${
                        selectedChat?._id === chat._id ? 'bg-gray-200 border-b border-transparent text-[#20195D]' : 'bg-[#F8FAFB] hover:bg-gray-200 border-b border-[#D6D8D9]'
                      }`}
                    >
                      <img src={chatProfilePic} alt="Chat Profile" className="w-10 h-10 rounded-full object-cover mr-3" />
                      <div className="flex-grow min-w-0">
                        <p className="font-semibold truncate">{!chat.isGroupChat ? getSenderName(userInfo, chat.users) : chat.chatName}</p>
                        {chat.latestMessage ? (
                          <p className={`text-sm truncate ${chatNotifications.length > 0 ? 'font-bold' : 'text-[#20195D]'}`}>
                            <span className="font-normal">{chat.latestMessage.sender.name}: </span>
                            {chat.latestMessage.content}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500 italic">Belum ada pesan.</p>
                        )}
                      </div>
                      <div className="flex flex-col items-center justify-center ml-2">
                        {chat.latestMessage && <span className="text-[12px] text-[#20195D]">{format(new Date(chat.latestMessage.createdAt), 'HH.mm')}</span>}
                        {chatNotifications.length > 0 && (
                          <span className="mt-1 w-5 h-5 text-sm font-medium text-white bg-[#6363FC] rounded-full flex items-center justify-center">
                            <p className="mb-1">{chatNotifications.length}</p>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center mt-4">{searchTerm ? 'Tidak ada kontak yang cocok.' : 'Mulai percakapan dengan mencari teman.'}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end mb-3 px-5">
          <AddContactButton onClick={() => setIsSearchModalOpen(true)} />
        </div>
      </div>

      {isSearchModalOpen && <SearchModal onClose={() => setIsSearchModalOpen(false)} />}
    </>
  );
};

export default MyChats;
