import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAppointment } from '../services/api';
import styles from './PatientBooking.module.css';

function PatientBooking() {
  const [formData, setFormData] = useState({
    doctorId: '682823d9be0320e447bf7990', // Replace with dynamic selection
    date: '2025-05-20T00:00:00.000Z',
    time: '10:00 AM',
    name: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await bookAppointment(formData);
      alert('OTP sent to your email. Please verify.');
      navigate('/patient/verify-otp', { state: { email: formData.email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Book an Appointment</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="doctorId">Doctor ID</label>
          <input
            type="text"
            id="doctorId"
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date.split('T')[0]}
            onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value).toISOString() })}
            required
            aria-required="true"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="time">Time</label>
          <select
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            aria-required="true"
          >
            <option value="10:00 AM">10:00 AM</option>
            <option value="11:00 AM">11:00 AM</option>
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
}

export default PatientBooking;