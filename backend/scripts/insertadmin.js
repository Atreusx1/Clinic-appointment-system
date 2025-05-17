const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

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

const Doctor = mongoose.model('Doctor', doctorSchema);

async function insertAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    // Hash the password
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    // Check if admin already exists
    const existingAdmin = await Doctor.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      await mongoose.connection.close();
      return;
    }

    // Insert admin user
    const admin = {
      name: 'Super Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'superadmin',
      isApproved: true,
    };

    await Doctor.insertOne(admin);
    console.log('Admin user inserted successfully:', admin.email);

    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

insertAdmin();