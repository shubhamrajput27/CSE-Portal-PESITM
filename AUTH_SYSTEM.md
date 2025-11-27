# Three-Role Authentication System

## Overview

This CSE Portal features a comprehensive, secure three-role authentication system with:
- **Admin** - Full system access and management
- **Faculty** - Department faculty portal access
- **Student** - Student portal access

## Architecture

### Clean, Modular Structure

```
client/src/
├── utils/
│   └── authUtils.js          # Authentication utility functions
├── context/
│   └── AuthContext.jsx       # Global auth state management
├── components/
│   ├── ProtectedRoute.jsx    # Route protection wrapper
│   ├── DashboardLayout.jsx   # Reusable dashboard layout
│   └── StatCard.jsx          # Statistics card component
├── pages/
│   ├── AdminLogin.jsx        # Admin login page
│   ├── AdminDashboard.jsx    # Admin dashboard
│   ├── FacultyLogin.jsx      # Faculty login page
│   ├── FacultyDashboard.jsx  # Faculty dashboard
│   ├── StudentLogin.jsx      # Student login page
│   └── StudentDashboard.jsx  # Student dashboard
└── App.jsx                   # Main app with protected routes
```

## Features

### 🔐 Authentication Features

1. **Secure Token-Based Authentication**
   - JWT token storage in localStorage
   - Token expiration validation
   - Automatic session management

2. **Role-Based Access Control (RBAC)**
   - Three distinct user roles
   - Protected routes for each role
   - Automatic redirects based on authentication status

3. **Modern Login UI**
   - Consistent design across all login pages
   - Animated transitions using Framer Motion
   - Real-time form validation
   - Password visibility toggle
   - Comprehensive error handling
   - Loading states and user feedback

4. **Context-Based State Management**
   - Centralized auth state using React Context
   - Global access to user data
   - Seamless logout across the application

### 🎨 UI/UX Features

- **Responsive Design** - Works on all device sizes
- **Modern TailwindCSS** - Clean, professional styling
- **Smooth Animations** - Framer Motion for delightful interactions
- **Loading States** - Clear feedback during async operations
- **Error Messages** - User-friendly error displays

## Usage

### For Developers

#### 1. Using Authentication Context

```jsx
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../utils/authUtils'

function MyComponent() {
  const { adminUser, facultyUser, studentUser, logout, hasRole } = useAuth()

  // Check if user has specific role
  if (hasRole(ROLES.ADMIN)) {
    // Admin-specific logic
  }

  // Logout
  const handleLogout = () => {
    logout(ROLES.ADMIN) // or ROLES.FACULTY, ROLES.STUDENT
  }

  return <div>...</div>
}
```

#### 2. Creating Protected Routes

```jsx
import ProtectedRoute from './components/ProtectedRoute'
import { ROLES } from './utils/authUtils'

<Route 
  path="/admin/dashboard" 
  element={
    <ProtectedRoute role={ROLES.ADMIN} redirectTo="/admin">
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

#### 3. Login Flow

```jsx
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../utils/authUtils'

function LoginPage() {
  const { login } = useAuth()

  const handleSubmit = async (credentials) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
    
    const data = await response.json()
    
    if (data.success) {
      login(ROLES.ADMIN, data.token, data.user)
    }
  }
}
```

#### 4. Using Auth Utilities

```jsx
import { 
  isAuthenticated, 
  getCurrentUser, 
  getAuthToken,
  getAuthHeaders,
  ROLES 
} from '../utils/authUtils'

// Check authentication
if (isAuthenticated(ROLES.ADMIN)) {
  // User is authenticated
}

// Get current user
const user = getCurrentUser(ROLES.ADMIN)

// Get auth token
const token = getAuthToken(ROLES.ADMIN)

// Get headers for API requests
const headers = getAuthHeaders(ROLES.ADMIN)

