const express = require('express');
const router = express.Router();
const Doctor = require('../models/doctorModel');
const authMiddleware = require('../middlewares/authMiddleware');
const Appointment = require('../models/appointmentModel');
const User = require('../models/userModel');

// Apply for doctor account
router.post('/apply-doctor-account', authMiddleware, async (req, res) => {
    try {
        const newDoctor = new Doctor({ ...req.body, status: 'pending', userId: req.body.userId });
        await newDoctor.save();
        
        const adminUser = await User.findOne({ role: 'admin' });
        
        res.status(200).json({
            success: true,
            message: 'Doctor account applied successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error applying doctor account', success: false, error: error.message });
    }
});

// Get all approved doctors
router.get('/get-all-approved-doctors', authMiddleware, async (req, res) => {
    try {
        const doctors = await Doctor.find({ status: 'approved' });
        res.status(200).json({
            success: true,
            data: doctors
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctors', success: false, error: error.message });
    }
});

// Get doctor info by user id
router.post('/get-doctor-info-by-user-id', authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.body.userId });
        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctor info', success: false, error: error.message });
    }
});

// Get doctor info by id
router.post('/get-doctor-info-by-id', authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ _id: req.body.doctorId });
        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctor info', success: false, error: error.message });
    }
});

// Update doctor profile
router.post('/update-doctor-profile', authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOneAndUpdate(
            { userId: req.body.userId },
            req.body,
            { new: true }
        );
        res.status(200).json({
            success: true,
            message: 'Doctor profile updated successfully',
            data: doctor
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating doctor profile', success: false, error: error.message });
    }
});

module.exports = router;


// Get appointments for a doctor
router.get('/get-appointments-by-doctor-id', authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.body.userId });
        const appointments = await Appointment.find({ doctorId: doctor._id });
        res.status(200).json({
            success: true,
            data: appointments
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', success: false, error: error.message });
    }
});

// Change appointment status
router.post('/change-appointment-status', authMiddleware, async (req, res) => {
    try {
        const { appointmentId, status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status }, { new: true });
        
        res.status(200).json({
            success: true,
            message: 'Appointment status updated successfully',
            data: appointment
        });
    } catch (error) {
        res.status(500).json({ message: 'Error changing appointment status', success: false, error: error.message });
    }
});


// Get all approved doctors (public route - no auth required)
router.get('/get-all-approved-doctors-public', async (req, res) => {
    try {
        const doctors = await Doctor.find({ status: 'approved' });
        res.status(200).json({
            success: true,
            data: doctors
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctors', success: false, error: error.message });
    }
});
