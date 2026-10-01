const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { validateCreateUser } = require('../validators/userValidators');

// Enforce ADMIN role on all admin routes
router.use(requireAuth, requireRole('ADMIN'));

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users', validateRequest(validateCreateUser), adminController.createUser);
router.get('/stores', adminController.getStores);

module.exports = router;
