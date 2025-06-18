import api from './axiosConfig';

export const searchUsers = async (searchQuery, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await api.get(`/api/users?search=${searchQuery}`, config);
  return data;
};

export const getContacts = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await api.get('/api/users/contacts', config);
  return data;
};

export const updateUserProfile = async (updateData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  const { data } = await api.put('/api/users/profile', updateData, config);
  return data;
};

export const updateProfilePicture = async (formData, token) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await api.put('/api/users/profile/picture', formData, config);
  return data;
};

export const uploadPublicKey = async (publicKey, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await api.post('/api/users/public-key', { publicKey }, config);
  return data;
};

export const getPublicKey = async (userId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await api.get(`/api/users/public-key/${userId}`, config);
  return data.publicKey;
};
