const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { sendSMS, sendWhatsApp } = require('../services/notification');
const { v4: uuidv4 } = require('uuid');

// Doctor Registration
const registerDoctor = async (req, res) => {
  const { name, email, password, subscriptionPlan } = req.body;
  try {
    let doctor = await Doctor.findOne({ email });
    if (doctor) return res.status(400).json({ message: 'Doctor already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const bookingLink = `https://yourapp.com/doctor/${uuidv4()}`;
    const qrCode = `qr_${uuidv4()}`; // Replace with actual QR code generation logic

    doctor = new Doctor({
      name,
      email,
      password: hashedPassword,
      subscriptionPlan,
      bookingLink,
      qrCode,
    });

    await doctor.save();
    res.status(201).json({ message: 'Doctor registered, awaiting approval' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Doctor Login
const loginDoctor = async (req, res) => {
  const { email, password } = req.body;
  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor || !doctor.isApproved) return res.status(401).json({ message: 'Invalid credentials or not approved' });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: doctor._id, role: doctor.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ message: 'Login successful', doctorId: doctor._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Setup Clinic Details
const setupClinic = async (req, res) => {
  const { clinicDetails, appointmentSlots } = req.body;
  try {
    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    doctor.clinicDetails = clinicDetails;
    doctor.appointmentSlots = appointmentSlots;
    await doctor.save();

    res.json({ message: 'Clinic setup complete' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// View Appointments
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user.id }).populate('patientId');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Appointment Status
const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = status;
    if (status === 'missed') {
      // Auto-reschedule logic
      const doctor = await Doctor.findById(appointment.doctorId);
      const nextSlot = doctor.appointmentSlots.find(slot => !slot.isBooked);
      if (nextSlot) {
        appointment.date = nextSlot.date;
        appointment.time = nextSlot.time;
        nextSlot.isBooked = true;
        nextSlot.patientId = appointment.patientId;
        await doctor.save();
        await sendSMS(appointment.patientId.phone, `Your appointment has been rescheduled to ${nextSlot.date} at ${nextSlot.time}`);
      }
    }
    await appointment.save();
    res.json({ message: 'Appointment updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerDoctor,
  loginDoctor,
  setupClinic,
  getAppointments,
  updateAppointmentStatus,
};