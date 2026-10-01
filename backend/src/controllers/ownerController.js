const ownerService = require('../services/ownerService');

class OwnerController {
  async getDashboard(req, res, next) {
    try {
      const ownerId = req.user.id;
      const dashboardData = await ownerService.getDashboard(ownerId);

      return res.status(200).json({
        success: true,
        data: dashboardData,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRatings(req, res, next) {
    try {
      const ownerId = req.user.id;
      const dashboardData = await ownerService.getDashboard(ownerId);

      return res.status(200).json({
        success: true,
        data: {
          store: dashboardData.store,
          averageRating: dashboardData.averageRating,
          totalRatings: dashboardData.totalRatings,
          ratings: dashboardData.ratings,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OwnerController();
