// src/components/FriendRequestPopover.jsx
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useUserStore from '../store/userStore';
import { getPendingRequests, respondToRequest } from '../api/friendRequestAPI';

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
      setRequests(requests.filter((req) => req._id !== requestId));
    } catch (error) {
      toast.error('Gagal merespon permintaan.');
    }
  };

  return (
    <div className="absolute top-16 right-4 z-50 w-72 bg-white rounded-lg shadow-xl border">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Permintaan Pertemanan</h3>
      </div>
      <div className="p-2 max-h-80 overflow-y-auto">
        {loading && <p className="text-gray-500 p-2">Memuat...</p>}
        {!loading && requests.length === 0 && <p className="text-gray-500 p-2 text-center">Tidak ada permintaan baru.</p>}
        {requests.map((req) => (
          <div key={req._id} className="p-2 hover:bg-gray-50 rounded-md">
            <p className="font-semibold">{req.fromUser.name}</p>
            <div className="flex justify-end space-x-2 mt-2">
              <button onClick={() => handleResponse(req._id, 'decline')} className="px-3 py-1 text-xs text-gray-700 bg-gray-200 rounded-md">
                Tolak
              </button>
              <button onClick={() => handleResponse(req._id, 'accept')} className="px-3 py-1 text-xs text-white bg-green-500 rounded-md">
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
