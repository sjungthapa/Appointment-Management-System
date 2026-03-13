# Quick Start Guide

## Setup Instructions

### 1. Install Dependencies

#### Backend
```bash
npm install
```

#### Frontend
```bash
cd client
npm install
cd ..
```

### 2. Configure Environment

The `.env` file is already configured with:
```
MONGO_URL = 'mongodb://localhost:27017/stayhealthy'
JWT_SECRET = "Stayhealthy"
```

Make sure MongoDB is running on your system.

### 3. Create Admin Account

Run the seed script to create an admin account:
```bash
npm run seed-admin
```

This will create an admin account with:
- Email: `admin@stayhealthy.com`
- Password: `admin123`

### 4. Start the Application

#### Terminal 1 - Start Backend Server
```bash
npm start
```
Server will run on http://localhost:5000

#### Terminal 2 - Start Frontend
```bash
cd client
npm start
```
Frontend will run on http://localhost:3000

## Testing the Application

### As a Regular User:

1. Go to http://localhost:3000/register
2. Register a new account
3. Login with your credentials
4. Browse available doctors on the home page
5. Click on a doctor to book an appointment
6. Select date and time, check availability, and book
7. View your appointments in the Appointments page
8. Apply to become a doctor from the Apply Doctor page

### As Admin:

1. Login with admin credentials:
   - Email: `admin@stayhealthy.com`
   - Password: `admin123`
2. View all users from the Users menu
3. View all doctors from the Doctors menu
4. Approve or reject doctor applications
5. Once approved, the user becomes a doctor

### As a Doctor:

1. After your doctor application is approved by admin
2. Logout and login again to see the doctor menu
3. View your appointments in the Appointments page
4. Approve or reject patient appointments
5. Update your profile from the Profile page

## Features Overview

### User Features:
- ✅ User registration and authentication
- ✅ Browse available doctors
- ✅ Book appointments with doctors
- ✅ View appointment history
- ✅ Apply to become a doctor
- ✅ User profile management

### Doctor Features:
- ✅ Apply for doctor account
- ✅ Manage doctor profile
- ✅ Set availability timings
- ✅ View appointments
- ✅ Approve/reject appointments

### Admin Features:
- ✅ Approve/reject doctor applications
- ✅ View all users
- ✅ View all doctors
- ✅ Manage doctor status

## Troubleshooting

### MongoDB Connection Error
Make sure MongoDB is running:
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

### Port Already in Use
If port 5000 or 3000 is already in use, you can change it:
- Backend: Edit `PORT` in `.env` file
- Frontend: Create `.env` file in client folder with `PORT=3001`

### Module Not Found
Make sure you've installed all dependencies:
```bash
npm install
cd client
npm install
```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   │   ├── Admin/      # Admin pages
│   │   │   └── Doctor/     # Doctor pages
│   │   └── redux/          # Redux store
├── config/                 # Configuration files
├── middlewares/           # Express middlewares
├── models/                # Mongoose models
├── routes/                # API routes
├── server.js              # Express server
└── seedAdmin.js           # Admin seed script
```

## Next Steps

After completing the setup, you can:
1. Create multiple user accounts
2. Apply for doctor accounts
3. Approve doctors as admin
4. Book appointments as users
5. Manage appointments as doctors

Enjoy using the Doctor Appointment Management System!
