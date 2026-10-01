const prisma = require('../config/db');

class StoreService {
  async getStores({ search, sortBy = 'name', order = 'asc', userId = null }) {
    const validSortFields = ['name', 'address', 'rating', 'email'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toLowerCase() === 'desc' ? 'desc' : 'asc';

    const where = {};
    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { name: { contains: term, mode: 'insensitive' } },
        { address: { contains: term, mode: 'insensitive' } },
      ];
    }

    // Fetch stores along with their ratings and owner info
    const stores = await prisma.store.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ratings: {
          select: {
            id: true,
            rating: true,
            userId: true,
          },
        },
      },
      // Note: If sorting by name, address, or email, Prisma orderBy works directly.
      // If sorting by rating, we can sort after calculating the average rating.
      ...(sortField !== 'rating'
        ? {
            orderBy: {
              [sortField]: sortOrder,
            },
          }
        : {}),
    });

    const formattedStores = stores.map((store) => {
      const totalRatings = store.ratings.length;
      const sum = store.ratings.reduce((acc, curr) => acc + curr.rating, 0);
      const overallRating = totalRatings > 0 ? Number((sum / totalRatings).toFixed(1)) : null;

      // Check if current user has rated this store
      let userRating = null;
      if (userId) {
        const found = store.ratings.find((r) => r.userId === userId);
        if (found) {
          userRating = found.rating;
        }
      }

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        ownerId: store.ownerId,
        owner: store.owner,
        totalRatings,
        overallRating, // null if 0 ratings, or e.g. 4.2
        userRating, // null if user hasn't rated, or 1-5
        createdAt: store.createdAt,
      };
    });

    if (sortField === 'rating') {
      formattedStores.sort((a, b) => {
        const valA = a.overallRating !== null ? a.overallRating : -1;
        const valB = b.overallRating !== null ? b.overallRating : -1;
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
    }

    return formattedStores;
  }

  async getStoreById(storeId, userId = null) {
    const id = parseInt(storeId, 10);
    if (isNaN(id)) {
      const error = new Error('Invalid store ID.');
      error.statusCode = 400;
      error.isOperational = true;
      throw error;
    }

    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ratings: {
          select: {
            id: true,
            rating: true,
            userId: true,
          },
        },
      },
    });

    if (!store) {
      const error = new Error('Store not found.');
      error.statusCode = 404;
      error.isOperational = true;
      throw error;
    }

    const totalRatings = store.ratings.length;
    const sum = store.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    const overallRating = totalRatings > 0 ? Number((sum / totalRatings).toFixed(1)) : null;

    let userRating = null;
    if (userId) {
      const found = store.ratings.find((r) => r.userId === userId);
      if (found) {
        userRating = found.rating;
      }
    }

    return {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      ownerId: store.ownerId,
      owner: store.owner,
      totalRatings,
      overallRating,
      userRating,
      createdAt: store.createdAt,
    };
  }

  async createStore({ name, email, address, ownerId }) {
    const parsedOwnerId = parseInt(ownerId, 10);

    // Validate that the owner exists and has role STORE_OWNER
    const owner = await prisma.user.findUnique({
      where: { id: parsedOwnerId },
    });

    if (!owner) {
      const error = new Error('Selected store owner does not exist.');
      error.statusCode = 404;
      error.isOperational = true;
      throw error;
    }

    if (owner.role !== 'STORE_OWNER') {
      const error = new Error('Owner must be a user with the STORE_OWNER role.');
      error.statusCode = 400;
      error.isOperational = true;
      throw error;
    }

    // Check store email uniqueness
    const existing = await prisma.store.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      const error = new Error('A store with this email already exists.');
      error.statusCode = 409;
      error.isOperational = true;
      throw error;
    }

    const store = await prisma.store.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        address: address.trim(),
        ownerId: parsedOwnerId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return store;
  }
}

module.exports = new StoreService();
