import { useState, useEffect } from 'react';
import { approveDoctor, getAnalytics } from '../services/api';
import styles from './AdminDashboard.module.css';

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analyticsResponse = await getAnalytics();
        setAnalytics(analyticsResponse.data);
        // Mock fetching pending doctors (replace with actual API if implemented)
        setDoctors([
          { _id: '682823d9be0320e447bf7990', name: 'Dr. John Doe', email: 'john.doe@example.com', isApproved: false },
        ]);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveDoctor(id);
      setDoctors(doctors.map((doc) => (doc._id === id ? { ...doc, isApproved: true } : doc)));
      alert('Doctor approved!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve doctor');
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Admin Dashboard</h2>
      <div className={styles.analytics}>
        <div className={styles.card}>
          <h3>Total Doctors</h3>
          <p>{analytics?.totalDoctors || 0}</p>
        </div>
        <div className={styles.card}>
          <h3>Total Appointments</h3>
          <p>{analytics?.totalAppointments || 0}</p>
        </div>
        <div className={styles.card}>
          <h3>Active Subscriptions</h3>
          <p>{analytics?.activeSubscriptions || 0}</p>
        </div>
      </div>
      <h3 className={styles.subtitle}>Pending Doctor Approvals</h3>
      {doctors.length === 0 ? (
        <p className={styles.empty}>No pending approvals.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc._id}>
                <td>{doc.name}</td>
                <td>{doc.email}</td>
                <td>
                  {!doc.isApproved && (
                    <button
                      onClick={() => handleApprove(doc._id)}
                      className={styles.approve}
                      aria-label={`Approve doctor ${doc.name}`}
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;