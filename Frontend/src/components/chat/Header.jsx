import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getPendingRequests } from '../../api/friendRequestAPI';
import { FaChevronDown, FaBars } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import useUserStore from '../../store/userStore';
import FriendRequestPopover from '../ui/FriendRequestPopover';

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

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const { setMyChatOpen } = useOutletContext(); // ✅ akses context dari layout

  const popoverRef = useRef(null);
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isPopoverOpen && popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsPopoverOpen(false);
      }

      if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverOpen, isDropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center md:justify-end justify-between w-full px-6 pt-2 pb-1 bg-[#F8FAFB] relative">
      {/* ☰ Tombol sidebar mobile */}
      <button onClick={() => setMyChatOpen(true)} className="block md:hidden text-gray-700 hover:text-gray-900 text-xl" title="Buka daftar chat">
        <FaBars />
      </button>

      {/* Kanan: Notifikasi + Profil */}
      <div className="flex items-center space-x-4">
        {/* 🔔 Notifikasi Bell */}
        <div className="relative" ref={popoverRef}>
          <button onClick={() => setIsPopoverOpen(!isPopoverOpen)} className="text-gray-500 hover:text-gray-700">
            <BellIcon />
            {notifications.length > 0 && <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />}
          </button>
          {isPopoverOpen && <FriendRequestPopover onClose={() => setIsPopoverOpen(false)} />}
        </div>

        {/* 👤 Foto Profil + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center rounded-lg hover:bg-gray-200 px-2 py-1 space-x-1 transition-all">
            <img src={userInfo?.profilePic || 'https://res.cloudinary.com/dvf402g7e/image/upload/v1720894031/pfp-default.webp'} alt="User profile" className="w-8 h-8 rounded-full object-cover" />
            <FaChevronDown className="text-gray-500 text-sm" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md p-2 shadow-xl">
              <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="block flex items-center px-2 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-all">
                <i className="fas fa-pencil text-[14px] text-gray-500 mr-2"></i> Edit Profile
              </Link>
              <button onClick={handleLogout} className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-100 rounded-lg transition-all font-medium">
                <FontAwesomeIcon icon={faRightFromBracket} className="text-[14px] text-red-500 mr-1" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
