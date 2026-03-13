const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const OTP = require("../models/otpModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const { generateOTP, sendOTPEmail, sendPasswordResetEmail } = require("../config/emailConfig");
require("dotenv").config();

// ✅ Debugging Log (Remove later)
console.log("JWT_SECRET:", process.env.JWT_SECRET);

// Send OTP for registration
router.post("/send-otp", async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required", success: false });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: "Email already exists", success: false });
        }

        // Generate OTP
        const otp = generateOTP();

        // Delete any existing OTPs for this email
        await OTP.deleteMany({ email, type: 'registration' });

        // Save OTP to database
        const newOTP = new OTP({
            email,
            otp,
            type: 'registration'
        });
        await newOTP.save();

        // Send OTP email
        const emailSent = await sendOTPEmail(email, otp, name);

        if (!emailSent) {
            return res.status(500).json({ message: "Failed to send OTP email", success: false });
        }

        res.status(200).json({ message: "OTP sent to your email", success: true });
    } catch (error) {
        res.status(500).json({ message: "Server error", success: false, error: error.message });
    }
});

// User Registration Route with OTP verification
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, otp } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password || !otp) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        // Verify OTP
        const otpRecord = await OTP.findOne({ email, otp, type: 'registration' });
        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid or expired OTP", success: false });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: "Email already exists", success: false });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        // Delete the used OTP
        await OTP.deleteOne({ _id: otpRecord._id });

        res.status(201).json({ message: "User registered successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: "Server error", success: false, error: error.message });
    }
});

// User Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if all fields are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required", success: false });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User does not exist", success: false });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password", success: false });
        }

        // Ensure JWT_SECRET is set
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT_SECRET is not defined", success: false });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({
            message: "Login successful",
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", success: false, error: error.message });
    }
});

router.post('/get-user-info-by-id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        } else {
            return res.status(200).json({
                success: true,
                data: {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isDoctor: user.isDoctor,
                    profilePicture: user.profilePicture,
                    _id: user._id
                }
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", success: false, error: error.message });
    }
});

module.exports = router;


// Update user profile
router.post('/update-user-profile', authMiddleware, async (req, res) => {
    try {
        const { userId, name, email, password } = req.body;

        // Check if email is already taken by another user
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(409).json({ message: "Email already exists", success: false });
            }
        }

        const updateData = { name, email };

        // Handle profile picture
        if (req.body.profilePicture) {
            updateData.profilePicture = req.body.profilePicture;
        }

        // Only update password if provided
        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                name: user.name,
                email: user.email,
                role: user.role,
                isDoctor: user.isDoctor,
                profilePicture: user.profilePicture,
                _id: user._id
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", success: false, error: error.message });
    }
});


// Send OTP for password reset
router.post('/send-reset-otp', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required", success: false });
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "Email not found", success: false });
        }

        // Generate OTP
        const otp = generateOTP();

        // Delete any existing OTPs for this email
        await OTP.deleteMany({ email, type: 'password-reset' });

        // Save OTP to database
        const newOTP = new OTP({
            email,
            otp,
            type: 'password-reset'
        });
        await newOTP.save();

        // Send OTP email
        const emailSent = await sendPasswordResetEmail(email, otp, user.name);

        if (!emailSent) {
            return res.status(500).json({ message: "Failed to send OTP email", success: false });
        }

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email",
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", success: false, error: error.message });
    }
});

// Verify email for password reset (deprecated - use send-reset-otp instead)
router.post('/verify-email', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required", success: false });
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "Email not found", success: false });
        }

        return res.status(200).json({
            success: true,
            message: "Email verified",
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", success: false, error: error.message });
    }
});

// Reset password with OTP
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        if (!email || !otp || !password) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters", success: false });
        }

        // Verify OTP
        const otpRecord = await OTP.findOne({ email, otp, type: 'password-reset' });
        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid or expired OTP", success: false });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.findByIdAndUpdate(user._id, { password: hashedPassword });

        // Delete the used OTP
        await OTP.deleteOne({ _id: otpRecord._id });

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", success: false, error: error.message });
    }
});
