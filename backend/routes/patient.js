const express = require('express');
const router = express.Router();
const { bookAppointment, verifyOTP } = require('../controllers/patientController');

// Patient Routes
router.post('/book', bookAppointment);
router.post('/verify-otp', verifyOTP);

module.exports = router;