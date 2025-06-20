// src/components/ChatBox.js
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';
import { FaCheckDouble } from 'react-icons/fa';
import { IoPaperPlaneOutline } from 'react-icons/io5';
import useChatStore from '../../store/chatStore';
import useUserStore from '../../store/userStore';
import useChatLogic from '../../hooks/useChatLogic';
import useSocketListeners from '../../hooks/useSocketListeners';

const getOtherUser = (loggedUser, users) => {
  if (!users || users.length < 2) return null;
  return users.find((user) => user._id !== loggedUser?._id);
};

const formatDateSeparator = (dateString) => {
  const date = new Date(dateString);
  if (isToday(date)) return 'Hari Ini';
  if (isYesterday(date)) return 'Kemarin';
  return format(date, 'd MMMM yyyy');
};

const ChatBox = ({ socket }) => {
  const { selectedChat } = useChatStore();
  const { userInfo } = useUserStore();
  const { messages, setMessages, loading, newMessage, setNewMessage, isTyping, setIsTyping, handleSendMessage, handleTyping, refreshMessages, messagesEndRef } = useChatLogic(socket);

  useSocketListeners(socket, { setMessages, setIsTyping, refreshMessages });

  let headerProfilePic = '';
  let headerName = '';

  if (selectedChat && userInfo) {
    if (!selectedChat.isGroupChat) {
      const otherUserInHeader = getOtherUser(userInfo, selectedChat.users);
      headerProfilePic = otherUserInHeader?.profilePic || 'https://res.cloudinary.com/dvf402g7e/image/upload/v1720894031/pfp-default.webp';
      headerName = otherUserInHeader?.name || 'Unknown User';
    } else {
      headerProfilePic = selectedChat.groupChatPicture || 'https://res.cloudinary.com/dvf402g7e/image/upload/v1720894031/group-chat-default.webp';
      headerName = selectedChat.chatName;
    }
  } else {
    headerProfilePic = 'https://res.cloudinary.com/dvf402g7e/image/upload/v1720894031/pfp-default.webp';
    headerName = 'Pilih Obrolan';
  }

  return (
    <div className="flex flex-col mx-6 mb-2 flex-grow bg-white rounded-3xl h-full">
      {selectedChat ? (
        <>
          <div className="flex items-center w-full border-b border-gray-400 px-6 py-4">
            <img src={headerProfilePic} className="w-11 h-11 rounded-full object-cover" alt={headerName} />
            <div className="block ml-3">
              <h3 className="text-lg font-bold text-[#20195D]">{headerName}</h3>
              {isTyping && <div className="text-sm text-gray-500">Typing...</div>}
            </div>
          </div>

          <div className="flex-grow overflow-y-auto px-4 py-2 max-h-[calc(100vh-220px)]">
            {loading ? (
              <div className="space-y-6">
                {[...Array(4)].map((_, index) => {
                  const isMine = index % 2 === 1;
                  return (
                    <div key={index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-start ${isMine ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}>
                        {/* Avatar */}
                        <div className="w-8 h-8 mx-2">
                          <Skeleton circle width={32} height={32} />
                        </div>

                        {/* Konten */}
                        <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} gap-1`}>
                          {/* Nama + waktu */}
                          <div className="flex items-center gap-2">
                            <Skeleton width={70} height={10} />
                            <Skeleton width={40} height={10} />
                          </div>
                          {/* Gelembung chat */}
                          <div className={`rounded-xl ${isMine ? 'rounded-tr-none bg-[#6363FC]' : 'rounded-tl-none bg-[#F2F3F7]'} px-4 py-3`}>
                            <Skeleton highlightColor="#f5f5f5" width={180} height={12} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col">
                {messages.map((m, index) => {
                  const isMyMessage = m.sender._id === userInfo._id;
                  const messageRecipient = selectedChat.users.find((u) => u._id !== m.sender._id);
                  const isRead = m.readBy.some((readerId) => readerId === messageRecipient?._id);

                  const showDateSeparator = index === 0 || !isSameDay(new Date(m.createdAt), new Date(messages[index - 1]?.createdAt));
                  return (
                    <React.Fragment key={m._id}>
                      {showDateSeparator && <div className="self-center px-3 py-1 my-2 text-sm text-[#6B678B] bg-[#F2F3F7] rounded-sm">{formatDateSeparator(m.createdAt)}</div>}
                      <div className={`flex my-2 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-start ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                          {/* Avatar */}
                          <img src={m.sender.profilePic} alt={m.sender.name} className="w-8 h-8 rounded-full mx-2 object-cover" />

                          {/* Konten Pesan dan Info Pengirim */}
                          <div className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}>
                            {/* Nama Pengirim dan Waktu (di baris yang sama, dengan urutan berbeda) */}
                            <div className="flex items-center">
                              {!isMyMessage ? (
                                <>
                                  <span className="text-sm font-medium text-gray-700">{m.sender.name}</span>
                                  <span className="text-xs text-gray-400 ml-3">{format(new Date(m.createdAt), 'h:mm a')}</span>
                                </>
                              ) : (
                                <>
                                  <span className="text-xs text-gray-400 mr-3"> {format(new Date(m.createdAt), 'h:mm a')}</span>
                                  <span className="text-sm font-semibold text-gray-700">{m.sender.name}</span>
                                </>
                              )}
                            </div>

                            <div className="flex items-center gap-[0.4rem]">
                              {/* Status Baca (hanya untuk pesan saya) - di bawah bubble */}
                              {isMyMessage && <div className="flex items-center mt-7">{isRead ? <FaCheckDouble color="#22C55E" size="0.8rem" /> : <FaCheckDouble color="#9CA3AF" size="0.8rem" />}</div>}
                              {/* Gelembung Pesan */}
                              <div className={`px-4 py-2 mt-1 max-w-xs rounded-xl pb-3 lg:max-w-md break-words ${isMyMessage ? 'rounded-tr-none bg-[#6363FC] text-white' : 'rounded-tl-none bg-[#F2F3F7] text-[#46435E]'}`}>{m.content}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                {/* Typing indicator for incoming messages */}
                {isTyping && <div className="text-sm text-gray-500 my-2">Typing...</div>}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          <div className="flex relative items-center px-4 pb-4 pt-2 rounded-b-2xl ">
            <input type="text" placeholder="Type a message..." value={newMessage} onChange={handleTyping} onKeyDown={handleSendMessage} className="flex-grow text-[#20195D] px-4 py-4 bg-[#F5F7FB] pr-13 rounded-xl focus:outline-none " />
            <button onClick={handleSendMessage} className="absolute cursor-pointer right-10 text-[1.5rem] text-[#20195D]">
              <IoPaperPlaneOutline />
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
