import api from './axiosConfig';

/**
 * @param {object} userData
 * @returns {Promise<object>}
 */

export const registerUser = async (userData) => {
  const { data } = await api.post('/api/users/register', userData);
  return data;
};

/**
 * @param {object} credentials
 * @returns {Promise<object>}
 */

export const loginUser = async (credentials) => {
  const { data } = await api.post('/api/users/login', credentials);
  return data;
};
