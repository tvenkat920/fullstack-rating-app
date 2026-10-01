const authService = require('../services/authService');

class AuthController {
  async signup(req, res, next) {
    try {
      const result = await authService.signup(req.body);
      return res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      return res.status(200).json({
        success: true,
        message: 'Logged in successfully.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const result = await authService.changePassword(req.user.id, req.body);
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      return res.status(200).json({
        success: true,
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
