const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { approveDoctor, getAnalytics } = require('../controllers/adminController');

// Admin Routes
router.put('/approve-doctor/:id', auth, admin, approveDoctor);
router.get('/analytics', auth, admin, getAnalytics);

module.exports = router;