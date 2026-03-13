import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ApplyDoctor from './pages/ApplyDoctor';
import Appointments from './pages/Appointments';
import Profile from './pages/Profile';
import DoctorsList from './pages/Admin/DoctorsList';
import UsersList from './pages/Admin/UsersList';
import BookAppointment from './pages/BookAppointment';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorProfile from './pages/Doctor/Profile';

function App() {
  const {loading} = useSelector(state => state.alerts);
  return (
    <BrowserRouter>
      {loading && (<div className='spinner-parent'>
        <div className="spinner-border" role="status">
        </div>
      </div>)}
      <Toaster
        position="top-center"
        reverseOrder={false}
      />

      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/apply-doctor" element={<ProtectedRoute><ApplyDoctor /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin/userslist" element={<ProtectedRoute><UsersList /></ProtectedRoute>} />
        <Route path="/admin/doctorslist" element={<ProtectedRoute><DoctorsList /></ProtectedRoute>} />
        <Route path="/book-appointment/:doctorId" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
        <Route path="/doctor/appointments" element={<ProtectedRoute><DoctorAppointments /></ProtectedRoute>} />
        <Route path="/doctor/profile" element={<ProtectedRoute><DoctorProfile /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;