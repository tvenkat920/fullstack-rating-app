const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// Enforce STORE_OWNER role on all owner routes
router.use(requireAuth, requireRole('STORE_OWNER'));

router.get('/dashboard', ownerController.getDashboard);
router.get('/ratings', ownerController.getRatings);

module.exports = router;
