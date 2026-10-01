const ratingService = require('../services/ratingService');

class RatingController {
  async submitRating(req, res, next) {
    try {
      const { storeId } = req.params;
      const { rating } = req.body;
      const userId = req.user.id;

      const result = await ratingService.submitRating(userId, storeId, rating);

      return res.status(201).json({
        success: true,
        message: 'Rating submitted successfully.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async modifyRating(req, res, next) {
    try {
      const { storeId } = req.params;
      const { rating } = req.body;
      const userId = req.user.id;

      const result = await ratingService.modifyRating(userId, storeId, rating);

      return res.status(200).json({
        success: true,
        message: 'Rating modified successfully.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RatingController();
