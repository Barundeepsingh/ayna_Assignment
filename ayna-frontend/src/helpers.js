import axios from 'axios';
import { AUTH_TOKEN } from './constant';

// Existing token management functions
export const getToken = () => {
  return localStorage.getItem(AUTH_TOKEN);
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN, token);
  }
};


export const removeToken = () => {
  localStorage.removeItem(AUTH_TOKEN);
};

// New functions for interacting with Strapi API

const API_URL = process.env.REACT_APP_API_URL || 'https://favorable-wisdom-9b8eb902e1.strapiapp.com';
// https://favorable-wisdom-9b8eb902e1.strapiapp.com

// Fetch all sessions for a specific user
export const fetchSessions = async (userId) => {
 // console.log(userId)
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/api/sessions?filters[user]=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
};

// Fetch all messages for a specific session
export const fetchMessages = async (sessionId, user) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/api/messages?filters[session][$eq]=${sessionId}&filters[senderId][$eq]=${user}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// Create a new message in a specific session
export const createMessage = async (id, messageData) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/api/messages`, {
      data: {
        content: messageData.content,
        sender: messageData.sender,
        receiver: messageData.receiver,
        timestamp: messageData.timestamp,
        session: id,
        senderId:messageData.senderId
      },
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
};

// Create a new session for a specific user
export const createSession = async (userId,sessionNameInput) => {
  try {
    const token = getToken();
    console.log(userId);
    const response = await axios.post(`${API_URL}/api/sessions`, {
      data: {
        user: userId,
        userId: userId,
        sessionName: sessionNameInput,
      },
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};
