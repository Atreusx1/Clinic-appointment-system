const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// Approve Doctor
const approveDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    doctor.isApproved = true;
    await doctor.save();
    res.json({ message: 'Doctor approved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// View Analytics
const getAnalytics = async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const activeSubscriptions = await Doctor.countDocuments({ subscriptionPlan: 'premium' });

    res.json({
      totalDoctors,
      totalAppointments,
      activeSubscriptions,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  approveDoctor,
  getAnalytics,
};