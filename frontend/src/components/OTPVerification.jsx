import { useState, useLocation } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyOTP } from '../services/api';
import styles from './OTPVerification.module.css';

function OTPVerification() {
  const [formData, setFormData] = useState({ email: '', otp: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) {
      setFormData((prev) => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await verifyOTP(formData);
      alert(`Appointment booked! Token: ${response.data.tokenNumber}`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    alert('Resend OTP not implemented yet.'); // Add resend logic if needed
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Verify OTP</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
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
            disabled={location.state?.email}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="otp">OTP</label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            required
            aria-required="true"
            maxLength="6"
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
        <button type="button" onClick={handleResend} className={styles.resend}>
          Resend OTP
        </button>
      </form>
    </div>
  );
}

export default OTPVerification;