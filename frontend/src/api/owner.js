import api from './axios';

export const ownerAPI = {
  getDashboard: async () => {
    const res = await api.get('/owner/dashboard');
    return res.data;
  },

  getRatings: async () => {
    const res = await api.get('/owner/ratings');
    return res.data;
  },
};
