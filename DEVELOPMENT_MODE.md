# Development Mode - Email Bypass

For testing purposes, you can disable email sending and see OTPs in the console instead.

## Quick Setup (No Email Configuration Needed)

1. Open `.env` file
2. Set `ENABLE_EMAIL` to `false`:

```env
MONGO_URL = 'mongodb://localhost:27017/stayhealthy'
JWT_SECRET = "Stayhealthy"
EMAIL_USER = "your-email@gmail.com"
EMAIL_PASSWORD = "your-app-password"
ENABLE_EMAIL = "false"
```

3. Restart your server

## How It Works

When `ENABLE_EMAIL = "false"`:
- No actual emails are sent
- OTP codes are displayed in the server console
- You can copy the OTP from console and use it in the app

## Example Console Output

When a user registers, you'll see:
```
===========================================
📧 EMAIL DISABLED - DEVELOPMENT MODE
===========================================
Email: user@example.com
Name: John Doe
OTP: 123456
===========================================
```

Simply copy the OTP (123456) and paste it in the verification form!

## For Production

When you're ready to use real emails:

1. Follow the EMAIL_SETUP_GUIDE.md to set up Gmail
2. Update `.env`:
```env
EMAIL_USER = your-real-email@gmail.com
EMAIL_PASSWORD = your-app-password-from-gmail
ENABLE_EMAIL = "true"
```
3. Restart your server

## Testing Flow

### Registration:
1. Fill in registration form
2. Click "Send OTP"
3. Check server console for OTP
4. Copy OTP and paste in verification field
5. Complete registration

### Password Reset:
1. Enter email on forgot password page
2. Click "Send OTP"
3. Check server console for OTP
4. Copy OTP and paste in verification field
5. Set new password

This way you can test the complete OTP flow without setting up email!
