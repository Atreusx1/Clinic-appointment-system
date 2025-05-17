const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Load .env file from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Log environment variables for debugging
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

// Validate environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('Error: EMAIL_USER and EMAIL_PASS must be set in .env');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function testEmail() {
  try {
    // Verify transporter
    await transporter.verify();
    console.log('Transporter verified successfully');

    // Send test email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'anishkadam92@gmail.com', // Replace with a valid test email
      subject: 'Test Email',
      text: 'This is a test email from Nodemailer.',
    });
    console.log('Email sent:', info.messageId);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

testEmail();