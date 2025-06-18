// src/api/messageAPI.js

import api from './axiosConfig';

/**
 * @param {string} chatId
 * @param {string} token
 * @returns {Promise<object>}
 */
export const getMessages = async (chatId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await api.get(`/api/message/${chatId}`, config);
  return data;
};

/**
 * @param {object} messageData
 * @param {string} token
 * @returns {Promise<object>}
 */
export const sendMessage = async (messageData, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await api.post('/api/message', messageData, config);
  return data;
};
