const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  registerDoctor,
  loginDoctor,
  setupClinic,
  getAppointments,
  updateAppointmentStatus,
} = require('../controllers/doctorController');

// Doctor Routes
router.post('/register', registerDoctor);
router.post('/login', loginDoctor);
router.post('/setup', auth, setupClinic);
router.get('/appointments', auth, getAppointments);
router.put('/appointments/:id', auth, updateAppointmentStatus);

module.exports = router;