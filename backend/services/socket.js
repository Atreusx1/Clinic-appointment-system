const Appointment = require('../models/Appointment');
const { sendSMS, sendWhatsApp } = require('./notification');

const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinDoctorRoom', (doctorId) => {
      socket.join(doctorId);
      console.log(`Client joined doctor room: ${doctorId}`);
    });

    // Notify doctor of new appointment
    socket.on('newAppointment', async (appointmentId) => {
      const appointment = await Appointment.findById(appointmentId).populate('patientId doctorId');
      if (appointment) {
        io.to(appointment.doctorId._id.toString()).emit('appointmentUpdate', {
          message: `New appointment booked by ${appointment.patientId.name}`,
          appointment,
        });
      }
    });

    // Notify patient of status update
    socket.on('appointmentStatusUpdate', async ({ appointmentId, status }) => {
      const appointment = await Appointment.findById(appointmentId).populate('patientId doctorId');
      if (appointment) {
        io.to(appointment.patientId._id.toString()).emit('appointmentUpdate', {
          message: `Your appointment with Dr. ${appointment.doctorId.name} is now ${status}`,
          appointment,
        });
        if (status === 'missed') {
          await sendSMS(appointment.patientId.phone, `Your appointment with Dr. ${appointment.doctorId.name} was missed. Rescheduling...`);
          await sendWhatsApp(appointment.patientId.phone, `Your appointment with Dr. ${appointment.doctorId.name} was missed. Rescheduling...`);
        }
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

module.exports = { initSocket };