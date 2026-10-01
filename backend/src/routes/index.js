const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const storeRoutes = require('./storeRoutes');
const adminRoutes = require('./adminRoutes');
const ownerRoutes = require('./ownerRoutes');

router.use('/auth', authRoutes);
router.use('/stores', storeRoutes);
router.use('/admin', adminRoutes);
router.use('/owner', ownerRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Rating API server is healthy and running.',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
