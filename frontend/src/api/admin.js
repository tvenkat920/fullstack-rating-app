import api from './axios';

export const adminAPI = {
  getDashboard: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  getUsers: async (params = {}) => {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  getUserById: async (id) => {
    const res = await api.get(`/admin/users/${id}`);
    return res.data;
  },

  createUser: async (userData) => {
    const res = await api.post('/admin/users', userData);
    return res.data;
  },

  getStores: async (params = {}) => {
    const res = await api.get('/admin/stores', { params });
    return res.data;
  },
};
