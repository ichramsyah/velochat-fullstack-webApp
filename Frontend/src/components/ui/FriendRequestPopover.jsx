// src/components/FriendRequestPopover.jsx
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useUserStore from '../../store/userStore';
import { getPendingRequests, respondToRequest } from '../../api/friendRequestAPI';
import { FaUserCircle } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

const FriendRequestPopover = ({ onClose }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useUserStore((state) => state);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getPendingRequests(userInfo.token);
        setRequests(data);
      } catch (error) {
        toast.error('Gagal memuat permintaan.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [userInfo.token]);

  const handleResponse = async (requestId, action) => {
    try {
      await respondToRequest(requestId, action, userInfo.token);
      toast.success(`Permintaan berhasil di-${action === 'accept' ? 'terima' : 'tolak'}`);
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (error) {
      toast.error('Gagal merespon permintaan.');
    }
  };

  return (
    <div className="absolute top-8 right-1 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200 animate-slide-fade">
      <div className="px-4 pt-4">
        <h3 className="font-semibold text-[#20195D] text-lg">
          <FontAwesomeIcon icon={faUserPlus} className="mx-1 text-[1rem]" /> Permintaan Pertemanan{' '}
        </h3>
      </div>
      <div className="p-3 max-h-80 overflow-y-auto space-y-3">
        {loading && (
          <>
            {[...Array(1)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <Skeleton circle width={40} height={40} />
                  <div className="flex flex-col space-y-1">
                    <Skeleton width={100} height={12} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton width={50} height={24} />
                  <Skeleton width={50} height={24} />
                </div>
              </div>
            ))}
          </>
        )}
        {!loading && requests.length === 0 && <p className="text-gray-500 text-sm text-center">Tidak ada permintaan baru.</p>}
        {requests.map((req) => (
          <div key={req._id} className="flex items-center justify-between border-b border-[#D6D8D9] p-3">
            <div className="flex items-center gap-3">
              {req.fromUser.profilePic ? <img src={req.fromUser.profilePic} alt={req.fromUser.name} className="w-10 h-10 rounded-full object-cover" /> : <FaUserCircle className="w-10 h-10 text-gray-400" />}
              <span className="font-medium text-gray-800 text-sm">{req.fromUser.name}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleResponse(req._id, 'decline')} className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all">
                Tolak
              </button>
              <button onClick={() => handleResponse(req._id, 'accept')} className="px-3 py-1 text-xs bg-[#6363FC] hover:bg-[#5858F6] text-white rounded-md transition-all ">
                Terima
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendRequestPopover;
