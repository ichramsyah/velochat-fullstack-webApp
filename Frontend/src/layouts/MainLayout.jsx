// src/layouts/MainLayout.jsx
import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaUsers } from 'react-icons/fa';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMyChatOpen, setMyChatOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen w-full relative">
      {/* Sidebar Navigator (Desktop & Mobile) */}
      <div className="hidden md:flex px-2 bg-[#6363FC] text-white flex-col items-center py-6 space-y-6">
        <div className="text-xs font-bold">VeloChat</div>

        <button onClick={() => navigate('/')} className={`w-10 h-10 transition-all rounded-lg flex items-center justify-center ${isActive('/') ? 'scale-[1.1] bg-white text-[#6363FC]' : 'hover:bg-[#8181fc]'}`}>
          <FaUser />
        </button>

        <button onClick={() => navigate('/group')} className={`w-10 h-10 transition-all rounded-lg flex items-center justify-center ${isActive('/group') ? 'scale-[1.1] bg-white text-[#6363FC]' : 'hover:bg-[#8181fc]'}`}>
          <FaUsers />
        </button>
      </div>

      {/* Konten utama */}
      <div className="flex flex-grow">
        <Outlet context={{ setMyChatOpen, isMyChatOpen }} />
      </div>
    </div>
  );
};

export default MainLayout;
