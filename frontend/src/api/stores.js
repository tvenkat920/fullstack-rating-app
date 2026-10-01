import api from './axios';

export const storesAPI = {
  getStores: async (params = {}) => {
    const res = await api.get('/stores', { params });
    return res.data;
  },

  getStoreById: async (id) => {
    const res = await api.get(`/stores/${id}`);
    return res.data;
  },

  createStore: async (storeData) => {
    const res = await api.post('/stores', storeData);
    return res.data;
  },

  submitRating: async (storeId, rating) => {
    const res = await api.post(`/stores/${storeId}/ratings`, { rating });
    return res.data;
  },

  modifyRating: async (storeId, rating) => {
    const res = await api.put(`/stores/${storeId}/ratings`, { rating });
    return res.data;
  },
};
