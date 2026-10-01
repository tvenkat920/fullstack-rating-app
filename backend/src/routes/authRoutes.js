const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  validateSignup,
  validateLogin,
  validateChangePassword,
} = require('../validators/authValidators');

router.post('/signup', validateRequest(validateSignup), authController.signup);
router.post('/login', validateRequest(validateLogin), authController.login);
router.post(
  '/change-password',
  requireAuth,
  validateRequest(validateChangePassword),
  authController.changePassword
);
router.get('/me', requireAuth, authController.getMe);

module.exports = router;
