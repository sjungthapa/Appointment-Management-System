# Doctor Appointment Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing doctor appointments in Nepal.

## 🌟 Features

### User Features
- ✅ User registration with email OTP verification
- ✅ Secure login with JWT authentication
- ✅ Browse available doctors
- ✅ Book appointments with doctors
- ✅ View appointment history
- ✅ Apply to become a doctor
- ✅ Profile management with photo upload
- ✅ Password reset with OTP

### Doctor Features
- ✅ Apply for doctor account
- ✅ Manage doctor profile
- ✅ Set availability timings
- ✅ View and manage appointments
- ✅ Approve/reject patient appointments

### Admin Features
- ✅ Approve/reject doctor applications
- ✅ View all users
- ✅ View all doctors
- ✅ Manage doctor status

## 🛠️ Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Nodemailer for email OTP

### Frontend
- React 18
- Redux Toolkit for state management
- React Router v6 for navigation
- Ant Design for UI components
- Axios for API calls
- React Hot Toast for notifications
- Moment.js for date/time handling

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Gmail account (for email OTP - optional)

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/appointment-management-system.git
cd appointment-management-system
```

### 2. Backend Setup

Install dependencies:
```bash
npm install
```

Create `.env` file from example:
```bash
cp .env.example .env
```

Update `.env` with your configuration:
```env
MONGO_URL=mongodb://localhost:27017/stayhealthy
JWT_SECRET=your_secure_jwt_secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
ENABLE_EMAIL=false
PORT=5000
```

**Note:** For development, keep `ENABLE_EMAIL=false`. OTPs will be printed in the console.

### 3. Frontend Setup

Navigate to client directory and install dependencies:
```bash
cd client
npm install
cd ..
```

### 4. Create Admin Account

Run the seed script to create an admin account:
```bash
npm run seed-admin
```

**Admin Credentials:**
- Email: `admin@stayhealthy.com`
- Password: `admin123`

## 🏃 Running the Application

### Start Backend Server
```bash
npm start
```
Server runs on http://localhost:5000

### Start Frontend (in a new terminal)
```bash
cd client
npm start
```
Frontend runs on http://localhost:3000

## 📧 Email Configuration (Optional)

For production, enable email OTP verification:

1. **Enable 2-Step Verification** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account → Security → App passwords
   - Create password for "Mail" app
   - Copy the 16-character password

3. **Update .env:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
ENABLE_EMAIL=true
```

4. Restart the server

See `EMAIL_SETUP_GUIDE.md` for detailed instructions.

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── pages/          # Page components
│       │   ├── Admin/      # Admin pages
│       │   └── Doctor/     # Doctor pages
│       └── redux/          # Redux store
├── config/                 # Configuration files
│   ├── dbConfig.js        # Database configuration
│   └── emailConfig.js     # Email configuration
├── middlewares/           # Express middlewares
│   └── authMiddleware.js  # JWT authentication
├── models/                # Mongoose models
│   ├── userModel.js
│   ├── doctorModel.js
│   ├── appointmentModel.js
│   └── otpModel.js
├── routes/                # API routes
│   ├── userRoute.js
│   ├── doctorRoute.js
│   ├── adminRoute.js
│   └── appointmentRoute.js
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore file
├── server.js             # Express server entry point
└── seedAdmin.js          # Admin seed script
```

## 🔑 API Endpoints

### User Routes
- `POST /api/user/send-otp` - Send OTP for registration
- `POST /api/user/register` - Register with OTP
- `POST /api/user/login` - User login
- `POST /api/user/get-user-info-by-id` - Get user info
- `POST /api/user/update-user-profile` - Update profile
- `POST /api/user/send-reset-otp` - Send password reset OTP
- `POST /api/user/reset-password` - Reset password with OTP

### Doctor Routes
- `POST /api/doctor/apply-doctor-account` - Apply for doctor
- `GET /api/doctor/get-all-approved-doctors` - Get approved doctors
- `POST /api/doctor/get-doctor-info-by-id` - Get doctor info
- `POST /api/doctor/update-doctor-profile` - Update doctor profile
- `GET /api/doctor/get-appointments-by-doctor-id` - Get doctor appointments
- `POST /api/doctor/change-appointment-status` - Update appointment status

### Admin Routes
- `GET /api/admin/get-all-doctors` - Get all doctors
- `GET /api/admin/get-all-users` - Get all users
- `POST /api/admin/change-doctor-status` - Approve/reject doctor

### Appointment Routes
- `POST /api/appointment/book-appointment` - Book appointment
- `POST /api/appointment/check-booking-availability` - Check availability
- `GET /api/appointment/get-appointments-by-user-id` - Get user appointments

## 💡 Usage

### As a User:
1. Register with email OTP verification
2. Login with credentials
3. Browse available doctors
4. Click on a doctor to book appointment
5. Select date and time
6. View appointments in Appointments page

### As a Doctor:
1. Register as user first
2. Apply to become a doctor
3. Wait for admin approval
4. After approval, manage your profile
5. View and manage patient appointments

### As an Admin:
1. Login with admin credentials
2. View all users and doctors
3. Approve/reject doctor applications
4. Manage system

## 🌐 Currency

The system uses **Nepali Rupees (Rs.)** as the default currency.

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Email OTP verification
- Protected API routes
- Input validation
- Secure password reset

## 📝 Development Mode

For testing without email setup:
- Set `ENABLE_EMAIL=false` in `.env`
- OTPs will be printed in server console
- Copy OTP from console and use in app

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name - [Your GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Ant Design for UI components
- MongoDB for database
- React community for amazing tools

---

**Note:** Remember to change default admin password and JWT secret in production!
