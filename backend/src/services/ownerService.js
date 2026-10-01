const prisma = require('../config/db');

class OwnerService {
  async getDashboard(ownerId) {
    // Find store owned by this authenticated user
    const store = await prisma.store.findFirst({
      where: { ownerId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            updatedAt: 'desc',
          },
        },
      },
    });

    if (!store) {
      return {
        hasStore: false,
        store: null,
        averageRating: null,
        totalRatings: 0,
        ratings: [],
      };
    }

    const totalRatings = store.ratings.length;
    const sum = store.ratings.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = totalRatings > 0 ? Number((sum / totalRatings).toFixed(1)) : null;

    const formattedRatings = store.ratings.map((r) => ({
      id: r.id,
      userName: r.user.name,
      userEmail: r.user.email,
      rating: r.rating,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    return {
      hasStore: true,
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
      },
      averageRating,
      totalRatings,
      ratings: formattedRatings,
    };
  }
}

module.exports = new OwnerService();
