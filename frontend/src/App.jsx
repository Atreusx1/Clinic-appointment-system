import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import DoctorRegister from './components/DoctorRegister.jsx';
import DoctorLogin from './components/DoctorLogin.jsx';
import DoctorSetup from './components/DoctorSetup.jsx';
import DoctorAppointments from './components/DoctorAppointments.jsx';
import PatientBooking from './components/PatientBooking.jsx';
import OTPVerification from './components/OTPVerification.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import styles from './App.module.css';

const socket = io(import.meta.env.VITE_API_URL, { withCredentials: true });

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    socket.on('appointmentUpdate', (data) => {
      alert(`Appointment update: ${data.message}`);
    });
    return () => socket.off('appointmentUpdate');
  }, []);

  return (
    <div className={styles.app}>
      <Navbar user={user} setUser={setUser} />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctor/register" element={<DoctorRegister />} />
          <Route path="/doctor/login" element={<DoctorLogin setUser={setUser} />} />
          <Route path="/doctor/setup" element={user?.role === 'doctor' ? <DoctorSetup /> : <Navigate to="/doctor/login" />} />
          <Route path="/doctor/appointments" element={user?.role === 'doctor' ? <DoctorAppointments /> : <Navigate to="/doctor/login" />} />
          <Route path="/patient/book" element={<PatientBooking />} />
          <Route path="/patient/verify-otp" element={<OTPVerification />} />
          <Route path="/admin/dashboard" element={user?.role === 'superadmin' ? <AdminDashboard /> : <Navigate to="/doctor/login" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;