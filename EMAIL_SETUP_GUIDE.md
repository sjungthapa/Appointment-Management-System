# Email Setup Guide for OTP Verification

This guide will help you set up Gmail to send OTP verification emails for user registration and password reset.

## Prerequisites
- A Gmail account
- Node.js and npm installed

## Step 1: Enable 2-Step Verification on Gmail

1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click on "2-Step Verification"
4. Follow the prompts to enable 2-Step Verification

## Step 2: Generate App Password

1. After enabling 2-Step Verification, go back to Security settings
2. Under "Signing in to Google", click on "App passwords"
3. You may need to sign in again
4. Select "Mail" for the app and "Other (Custom name)" for the device
5. Enter "StayHealthy App" as the custom name
6. Click "Generate"
7. Google will display a 16-character password - **COPY THIS PASSWORD**

## Step 3: Configure Environment Variables

1. Open the `.env` file in the root directory of your project
2. Update the following variables:

```env
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
```

Replace:
- `your-gmail-address@gmail.com` with your actual Gmail address
- `your-16-character-app-password` with the app password you generated (remove spaces)

Example:
```env
EMAIL_USER=stayhealthy2024@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

## Step 4: Test the Email Configuration

1. Start your backend server:
```bash
npm start
```

2. Try registering a new user with a real email address
3. Check your email inbox for the OTP verification code

## Troubleshooting

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"
- Make sure you've enabled 2-Step Verification
- Verify that you're using an App Password, not your regular Gmail password
- Check that there are no extra spaces in the EMAIL_PASSWORD

### Error: "self signed certificate in certificate chain"
Add this to your emailConfig.js transporter:
```javascript
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});
```

### Emails not being received
- Check your spam/junk folder
- Verify the EMAIL_USER is correct
- Make sure the recipient email is valid
- Check server logs for any error messages

### Rate Limiting
Gmail has sending limits:
- Free Gmail accounts: ~500 emails per day
- Google Workspace accounts: ~2000 emails per day

For production, consider using:
- SendGrid
- AWS SES
- Mailgun
- Twilio SendGrid

## Security Best Practices

1. **Never commit your .env file to version control**
   - Add `.env` to your `.gitignore` file
   
2. **Use environment-specific configurations**
   - Development: Use a test Gmail account
   - Production: Use a professional email service

3. **Rotate app passwords regularly**
   - Generate new app passwords every few months
   - Revoke old app passwords you're no longer using

## Alternative Email Services

If you prefer not to use Gmail, here are alternatives:

### SendGrid (Recommended for Production)
```bash
npm install @sendgrid/mail
```

### AWS SES
```bash
npm install aws-sdk
```

### Mailgun
```bash
npm install mailgun-js
```

## Features Implemented

✅ Email verification during registration
✅ OTP-based password reset
✅ Professional email templates
✅ 10-minute OTP expiration
✅ Automatic OTP cleanup
✅ Resend OTP functionality

## Support

If you encounter any issues:
1. Check the server console for error messages
2. Verify all environment variables are set correctly
3. Ensure your Gmail account has 2-Step Verification enabled
4. Test with a different email address

For more information, visit:
- Nodemailer Documentation: https://nodemailer.com/
- Gmail App Passwords: https://support.google.com/accounts/answer/185833
