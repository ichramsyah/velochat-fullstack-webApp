import api from './axiosConfig';

export const fetchChats = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await api.get('/api/chat', config);
  return data;
};

export const accessChat = async (userId, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await api.post('/api/chat', { userId }, config);
  return data;
};