fetch('/api/data', { headers })
```

## API Integration

### Login Endpoints

- **Admin**: `POST /api/admin/login`
- **Faculty**: `POST /api/faculty-auth/login`
- **Student**: `POST /api/student/login`

### Expected Response Format

```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "full_name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    }
  },
  "message": "Login successful"
}
```

## Security Best Practices

### Implemented

✅ JWT token-based authentication  
✅ Token expiration validation  
✅ Protected routes with automatic redirects  
✅ Secure password handling (hidden by default)  
✅ HTTPS recommended for production  
✅ Token stored in localStorage (consider httpOnly cookies for production)

### Recommendations for Production

1. **Use httpOnly Cookies** - Store tokens in httpOnly cookies instead of localStorage
2. **Implement Refresh Tokens** - Add token refresh mechanism
3. **Add Rate Limiting** - Prevent brute force attacks
4. **Enable CORS** - Configure proper CORS policies
5. **Use HTTPS** - Always use HTTPS in production
6. **Add 2FA** - Consider implementing two-factor authentication
7. **Session Timeout** - Implement automatic session timeout
8. **Audit Logging** - Log all authentication attempts

## Role Capabilities

### Admin Dashboard
- ✅ Faculty Management (CRUD)
- ✅ Events Management (CRUD)
- ✅ News Management (CRUD)
- ✅ Notifications Management (CRUD)
- ✅ Research Management
- ✅ Achievements Management
- ✅ Full system access

### Faculty Dashboard
- ✅ View personal profile
- ✅ View department information
- ✅ Access faculty resources
- ✅ Update personal details
- ✅ View announcements

### Student Dashboard
- ✅ View personal profile
- ✅ View academic information
- ✅ Access student resources
- ✅ View announcements
- ✅ View events and news

## Components Reference

### AuthContext

**Provider**: Wraps the entire application to provide auth state

**Methods**:
- `login(role, token, user)` - Authenticate user
- `logout(role)` - Log out user
- `hasRole(role)` - Check if user has specific role

**State**:
- `adminUser` - Admin user object
- `facultyUser` - Faculty user object
- `studentUser` - Student user object
- `loading` - Loading state

### ProtectedRoute

**Props**:
- `role` - Required role (ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT)
- `children` - Components to render if authenticated
- `redirectTo` - Path to redirect if not authenticated

### DashboardLayout

**Props**:
- `title` - Page title
- `subtitle` - Page subtitle
- `headerActions` - Action buttons in header
- `bgGradient` - Background gradient class
- `children` - Main content

### StatCard

**Props**:
- `title` - Card title
- `value` - Main value to display
- `icon` - Icon component
- `color` - Background color class
- `trend` - Optional trend indicator
- `onClick` - Optional click handler

## Testing Credentials

For development/testing, use these credentials:

**Admin**:
- Username: admin
- Password: (check with backend)

**Faculty**:
- Faculty ID: (check with backend)
- Password: (check with backend)

**Student**:
- USN: (check with backend)
- Password: (check with backend)

## Troubleshooting

### "Unable to connect to server"
- Ensure backend server is running on `http://localhost:5000`
- Check network connectivity
- Verify CORS configuration

### "Invalid credentials"
- Verify username/password
- Check backend database for user records
- Ensure password hashing matches

### Automatic redirect not working
- Check if AuthProvider wraps the entire app
- Verify routes are properly configured
- Check localStorage for existing tokens

### Protected routes not working
- Ensure ProtectedRoute component is used correctly
- Verify role parameter matches user role
- Check token validity

## Future Enhancements

- [ ] Password reset functionality
- [ ] Remember me option
- [ ] Multi-factor authentication (MFA)
- [ ] Session management dashboard
- [ ] Activity logs
- [ ] Email verification
- [ ] Social login integration
- [ ] Biometric authentication

## License

© 2024 PESITM CSE Department. All rights reserved.

---

**Last Updated**: November 27, 2025  
**Version**: 1.0.0  
**Maintainer**: CSE Department IT Team
