const express = require('express');
const router = express.Router();
const Doctor = require('../models/doctorModel');
const User = require('../models/userModel');
const authMiddleware = require('../middlewares/authMiddleware');

// Get all doctors
router.get('/get-all-doctors', authMiddleware, async (req, res) => {
    try {
        const doctors = await Doctor.find({});
        res.status(200).json({
            success: true,
            data: doctors
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctors', success: false, error: error.message });
    }
});

// Get all users
router.get('/get-all-users', authMiddleware, async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', success: false, error: error.message });
    }
});

// Change doctor status
router.post('/change-doctor-status', authMiddleware, async (req, res) => {
    try {
        const { doctorId, status } = req.body;
        const doctor = await Doctor.findByIdAndUpdate(doctorId, { status }, { new: true });
        
        const user = await User.findOne({ _id: doctor.userId });
        
        // If doctor is approved, mark user as doctor
        if (status === 'approved') {
            await User.findByIdAndUpdate(user._id, { isDoctor: true });
        } else if (status === 'rejected') {
            await User.findByIdAndUpdate(user._id, { isDoctor: false });
        }
        
        res.status(200).json({
            success: true,
            message: 'Doctor status updated successfully',
            data: doctor
        });
    } catch (error) {
        res.status(500).json({ message: 'Error changing doctor status', success: false, error: error.message });
    }
});

module.exports = router;
