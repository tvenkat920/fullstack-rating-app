import api from './axios';

export const authAPI = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  signup: async (userData) => {
    const res = await api.post('/auth/signup', userData);
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  changePassword: async (passwords) => {
    const res = await api.post('/auth/change-password', passwords);
    return res.data;
  },
};
