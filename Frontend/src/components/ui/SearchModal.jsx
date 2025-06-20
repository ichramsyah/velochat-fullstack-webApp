// src/components/SearchModal.jsx

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import useUserStore from '../../store/userStore';
import useChatStore from '../../store/chatStore';
import { searchUsers, getContacts } from '../../api/userAPI';
import { sendFriendRequest } from '../../api/friendRequestAPI';
import { accessChat } from '../../api/chatAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark, faUserPlus, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SearchModal = ({ onClose }) => {
  const [searchEmail, setSearchEmail] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myContacts, setMyContacts] = useState([]);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const { userInfo } = useUserStore((state) => state);
  const { setSelectedChat } = useChatStore((state) => state);
  const defaultProfilePic = 'https://res.cloudinary.com/dvf402g7e/image/upload/v1720894031/pfp-default.webp';

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

  const handleSearch = async (e) => {
    if (e.type === 'keydown' && e.key !== 'Enter') return;
    if (!searchEmail) return;

    setLoading(true);
    setSearchAttempted(true);
    setResults([]);
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
    const toastId = toast.loading('Mengirim permintaan...');
    try {
      await sendFriendRequest(toUserId, userInfo.token);
      toast.success('Permintaan pertemanan terkirim!', { id: toastId });
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengirim permintaan.', { id: toastId });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-full max-w-lg p-6 bg-white rounded-2xl shadow-xl m-4">
        {/* Tombol Tutup (X) di pojok kanan atas */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors">
          <FontAwesomeIcon icon={faXmark} size="lg" />
        </button>

        <h2 className="text-2xl font-bold text-[#20195D] mb-5">Cari & Tambah Pengguna</h2>

        {/* Input Pencarian dengan Ikon */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400" />
          </span>
          <input
            type="email"
            placeholder="Cari pengguna berdasarkan email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-[7px] focus:rounded-[60px] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Area Hasil Pencarian */}
        <div className="mt-4 space-y-2 max-h-72 overflow-y-auto pr-2">
          {loading ? (
            <div className="space-y-3 mt-2">
              {[...Array(1)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  {/* Avatar Skeleton */}
                  <div className="flex items-center gap-4">
                    <Skeleton circle width={48} height={48} />
                    <div className="space-y-2">
                      <Skeleton width={100} height={12} />
                      <Skeleton width={160} height={10} />
                    </div>
                  </div>

                  {/* Tombol Skeleton */}
                  <Skeleton width={70} height={32} borderRadius={8} />
                </div>
              ))}
            </div>
          ) : searchAttempted && results.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Pengguna dengan email tersebut tidak ditemukan.</p>
              <p className="text-sm text-gray-400 mt-1">Pastikan email yang Anda masukkan sudah benar.</p>
            </div>
          ) : (
            results.map((user) => {
              if (user._id === userInfo._id) return null;
              const isContact = myContacts.some((contact) => contact._id === user._id);

              return (
                <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center">
                    {/* Gunakan gambar profil dengan fallback */}
                    <img src={user.profilePic || defaultProfilePic} alt={user.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  {isContact ? (
                    <button onClick={() => handleStartChat(user._id)} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-all duration-200" title="Mulai Percakapan">
                      <FontAwesomeIcon icon={faCommentDots} />
                      <span className="ml-2 hidden sm:inline">Chat</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSendRequest(user._id)}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#6363FC] rounded-[7px] cursor-pointer hover:rounded-[60px] transition-all duration-200"
                      title="Tambah Teman"
                    >
                      <FontAwesomeIcon icon={faUserPlus} />
                      <span className="ml-2 hidden sm:inline">Tambah</span>
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
