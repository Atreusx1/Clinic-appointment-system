const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const OTP = require('../models/OTP');
const { sendEmail, sendOTP } = require('../services/notification');
const { v4: uuidv4 } = require('uuid');

// Book Appointment
const bookAppointment = async (req, res) => {
  const { doctorId, date, time, name, email } = req.body;
  try {
    // Validate request body
    if (!doctorId || !date || !time || !name || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      console.error(`Doctor not found for ID: ${doctorId}`);
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Find and validate appointment slot
    const slot = doctor.appointmentSlots.find(s => 
      s.date.toISOString() === new Date(date).toISOString() && s.time === time
    );
    if (!slot) {
      console.error(`Slot not found for date: ${date}, time: ${time}, doctorId: ${doctorId}`);
      return res.status(400).json({ message: 'Slot not found' });
    }
    if (slot.isBooked) {
      console.error(`Slot already booked for date: ${date}, time: ${time}, doctorId: ${doctorId}`);
      return res.status(400).json({ message: 'Slot unavailable' });
    }

    // Create or find patient
    let patient = await Patient.findOne({ email });
    if (!patient) {
      patient = new Patient({ name, email });
      await patient.save().catch(err => {
        console.error('Error saving patient:', err);
        throw new Error('Failed to save patient');
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpDoc = new OTP({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiration
    });
    await otpDoc.save().catch(err => {
      console.error('Error saving OTP:', err);
      throw new Error('Failed to save OTP');
    });

    // Send OTP via email
    await sendOTP(email, otp).catch(err => {
      console.error('Error sending OTP email:', err);
      throw new Error('Failed to send OTP email');
    });

    // Store booking details in session
    req.session.pendingBooking = { doctorId, date, time, name, email, patientId: patient._id };
    res.json({ message: 'OTP sent to your email. Please verify to confirm the appointment.' });
  } catch (err) {
    console.error('Book appointment error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Verify OTP and Confirm Appointment
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    // Validate OTP
    const otpDoc = await OTP.findOne({ email, otp });
    if (!otpDoc || otpDoc.expiresAt < new Date()) {
      console.error(`Invalid or expired OTP for email: ${email}, otp: ${otp}`);
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Retrieve pending booking
    const { doctorId, date, time, name, patientId } = req.session.pendingBooking || {};
    if (!doctorId) {
      console.error('No pending booking found in session');
      return res.status(400).json({ message: 'No pending booking found' });
    }

    // Re-validate slot
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      console.error(`Doctor not found during OTP verification: ${doctorId}`);
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const slot = doctor.appointmentSlots.find(s => 
      s.date.toISOString() === new Date(date).toISOString() && s.time === time
    );
    if (!slot || slot.isBooked) {
      console.error(`Slot unavailable during OTP verification: ${date}, ${time}, ${doctorId}`);
      return res.status(400).json({ message: 'Slot no longer available' });
    }

    // Book the slot
    slot.isBooked = true;
    slot.patientId = patientId;
    await doctor.save().catch(err => {
      console.error('Error saving doctor slot:', err);
      throw new Error('Failed to save doctor slot');
    });

    // Create appointment
    const tokenNumber = Math.floor(1000 + Math.random() * 9000);
    const appointment = new Appointment({
      doctorId,
      patientId,
      date,
      time,
      tokenNumber,
      status: 'confirmed',
    });

    await appointment.save().catch(err => {
      console.error('Error saving appointment:', err);
      throw new Error('Failed to save appointment');
    });

    // Send confirmation email
    await sendEmail(email, 'Appointment Confirmed', `Appointment confirmed with Dr. ${doctor.name} on ${date} at ${time}. Token: ${tokenNumber}`)
      .catch(err => {
        console.error('Error sending confirmation email:', err);
        throw new Error('Failed to send confirmation email');
      });

    // Clean up OTP and session
    await OTP.deleteOne({ email, otp }).catch(err => {
      console.error('Error deleting OTP:', err);
    });
    delete req.session.pendingBooking;

    res.json({ message: 'Appointment booked', tokenNumber });
  } catch (err) {
    console.error('Verify OTP error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  bookAppointment,
  verifyOTP,
};