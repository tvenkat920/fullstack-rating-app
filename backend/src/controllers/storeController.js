const storeService = require('../services/storeService');

class StoreController {
  async getStores(req, res, next) {
    try {
      const { search, sortBy, order } = req.query;
      const userId = req.user ? req.user.id : null;

      const stores = await storeService.getStores({
        search,
        sortBy,
        order,
        userId,
      });

      return res.status(200).json({
        success: true,
        data: stores,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStoreById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user ? req.user.id : null;

      const store = await storeService.getStoreById(id, userId);

      return res.status(200).json({
        success: true,
        data: store,
      });
    } catch (error) {
      next(error);
    }
  }

  async createStore(req, res, next) {
    try {
      const store = await storeService.createStore(req.body);
      return res.status(201).json({
        success: true,
        message: 'Store created successfully.',
        data: store,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StoreController();
