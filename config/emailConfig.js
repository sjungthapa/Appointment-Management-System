const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Check if email is enabled
const isEmailEnabled = () => {
    return process.env.ENABLE_EMAIL === 'true';
};

// Send OTP email
const sendOTPEmail = async (email, otp, name) => {
    // If email is disabled, just log the OTP and return success
    if (!isEmailEnabled()) {
        console.log('\n===========================================');
        console.log('📧 EMAIL DISABLED - DEVELOPMENT MODE');
        console.log('===========================================');
        console.log(`Email: ${email}`);
        console.log(`Name: ${name}`);
        console.log(`OTP: ${otp}`);
        console.log('===========================================\n');
        return true;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification - StayHealthy',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: rgb(12, 100, 100); margin: 0;">StayHealthy</h1>
                        <p style="color: #666; margin-top: 10px;">Doctor Appointment Management System</p>
                    </div>
                    
                    <h2 style="color: #333; margin-bottom: 20px;">Email Verification</h2>
                    
                    <p style="color: #666; font-size: 16px; line-height: 1.6;">
                        Hello ${name || 'User'},
                    </p>
                    
                    <p style="color: #666; font-size: 16px; line-height: 1.6;">
                        Thank you for registering with StayHealthy. To complete your registration, please use the following verification code:
                    </p>
                    
                    <div style="background-color: #f0f9f9; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                        <h1 style="color: rgb(12, 100, 100); font-size: 36px; letter-spacing: 8px; margin: 0;">
                            ${otp}
                        </h1>
                    </div>
                    
                    <p style="color: #666; font-size: 14px; line-height: 1.6;">
                        This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                    
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        © 2024 StayHealthy. All rights reserved.
                    </p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

// Send password reset email
const sendPasswordResetEmail = async (email, otp, name) => {
    // If email is disabled, just log the OTP and return success
    if (!isEmailEnabled()) {
        console.log('\n===========================================');
        console.log('📧 EMAIL DISABLED - DEVELOPMENT MODE');
        console.log('===========================================');
        console.log(`Email: ${email}`);
        console.log(`Name: ${name}`);
        console.log(`Password Reset OTP: ${otp}`);
        console.log('===========================================\n');
        return true;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset - StayHealthy',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: rgb(12, 100, 100); margin: 0;">StayHealthy</h1>
                        <p style="color: #666; margin-top: 10px;">Doctor Appointment Management System</p>
                    </div>
                    
                    <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
                    
                    <p style="color: #666; font-size: 16px; line-height: 1.6;">
                        Hello ${name || 'User'},
                    </p>
                    
                    <p style="color: #666; font-size: 16px; line-height: 1.6;">
                        We received a request to reset your password. Use the following code to proceed:
                    </p>
                    
                    <div style="background-color: #f0f9f9; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                        <h1 style="color: rgb(12, 100, 100); font-size: 36px; letter-spacing: 8px; margin: 0;">
                            ${otp}
                        </h1>
                    </div>
                    
                    <p style="color: #666; font-size: 14px; line-height: 1.6;">
                        This code will expire in 10 minutes. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                    
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        © 2024 StayHealthy. All rights reserved.
                    </p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = {
    generateOTP,
    sendOTPEmail,
    sendPasswordResetEmail,
    isEmailEnabled
};
