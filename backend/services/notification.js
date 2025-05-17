const nodemailer = require('nodemailer');

// Validate environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('Nodemailer configuration error: EMAIL_USER and EMAIL_PASS must be set in .env');
  throw new Error('Missing email credentials');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Nodemailer transporter verification failed:', error);
  } else {
    console.log('Nodemailer transporter is ready to send emails');
  }
});

// // Commented out Twilio SMS/WhatsApp code
// const twilio = require('twilio');
// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// const sendSMS = async (to, message) => {
//   try {
//     await client.messages.create({
//       body: message,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to,
//     });
//     console.log(`SMS sent to ${to}`);
//   } catch (err) {
//     console.error('SMS error:', err);
//   }
// };

// const sendWhatsApp = async (to, message) => {
//   try {
//     await client.messages.create({
//       body: message,
//       from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
//       to: `whatsapp:${to}`,
//     });
//     console.log(`WhatsApp message sent to ${to}`);
//   } catch (err) {
//     console.error('WhatsApp error:', err);
//   }
// };

const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`Error sending email to ${to}:`, err);
    throw err;
  }
};

const sendOTP = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Your OTP for Appointment Booking',
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });
    console.log(`OTP email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`Error sending OTP email to ${to}:`, err);
    throw err;
  }
};

module.exports = { sendEmail, sendOTP };