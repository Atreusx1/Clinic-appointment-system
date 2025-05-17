import styles from './Home.module.css';

function Home() {
  return (
    <div className={styles.home}>
      <h1 className={styles.title}>Welcome to Doctor Appointment Booking</h1>
      <p className={styles.description}>
        Book appointments with ease, manage your clinic, or oversee the system as an admin.
      </p>
      <div className={styles.cta}>
        <a href="/patient/book" className={styles.button}>Book an Appointment</a>
        <a href="/doctor/register" className={styles.button}>Join as a Doctor</a>
      </div>
    </div>
  );
}

export default Home;