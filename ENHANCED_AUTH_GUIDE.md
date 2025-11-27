# Enhanced Authentication & Profile Management

## Features Implemented

### 1. **Forgot Password with Email OTP**
- **Three-step password reset process:**
  - Step 1: Enter email address
  - Step 2: Verify 6-digit OTP sent to email
  - Step 3: Set new password
- **Security features:**
  - OTP expires in 10 minutes
  - Maximum 3 OTP verification attempts
  - Automatic OTP cleanup every 5 minutes
  - Password hashing with bcrypt (10 salt rounds)

### 2. **Profile Pages for All Roles**
- **Admin Profile:** Username, Email, Role
- **Faculty Profile:** Name, Email, Department, Designation, Specialization
- **Student Profile:** Name, Email, USN, Branch, Semester, Section
- **Features:**
  - View profile information
  - Edit profile (inline editing)
  - Change password securely
  - Responsive design with animations

### 3. **Enhanced Security**
- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected routes with role-based access
- ✅ Session validation
- ✅ Auto-logout on token expiry

## File Structure

```
client/src/
├── pages/
│   ├── ForgotPassword.jsx        # Password reset flow (3 steps)
│   ├── AdminProfile.jsx          # Admin profile management
│   ├── FacultyProfile.jsx        # Faculty profile management
│   └── StudentProfile.jsx        # Student profile management
├── context/
│   └── AuthContext.jsx           # Global auth state
├── utils/
│   └── authUtils.js              # Auth helper functions
└── components/
    ├── ProtectedRoute.jsx        # Route protection
    └── DashboardLayout.jsx       # Reusable dashboard layout

server/
├── controllers/
│   ├── passwordResetController.js    # OTP and password reset logic
│   ├── adminAuthPostgresController.js # Admin auth + profile update
│   ├── facultyAuthController.js      # Faculty auth + profile update
│   └── studentAuthController.js      # Student auth + profile update
├── routes/
│   ├── passwordResetRoutes.js        # Password reset API routes
│   ├── adminAuthPostgresRoutes.js    # Admin API routes
│   ├── facultyAuthRoutes.js          # Faculty API routes
│   └── studentAuthRoutes.js          # Student API routes
├── utils/
│   └── emailService.js               # Email sending & OTP generation
└── .env.example                      # Environment variables template
```

## API Endpoints

### Password Reset
```
POST /api/password-reset/request-reset
  Body: { email, role }
  Response: { success, message }

POST /api/password-reset/verify-otp
  Body: { email, otp, role }
  Response: { success, data: { resetToken } }

POST /api/password-reset/reset-password
  Body: { email, resetToken, newPassword, role }
  Response: { success, message }
```

### Profile Management
```
GET  /api/admin/profile               # Get admin profile
PUT  /api/admin/profile               # Update admin profile
PUT  /api/admin/change-password       # Change admin password

GET  /api/faculty-auth/profile        # Get faculty profile
PUT  /api/faculty-auth/profile        # Update faculty profile
PUT  /api/faculty-auth/change-password # Change faculty password

GET  /api/student/profile             # Get student profile
PUT  /api/student/profile             # Update student profile
PUT  /api/student/change-password     # Change student password
```

## Routes

### Frontend Routes
```
Public:
  /forgot-password          # Password reset page

Admin:
  /admin                    # Admin login
  /admin/dashboard          # Admin dashboard (protected)
  /admin/profile            # Admin profile (protected)

Faculty:
  /faculty/login            # Faculty login
  /faculty/dashboard        # Faculty dashboard (protected)
  /faculty/profile          # Faculty profile (protected)

Student:
  /student/login            # Student login
  /student/dashboard        # Student dashboard (protected)
  /student/profile          # Student profile (protected)
```

## Setup Instructions

### 1. Environment Variables

Create `.env` file in the `server` directory:

