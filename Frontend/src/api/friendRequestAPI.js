import api from './axiosConfig';

export const sendFriendRequest = async (toUserId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await api.post('/api/friend-requests', { toUserId }, config);
  return data;
};

export const getPendingRequests = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await api.get('/api/friend-requests/pending', config);
  return data;
};

export const respondToRequest = async (requestId, action, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await api.put(`/api/friend-requests/${requestId}/respond`, { action }, config);
  return data;
};
