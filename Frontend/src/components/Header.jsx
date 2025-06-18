// src/components/Header.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useUserStore from '../store/userStore';
import { getPendingRequests } from '../api/friendRequestAPI';
import SearchModal from './SearchModal';
import FriendRequestPopover from './FriendRequestPopover';
import { Link } from 'react-router-dom';

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
    />
  </svg>
);

const Header = ({ socket }) => {
  const { userInfo, logout } = useUserStore((state) => state);
  const navigate = useNavigate();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchRequests = useCallback(async () => {
    if (!userInfo?.token) return;
    try {
      const data = await getPendingRequests(userInfo.token);
      setNotifications(data);
    } catch (error) {
      console.error('Gagal mengambil permintaan pertemanan');
    }
  }, [userInfo?.token]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    if (!socket) return;

    const newRequestListener = (newRequest) => {
      toast.success(`${newRequest.fromUser.name} mengirim permintaan pertemanan!`);
      setNotifications((prev) => [newRequest, ...prev]);
    };

    const requestAcceptedListener = (acceptedRequest) => {
      toast.success(`Permintaan Anda kepada ${acceptedRequest.toUser.name} diterima!`);
    };

    socket.on('receive_friend_request', newRequestListener);
    socket.on('friend_request_accepted', requestAcceptedListener);

    return () => {
      socket.off('receive_friend_request', newRequestListener);
      socket.off('friend_request_accepted', requestAcceptedListener);
    };
  }, [socket]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="flex items-center justify-between w-full p-4 bg-white border-b">
        <button onClick={() => setIsSearchModalOpen(true)} className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Cari kontak
        </button>
        <h1 className="text-xl font-bold text-gray-800">VeloChat</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button onClick={() => setIsPopoverOpen(!isPopoverOpen)} className="text-gray-500 hover:text-gray-700">
              <BellIcon />
              {notifications.length > 0 && <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />}
            </button>
            {isPopoverOpen && <FriendRequestPopover onClose={() => setIsPopoverOpen(false)} />}
          </div>

          <Link to="/profile" className="font-semibold text-gray-700 hover:text-indigo-600">
            {userInfo?.name}
          </Link>
          <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">
            Logout
          </button>
        </div>
      </header>
      {isSearchModalOpen && <SearchModal onClose={() => setIsSearchModalOpen(false)} />}
    </>
  );
};

export default Header;
