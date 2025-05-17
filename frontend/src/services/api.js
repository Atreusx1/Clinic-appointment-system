import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const registerDoctor = (data) => api.post('/api/doctor/register', data);
export const loginDoctor = (data) => api.post('/api/doctor/login', data);
export const setupDoctor = (data) => api.post('/api/doctor/setup', data);
export const getAppointments = () => api.get('/api/doctor/appointments');
export const updateAppointmentStatus = (id, status) => api.put(`/api/doctor/appointments/${id}`, { status });
export const bookAppointment = (data) => api.post('/api/patient/book', data);
export const verifyOTP = (data) => api.post('/api/patient/verify-otp', data);
export const approveDoctor = (id) => api.put(`/api/admin/approve-doctor/${id}`);
export const getAnalytics = () => api.get('/api/admin/analytics');

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/doctor/login';
    }
    return Promise.reject(error);
  }
);

export default api;