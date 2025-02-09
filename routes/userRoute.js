const express = require('express');
const router = express.Router();
const User = require('../models/userModel')
const bcrypt = require("bcryptjs");

router.post('/register', async (req, res) => {

    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) 
            return res.status(409).json({ message: 'Email already exists', success: false });

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newuser = new User(req.body);
        await newuser.save();
        res.status(209).json({ message: 'User registered successfully' , success:true });
    } catch (error) {

        res.status(500).json({ message: 'Server error', success: false });
    }
})

router.post('/login', async (req, res) => {

    try {

    } catch (error) {

    }
})

module.exports = router;