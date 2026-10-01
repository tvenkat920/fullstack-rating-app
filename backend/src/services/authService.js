const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const { generateToken } = require('../config/jwt');

class AuthService {
  async signup({ name, email, password, address }) {
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      const error = new Error('An account with this email address already exists.');
      error.statusCode = 409;
      error.isOperational = true;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Registration must ALWAYS create role = USER. Never allow ADMIN or STORE_OWNER
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        address: address ? address.trim() : null,
        role: 'USER',
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

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  async login({ email, password }) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      error.isOperational = true;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      error.isOperational = true;
      throw error;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
      },
    };
  }

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      error.isOperational = true;
      throw error;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      const error = new Error('Current password is incorrect.');
      error.statusCode = 400;
      error.isOperational = true;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { message: 'Password changed successfully.' };
  }
}

module.exports = new AuthService();
