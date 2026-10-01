const bcrypt = require('bcryptjs');
const prisma = require('../config/db');

class AdminService {
  async getDashboardStats() {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);

    return {
      totalUsers,
      totalStores,
      totalRatings,
    };
  }

  async getUsers({ name, email, address, role, sortBy = 'name', order = 'asc' }) {
    const validSortFields = ['name', 'email', 'address', 'role', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toLowerCase() === 'desc' ? 'desc' : 'asc';

    const where = {};

    if (name && name.trim()) {
      where.name = { contains: name.trim(), mode: 'insensitive' };
    }

    if (email && email.trim()) {
      where.email = { contains: email.trim(), mode: 'insensitive' };
    }

    if (address && address.trim()) {
      where.address = { contains: address.trim(), mode: 'insensitive' };
    }

    if (role && ['ADMIN', 'USER', 'STORE_OWNER'].includes(role.toUpperCase())) {
      where.role = role.toUpperCase();
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        [sortField]: sortOrder,
      },
    });

    return users;
  }

  async getUserById(userId) {
    const id = parseInt(userId, 10);
    if (isNaN(id)) {
      const error = new Error('Invalid user ID.');
      error.statusCode = 400;
      error.isOperational = true;
      throw error;
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // If the user is a STORE_OWNER, also include their store(s) and the store's ratings
        stores: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            ratings: {
              select: {
                id: true,
                rating: true,
                createdAt: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
      },
    });

    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      error.isOperational = true;
      throw error;
    }

    // Process store ratings if user is a STORE_OWNER
    let storeDetails = null;
    if (user.role === 'STORE_OWNER' && user.stores && user.stores.length > 0) {
      storeDetails = user.stores.map((store) => {
        const totalRatings = store.ratings.length;
        const sum = store.ratings.reduce((acc, r) => acc + r.rating, 0);
        const overallRating = totalRatings > 0 ? Number((sum / totalRatings).toFixed(1)) : null;

        return {
          id: store.id,
          name: store.name,
          email: store.email,
          address: store.address,
          totalRatings,
          overallRating,
          ratings: store.ratings.map((r) => ({
            id: r.id,
            rating: r.rating,
            createdAt: r.createdAt,
            user: r.user,
          })),
        };
      });
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      stores: storeDetails,
    };
  }

  async createUser({ name, email, password, address, role }) {
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      const error = new Error('An account with this email already exists.');
      error.statusCode = 409;
      error.isOperational = true;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        address: address ? address.trim() : null,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        address: true,
        createdAt: true,
      },
    });

    return newUser;
  }
}

module.exports = new AdminService();
