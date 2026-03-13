const mongoose = require('mongoose');
const Doctor = require('./models/doctorModel');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB', err));

const fixTimings = async () => {
    try {
        // Find all doctors with invalid timings
        const doctors = await Doctor.find({});
        
        console.log(`Found ${doctors.length} doctors`);
        
        for (let doctor of doctors) {
            // Check if timings are invalid (00:00 or empty)
            if (!doctor.timings || doctor.timings.length === 0 || 
                doctor.timings[0] === '00:00' || doctor.timings[0] === '') {
                
                // Set default timings (9 AM to 5 PM)
                doctor.timings = ['09:00', '17:00'];
                await doctor.save();
                
                console.log(`Fixed timings for Dr. ${doctor.firstName} ${doctor.lastName}`);
            } else {
                console.log(`Dr. ${doctor.firstName} ${doctor.lastName} has valid timings: ${doctor.timings[0]} - ${doctor.timings[1]}`);
            }
        }
        
        console.log('All doctor timings have been checked and fixed if needed');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing timings:', error);
        process.exit(1);
    }
};

fixTimings();
