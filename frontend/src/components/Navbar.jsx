import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <NavLink to="/">DoctorApp</NavLink>
      </div>
      <ul className={styles.navLinks}>
        <li><NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''}>Home</NavLink></li>
        {!user && (
          <>
            <li><NavLink to="/doctor/register" className={({ isActive }) => isActive ? styles.active : ''}>Doctor Register</NavLink></li>
            <li><NavLink to="/doctor/login" className={({ isActive }) => isActive ? styles.active : ''}>Doctor Login</NavLink></li>
            <li><NavLink to="/patient/book" className={({ isActive }) => isActive ? styles.active : ''}>Book Appointment</NavLink></li>
          </>
        )}
        {user?.role === 'doctor' && (
          <>
            <li><NavLink to="/doctor/setup" className={({ isActive }) => isActive ? styles.active : ''}>Setup Clinic</NavLink></li>
            <li><NavLink to="/doctor/appointments" className={({ isActive }) => isActive ? styles.active : ''}>Appointments</NavLink></li>
          </>
        )}
        {user?.role === 'superadmin' && (
          <li><NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? styles.active : ''}>Admin Dashboard</NavLink></li>
        )}
        {user && (
          <li>
            <button onClick={handleLogout} className={styles.logout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;