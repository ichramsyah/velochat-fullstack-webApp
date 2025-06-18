import useUserStore from '../store/userStore';
import useChatStore from '../store/chatStore';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const getSenderName = (loggedUser, users) => {
  if (!users || users.length < 2) return '';
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

const MyChats = ({ chats, loading }) => {
  const { userInfo } = useUserStore((state) => state);
  const { selectedChat, setSelectedChat, notifications } = useChatStore((state) => state);

  return (
    <div className="flex flex-col w-1/3 p-4 bg-white border-r">
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-xl font-bold">Percakapan</h2>
      </div>
      <div className="flex-grow mt-4 overflow-y-auto">
        {loading ? (
          <div className="space-y-3">
            <Skeleton height={60} count={8} />
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {chats.length > 0 ? (
              chats.map((chat) => {
                const chatNotifications = notifications.filter((n) => n.chat._id === chat._id);
                return (
                  <div
                    key={chat._id}
                    onClick={() => {
                      setSelectedChat(chat);
                    }}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${selectedChat?._id === chat._id ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    <div>
                      <p className="font-semibold">{!chat.isGroupChat ? getSenderName(userInfo, chat.users) : chat.chatName}</p>
                      {chat.latestMessage ? (
                        <p className={`text-sm truncate ${chatNotifications.length > 0 ? 'font-bold' : 'text-gray-500'}`}>
                          <span className="font-normal">{chat.latestMessage.sender.name}: </span>
                          {chat.latestMessage.content}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 italic">Belum ada pesan.</p>
                      )}
                    </div>
                    {chatNotifications.length > 0 && <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">{chatNotifications.length}</span>}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center mt-4">Mulai percakapan dengan mencari teman.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChats;
