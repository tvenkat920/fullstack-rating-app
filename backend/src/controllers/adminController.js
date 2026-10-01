const adminService = require('../services/adminService');
const storeService = require('../services/storeService');

class AdminController {
  async getDashboard(req, res, next) {
    try {
      const stats = await adminService.getDashboardStats();
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const { name, email, address, role, sortBy, order } = req.query;
      const users = await adminService.getUsers({
        name,
        email,
        address,
        role,
        sortBy,
        order,
      });

      return res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await adminService.getUserById(id);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const newUser = await adminService.createUser(req.body);
      return res.status(201).json({
        success: true,
        message: 'User created successfully.',
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStores(req, res, next) {
    try {
      const { search, sortBy, order } = req.query;
      const stores = await storeService.getStores({
        search,
        sortBy,
        order,
      });

      return res.status(200).json({
        success: true,
        data: stores,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
