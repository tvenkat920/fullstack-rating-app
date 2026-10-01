const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const ratingController = require('../controllers/ratingController');
const { requireAuth, requireRole, optionalAuth } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { validateCreateStore } = require('../validators/storeValidators');
const { validateRating } = require('../validators/ratingValidators');

// Stores endpoints
router.get('/', optionalAuth, storeController.getStores);
router.get('/:id', optionalAuth, storeController.getStoreById);
router.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  validateRequest(validateCreateStore),
  storeController.createStore
);

// Ratings endpoints nested under stores
router.post(
  '/:storeId/ratings',
  requireAuth,
  requireRole('USER'),
  validateRequest(validateRating),
  ratingController.submitRating
);

router.put(
  '/:storeId/ratings',
  requireAuth,
  requireRole('USER'),
  validateRequest(validateRating),
  ratingController.modifyRating
);

module.exports = router;