```env
# Email Configuration (Required for OTP)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# JWT Configuration
JWT_SECRET=your-secure-secret-key
JWT_EXPIRY=24h

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pesitm_cse_portal
DB_USER=postgres
DB_PASSWORD=your_db_password
```

### 2. Gmail App Password Setup

**For OTP emails to work, you need a Gmail App Password:**

1. Enable 2-Factor Authentication on your Google account
2. Go to: https://myaccount.google.com/apppasswords
3. Select "Mail" and generate a password
4. Copy the 16-character password
5. Use it as `EMAIL_PASSWORD` in your `.env` file

### 3. Install Dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 4. Run the Application

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

## Usage Guide

### Forgot Password Flow

1. **Go to login page** (Admin/Faculty/Student)
2. **Click "Forgot Password?"** link
3. **Enter email address** and click "Send OTP"
4. **Check email** for 6-digit OTP (valid for 10 minutes)
5. **Enter OTP** and click "Verify OTP"
6. **Set new password** and click "Reset Password"
7. **Redirected to login** page

### Profile Management

1. **Login** to your dashboard
2. **Navigate to profile page:**
   - Admin: `/admin/profile`
   - Faculty: `/faculty/profile`
   - Student: `/student/profile`
3. **Edit Profile:**
   - Click "Edit Profile" button
   - Update your information
   - Click "Save Changes"
4. **Change Password:**
   - Click "Change Password" button
   - Enter current password
   - Enter new password (min 6 characters)
   - Confirm new password
   - Click "Update Password"

## Security Features

### Password Reset Security
- ✅ OTP expires in 10 minutes
- ✅ Maximum 3 verification attempts per OTP
- ✅ Reset token required after OTP verification
- ✅ Automatic cleanup of expired OTPs
- ✅ In-memory OTP storage (use Redis in production)

### Password Requirements
- Minimum 6 characters
- Hashed with bcrypt (10 salt rounds)
- Validated on both frontend and backend

### Authentication Security
- JWT tokens with 24-hour expiry
- Token validation on every protected route
- Auto-redirect on expired tokens
- Role-based access control

## Testing

### Test Forgot Password
1. Use a valid email address you have access to
2. Complete all 3 steps
3. Verify you can login with new password

### Test Profile Update
1. Login to any role
2. Navigate to profile page
3. Update information and verify changes persist
4. Change password and verify login with new password

## Troubleshooting

### OTP Not Received
- Check spam/junk folder
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
- Ensure Gmail App Password is used (not regular password)
- Check server console for email sending errors

### Profile Update Failed
- Verify JWT token is valid (not expired)
- Check if username/email already exists
- Check server console for database errors

### Password Change Failed
- Verify current password is correct
- Ensure new password meets requirements (min 6 characters)
- Check that new password and confirm password match

## Production Considerations

### Email Service
- **Current:** In-memory Map for OTP storage
- **Production:** Use Redis for distributed OTP storage
- **Why:** Multiple server instances need shared OTP storage

### Environment Variables
- Use strong, random JWT secrets
- Never commit `.env` file to version control
- Use environment-specific configurations

### Database
- Ensure password hashes are never logged
- Regular backups of user data
- Monitor failed login attempts

## Future Enhancements

- [ ] Multi-factor authentication (2FA)
- [ ] Password strength meter
- [ ] Account recovery questions
- [ ] Email verification on registration
- [ ] Activity log viewer in profile
- [ ] Profile picture upload
- [ ] Social login integration
- [ ] Remember me functionality

## Documentation

For more details, see:
- `AUTH_SYSTEM.md` - Complete authentication system documentation
- `QUICK_REFERENCE.md` - Quick developer reference
- `PROJECT_STRUCTURE.md` - Project structure guide

## Support

For issues or questions:
- Check server console logs
- Verify environment variables
- Review API responses in browser DevTools
- Check database connection

---

**Last Updated:** November 27, 2025
**Version:** 2.0.0
