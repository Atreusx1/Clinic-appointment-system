# Doctor Appointment Booking Software

This project is a full-stack web application for booking doctor appointments. It allows patients to book appointments with OTP verification, doctors to manage their clinics and appointments, and admins to approve doctors and view analytics. The backend is built with Node.js, Express, and MongoDB, using Nodemailer for email notifications and cookie-based JWT authentication. The frontend is built with Vite, React, Tailwind CSS, and module.css, providing a responsive and user-friendly interface.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Patient Features**:
  - Book appointments with available doctors.
  - Verify bookings via email OTP.
- **Doctor Features**:
  - Register and set up clinic details and appointment slots.
  - View and update appointment statuses (confirmed, cancelled, missed).
- **Admin Features**:
  - Approve doctor registrations.
  - View system analytics (total doctors, appointments, subscriptions).
- **Technical Features**:
  - Backend: RESTful API, MongoDB, JWT cookie authentication, Nodemailer for emails.
  - Frontend: Vite + React, Tailwind CSS, module.css, WebSocket for real-time updates.
  - Responsive and accessible UI with ARIA attributes.

## Prerequisites
Ensure you have the following installed:
- **Node.js** (v18 or higher): [Download](https://nodejs.org/)
- **MongoDB** (local or MongoDB Atlas): [Download](https://www.mongodb.com/try/download/community)
- **Git**: [Download](https://git-scm.com/)
- **Gmail Account**: For Nodemailer (with App Password enabled).
- A code editor like VS Code.

## Project Structure
```
doctor-appointment/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── docs/
│   ├── .env
│   ├── server.js
│   ├── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   ├── .env
│   ├── vite.config.js
│   ├── package.json
├── README.md
```

## Backend Setup
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd doctor-appointment/backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Create a `.env` file in `backend/` with the following:
     ```env
     PORT=3000
     MONGO_URI=mongodb://localhost:27017/doctor-appointment
     JWT_SECRET=your_jwt_secret_key
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_app_specific_password
     ```
   - **MONGO_URI**: Use `mongodb://localhost:27017/doctor-appointment` for local MongoDB or your Atlas URI.
   - **JWT_SECRET**: A random string (e.g., `mysecretkey123`).
   - **EMAIL_USER**: Your Gmail address.
   - **EMAIL_PASS**: Generate a Gmail App Password:
     - Enable 2-Step Verification in your Google Account.
     - Go to Security > App Passwords > Select “Mail” > Select “Other” > Generate.
     - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`) without spaces.

4. **Setup MongoDB**:
   - Start MongoDB locally: `mongod`
   - Or use MongoDB Atlas and update `MONGO_URI` in `.env`.
   - Create a database named `doctor-appointment`.

5. **Insert Admin User**:
   - Create a file `insertAdmin.js` in `backend/`:
     ```javascript
     const mongoose = require('mongoose');
     const bcrypt = require('bcryptjs');
     const Doctor = require('./models/Doctor');

     mongoose.connect('mongodb://localhost:27017/doctor-appointment', { useNewUrlParser: true, useUnifiedTopology: true })
       .then(async () => {
         const hashedPassword = await bcrypt.hash('admin123', 10);
         await Doctor.create({
           name: 'Super Admin',
           email: 'admin@example.com',
           password: hashedPassword,
           role: 'superadmin',
           isApproved: true,
         });
         console.log('Admin user created');
         mongoose.connection.close();
       })
       .catch(err => console.error(err));
     ```
   - Run: `node insertAdmin.js`
   - Verify in MongoDB: `use doctor-appointment; db.doctors.find({ email: "admin@example.com" })`

## Frontend Setup
1. **Navigate to Frontend Directory**:
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Create a `.env` file in `frontend/` with:
     ```env
     VITE_API_URL=http://localhost:3000
     ```

4. **Configure Tailwind CSS**:
   - Ensure `tailwind.config.js` is set up:
     ```javascript
     /** @type {import('tailwindcss').Config} */
     export default {
       content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
       theme: { extend: {} },
       plugins: [],
     };
     ```
   - Verify `src/index.css` includes Tailwind directives:
     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```

## Running the Application
1. **Start MongoDB**:
   - Run: `mongod` (if using local MongoDB).
   - Ensure MongoDB is accessible at `mongodb://localhost:27017`.

2. **Run the Backend**:
   - Navigate to `backend/`:
     ```bash
     cd backend
     npm start
     ```
   - Verify console output:
     ```
     MongoDB connected
     Nodemailer transporter is ready to send emails
     Server running on port 3000
     ```
   - The backend will be available at `http://localhost:3000`.

3. **Run the Frontend**:
   - In a new terminal, navigate to `frontend/`:
     ```bash
     cd frontend
     npm run dev
     ```
   - Open `http://localhost:5173` (default Vite port).
   - The frontend will proxy API requests to `http://localhost:3000` (configured in `vite.config.js`).

4. **Access Swagger UI** (Optional):
   - Open `http://localhost:3000/api-docs` to view the API documentation and test endpoints.

## Testing
### Backend Testing (via Swagger UI or Postman)
1. **Doctor Registration**:
   - **Endpoint**: `POST /api/doctor/register`
   - **Body**:
     ```json
     {
       "name": "Dr. John Doe",
       "email": "john.doe@example.com",
       "password": "securepassword123",
       "subscriptionPlan": "premium"
     }
     ```
   - **Expected**: `201` with `{ "message": "Doctor registered, awaiting approval" }`

2. **Admin Login**:
   - **Endpoint**: `POST /api/doctor/login`
   - **Body**:
     ```json
     {
       "email": "admin@example.com",
       "password": "admin123"
     }
     ```
   - **Expected**: `200` with `{ "message": "Login successful", "doctorId": "...", "role": "superadmin" }`

3. **Approve Doctor**:
   - **Endpoint**: `PUT /api/admin/approve-doctor/{id}`
   - Use the doctor’s `_id` from MongoDB (`db.doctors.find()`).
   - **Expected**: `200` with `{ "message": "Doctor approved" }`

4. **Book Appointment**:
   - **Endpoint**: `POST /api/patient/book`
   - **Body**:
     ```json
     {
       "doctorId": "682823d9be0320e447bf7990",
       "date": "2025-05-20T00:00:00.000Z",
       "time": "10:00 AM",
       "name": "Jane Smith",
       "email": "anishkadam68@gmail.com"
     }
     ```
   - **Expected**: `200` with `{ "message": "OTP sent to your email..." }`
   - Check `anishkadam68@gmail.com` for OTP.

5. **Verify OTP**:
   - **Endpoint**: `POST /api/patient/verify-otp`
   - **Body**:
     ```json
     {
       "email": "anishkadam68@gmail.com",
       "otp": "<received_otp>"
     }
     ```
   - **Expected**: `200` with `{ "message": "Appointment booked", "tokenNumber": 1234 }`

### Frontend Testing
1. **Home Page**:
   - Open `http://localhost:5173`.
   - Verify navbar links: Home, Doctor Register, Doctor Login, Book Appointment.
   - Click “Book an Appointment” to navigate to `/patient/book`.

2. **Doctor Flow**:
   - Register at `/doctor/register` (e.g., “Dr. John Doe”, “john.doe@example.com”).
   - Log in as admin at `/doctor/login` (`admin@example.com`, `admin123`).
   - Approve the doctor at `/admin/dashboard`.
   - Log in as the doctor, set up clinic at `/doctor/setup`, and view appointments at `/doctor/appointments`.

3. **Patient Flow**:
   - Go to `/patient/book`, enter details (use a valid `doctorId` from MongoDB), and submit.
   - Check email for OTP, verify at `/patient/verify-otp`, and confirm appointment.

4. **Admin Flow**:
   - Log in as admin, view analytics, and approve pending doctors at `/admin/dashboard`.

## Troubleshooting
### Backend Issues
- **MongoDB Connection**:
  - Error: `MongoServerError`
  - Fix: Ensure MongoDB is running (`mongod`) and `MONGO_URI` is correct.
- **Nodemailer Errors**:
  - Error: `Missing credentials for "PLAIN"`
  - Fix: Verify `EMAIL_USER` and `EMAIL_PASS` in `.env`. Regenerate Gmail App Password.
  - Test: Run `node scripts/testemail.js` (see previous responses).
- **CORS Issues**:
  - Fix: Ensure `cors` middleware in `server.js` allows `origin: '*'`.

### Frontend Issues
- **API Errors**:
  - Error: `401 Unauthorized`
  - Fix: Ensure backend is running and JWT cookie is sent (handled by `withCredentials` in `api.js`).
- **Styling Issues**:
  - Fix: Verify Tailwind is configured (`tailwind.config.js`, `index.css`).
- **WebSocket Issues**:
  - Fix: Ensure `socket.io` is set up in `server.js` (see previous response for code).

### General
- Check console logs in the browser (F12) and backend terminal.
- Verify `doctorId` and slots in MongoDB: `db.doctors.find()`, `db.appointments.find()`.
- If issues persist, share error logs with the project maintainers.

## Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add feature"`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request.

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.