const prisma = require('../config/db');

class RatingService {
  async submitRating(userId, storeId, ratingValue) {
    const sId = parseInt(storeId, 10);
    const rVal = parseInt(ratingValue, 10);

    if (isNaN(sId)) {
      const error = new Error('Invalid store ID.');
      error.statusCode = 400;
      error.isOperational = true;
      throw error;
    }

    if (isNaN(rVal) || rVal < 1 || rVal > 5) {
      const error = new Error('Rating must be an integer between 1 and 5.');
      error.statusCode = 400;
      error.isOperational = true;
      throw error;
    }

    // Check store existence
    const store = await prisma.store.findUnique({
      where: { id: sId },
    });

    if (!store) {
      const error = new Error('Store not found.');
      error.statusCode = 404;
      error.isOperational = true;
      throw error;
    }

    // Check if user already submitted a rating
    const existing = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId: sId,
        },
      },
    });

    if (existing) {
      const error = new Error('You have already submitted a rating for this store. Please modify your existing rating instead.');
      error.statusCode = 409;
      error.isOperational = true;
      throw error;
    }

    const newRating = await prisma.rating.create({
      data: {
        userId,
        storeId: sId,
        rating: rVal,
      },
    });

    // Compute updated overall store rating
    const storeRatings = await prisma.rating.findMany({
      where: { storeId: sId },
      select: { rating: true },
    });
    const totalRatings = storeRatings.length;
    const sum = storeRatings.reduce((acc, curr) => acc + curr.rating, 0);
    const overallRating = totalRatings > 0 ? Number((sum / totalRatings).toFixed(1)) : null;

    return {
      rating: newRating,
      overallRating,
      totalRatings,
      userRating: rVal,
    };
  }

  async modifyRating(userId, storeId, ratingValue) {
    const sId = parseInt(storeId, 10);
    const rVal = parseInt(ratingValue, 10);

    if (isNaN(sId)) {
      const error = new Error('Invalid store ID.');
      error.statusCode = 400;
      error.isOperational = true;
      throw error;
    }

    if (isNaN(rVal) || rVal < 1 || rVal > 5) {
      const error = new Error('Rating must be an integer between 1 and 5.');
      error.statusCode = 400;
      error.isOperational = true;
      throw error;
    }

    const existing = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId: sId,
        },
      },
    });

    if (!existing) {
      const error = new Error('No existing rating found to modify. Please submit a new rating.');
      error.statusCode = 404;
      error.isOperational = true;
      throw error;
    }

    // Ensure user cannot modify another user's rating (enforced by userId in where clause)
    const updatedRating = await prisma.rating.update({
      where: {
        userId_storeId: {
          userId,
          storeId: sId,
        },
      },
      data: {
        rating: rVal,
      },
    });

    // Compute updated overall store rating
    const storeRatings = await prisma.rating.findMany({
      where: { storeId: sId },
      select: { rating: true },
    });
    const totalRatings = storeRatings.length;
    const sum = storeRatings.reduce((acc, curr) => acc + curr.rating, 0);
    const overallRating = totalRatings > 0 ? Number((sum / totalRatings).toFixed(1)) : null;

    return {
      rating: updatedRating,
      overallRating,
      totalRatings,
      userRating: rVal,
    };
  }
}

module.exports = new RatingService();
