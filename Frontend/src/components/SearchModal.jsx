// src/components/SearchModal.jsx

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import useUserStore from '../store/userStore';
import useChatStore from '../store/chatStore';
import { searchUsers, getContacts } from '../api/userAPI';
import { sendFriendRequest } from '../api/friendRequestAPI';
import { accessChat } from '../api/chatAPI';

const SearchModal = ({ onClose }) => {
  const [searchEmail, setSearchEmail] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myContacts, setMyContacts] = useState([]);

  const { userInfo } = useUserStore((state) => state);
  const { setSelectedChat } = useChatStore((state) => state);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const contactsData = await getContacts(userInfo.token);
        setMyContacts(contactsData);
      } catch (error) {
        console.error('Gagal memuat kontak di modal:', error);
      }
    };
    if (userInfo?.token) {
      loadContacts();
    }
  }, [userInfo.token]);

  const handleSearch = async () => {
    if (!searchEmail) return;
    setLoading(true);
    try {
      const data = await searchUsers(searchEmail, userInfo.token);
      setResults(data);
    } catch (error) {
      toast.error('Gagal mencari pengguna.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (toUserId) => {
    try {
      await sendFriendRequest(toUserId, userInfo.token);
      toast.success('Permintaan pertemanan terkirim!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengirim permintaan.');
    }
  };

  const handleStartChat = async (contactId) => {
    try {
      const chat = await accessChat(contactId, userInfo.token);
      setSelectedChat(chat);
      onClose();
    } catch (error) {
      toast.error('Gagal memulai chat.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">Cari Pengguna</h2>
        <div className="flex space-x-2">
          <input type="email" placeholder="Cari berdasarkan email..." value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} className="flex-grow px-3 py-2 border rounded-md" />
          <button onClick={handleSearch} disabled={loading} className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md">
            {loading ? '...' : 'Cari'}
          </button>
        </div>

        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          {results.map((user) => {
            const isContact = myContacts.some((contact) => contact._id === user._id);
            if (user._id === userInfo._id) return null;

            return (
              <div key={user._id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                {isContact ? (
                  <button onClick={() => handleStartChat(user._id)} className="px-3 py-1 text-sm text-white bg-indigo-500 rounded-md">
                    Chat
                  </button>
                ) : (
                  <button onClick={() => handleSendRequest(user._id)} className="px-3 py-1 text-sm text-white bg-green-500 rounded-md">
                    Add
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <button onClick={onClose} className="w-full mt-4 py-2 text-gray-700 bg-gray-200 rounded-md">
          Tutup
        </button>
      </div>
    </div>
  );
};

export default SearchModal;
