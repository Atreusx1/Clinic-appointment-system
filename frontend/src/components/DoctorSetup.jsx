import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupDoctor } from '../services/api';
import styles from './DoctorSetup.module.css';

function DoctorSetup() {
  const [formData, setFormData] = useState({
    clinicDetails: { name: '', location: '', workingHours: '', fees: '' },
    appointmentSlots: [{ date: '', time: '', isBooked: false }],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name.includes('clinicDetails')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        clinicDetails: { ...formData.clinicDetails, [field]: value },
      });
    } else if (name.includes('appointmentSlots')) {
      const field = name.split('.')[2];
      const updatedSlots = [...formData.appointmentSlots];
      updatedSlots[index] = { ...updatedSlots[index], [field]: value };
      setFormData({ ...formData, appointmentSlots: updatedSlots });
    }
  };

  const addSlot = () => {
    setFormData({
      ...formData,
      appointmentSlots: [...formData.appointmentSlots, { date: '', time: '', isBooked: false }],
    });
  };

  const removeSlot = (index) => {
    setFormData({
      ...formData,
      appointmentSlots: formData.appointmentSlots.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await setupDoctor(formData);
      alert('Clinic setup complete!');
      navigate('/doctor/appointments');
    } catch (err) {
      setError(err.response?.data?.message || 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Setup Your Clinic</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h3>Clinic Details</h3>
          <div className={styles.field}>
            <label htmlFor="clinicDetails.name">Clinic Name</label>
            <input
              type="text"
              id="clinicDetails.name"
              name="clinicDetails.name"
              value={formData.clinicDetails.name}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="clinicDetails.location">Location</label>
            <input
              type="text"
              id="clinicDetails.location"
              name="clinicDetails.location"
              value={formData.clinicDetails.location}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="clinicDetails.workingHours">Working Hours</label>
            <input
              type="text"
              id="clinicDetails.workingHours"
              name="clinicDetails.workingHours"
              value={formData.clinicDetails.workingHours}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="clinicDetails.fees">Fees</label>
            <input
              type="number"
              id="clinicDetails.fees"
              name="clinicDetails.fees"
              value={formData.clinicDetails.fees}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>
        </div>
        <div className={styles.section}>
          <h3>Appointment Slots</h3>
          {formData.appointmentSlots.map((slot, index) => (
            <div key={index} className={styles.slot}>
              <div className={styles.field}>
                <label htmlFor={`appointmentSlots.${index}.date`}>Date</label>
                <input
                  type="date"
                  id={`appointmentSlots.${index}.date`}
                  name={`appointmentSlots.${index}.date`}
                  value={slot.date.split('T')[0] || ''}
                  onChange={(e) => handleChange(e, index)}
                  required
                  aria-required="true"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor={`appointmentSlots.${index}.time`}>Time</label>
                <input
                  type="time"
                  id={`appointmentSlots.${index}.time`}
                  name={`appointmentSlots.${index}.time`}
                  value={slot.time}
                  onChange={(e) => handleChange(e, index)}
                  required
                  aria-required="true"
                />
              </div>
              <button
                type="button"
                onClick={() => removeSlot(index)}
                className={styles.remove}
                disabled={formData.appointmentSlots.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addSlot} className={styles.add}>Add Slot</button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? 'Saving...' : 'Save Setup'}
        </button>
      </form>
    </div>
  );
}

export default DoctorSetup;