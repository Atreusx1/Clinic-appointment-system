const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  clinicDetails: {
    name: String,
    location: String,
    workingHours: String,
    fees: Number,
  },
  subscriptionPlan: { type: String, enum: ['basic', 'premium'], default: 'basic' },
  isApproved: { type: Boolean, default: false },
  bookingLink: { type: String, unique: true },
  qrCode: String,
  appointmentSlots: [{
    date: Date,
    time: String,
    isBooked: { type: Boolean, default: false },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  }],
  role: { type: String, default: 'doctor' },
});

module.exports = mongoose.model('Doctor', doctorSchema);