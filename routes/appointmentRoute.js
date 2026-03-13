const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointmentModel');
const Doctor = require('../models/doctorModel');
const User = require('../models/userModel');
const authMiddleware = require('../middlewares/authMiddleware');

// Book appointment
router.post('/book-appointment', authMiddleware, async (req, res) => {
    try {
        req.body.status = 'pending';
        req.body.date = req.body.date;
        req.body.time = req.body.time;
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();
        
        res.status(200).json({
            success: true,
            message: 'Appointment booked successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error booking appointment', success: false, error: error.message });
    }
});

// Check booking availability
router.post('/check-booking-availability', authMiddleware, async (req, res) => {
    try {
        const date = req.body.date;
        const time = req.body.time;
        const doctorId = req.body.doctorId;
        
        const appointments = await Appointment.findOne({
            doctorId,
            date,
            time
        });
        
        if (appointments) {
            return res.status(200).json({
                success: false,
                message: 'Appointment not available'
            });
        } else {
            return res.status(200).json({
                success: true,
                message: 'Appointment available'
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error checking availability', success: false, error: error.message });
    }
});

// Get appointments by user id
router.get('/get-appointments-by-user-id', authMiddleware, async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.body.userId });
        res.status(200).json({
            success: true,
            data: appointments
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', success: false, error: error.message });
    }
});

module.exports = router;
