# Quick Reference - Authentication System

## 🚀 Quick Start

### Login Pages
- **Admin**: `/admin`
- **Faculty**: `/faculty/login`
- **Student**: `/student/login`

### Dashboards (Protected)
- **Admin**: `/admin/dashboard`
- **Faculty**: `/faculty/dashboard`
- **Student**: `/student/dashboard`

## 📝 Code Snippets

### 1. Using Auth in Components

```jsx
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../utils/authUtils'

function MyComponent() {
  const { adminUser, logout, hasRole } = useAuth()
  
  return (
    <div>
      {adminUser && <p>Welcome, {adminUser.full_name}</p>}
      <button onClick={() => logout(ROLES.ADMIN)}>Logout</button>
    </div>
  )
}
```

### 2. Creating Protected Route

```jsx
<Route 
  path="/admin/dashboard" 
  element={
    <ProtectedRoute role={ROLES.ADMIN} redirectTo="/admin">
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

### 3. Login Handler

```jsx
const { login } = useAuth()

const handleLogin = async (credentials) => {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
  
  const data = await res.json()
  if (data.success) {
    login(ROLES.ADMIN, data.data.token, data.data.user)
  }
}
```

### 4. API Request with Auth

```jsx
import { getAuthHeaders } from '../utils/authUtils'
import { ROLES } from '../utils/authUtils'

fetch('/api/protected-endpoint', {
  headers: getAuthHeaders(ROLES.ADMIN)
})
```

### 5. Check Authentication Status

```jsx
import { isAuthenticated, ROLES } from '../utils/authUtils'

if (isAuthenticated(ROLES.ADMIN)) {
  // User is logged in
}
```

## 🎯 Common Tasks

### Add New Protected Route
1. Create route component
2. Import ProtectedRoute and ROLES
3. Wrap route with ProtectedRoute:
```jsx
<Route 
  path="/new-page" 
  element={
    <ProtectedRoute role={ROLES.ADMIN} redirectTo="/admin">
      <NewPage />
    </ProtectedRoute>
  } 
/>
```

### Add Logout Button
```jsx
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../utils/authUtils'

const { logout } = useAuth()

<button onClick={() => logout(ROLES.ADMIN)}>
  Logout
</button>
```

### Display User Info
```jsx
const { adminUser } = useAuth()

{adminUser && (
  <div>
    <p>{adminUser.full_name}</p>
    <p>{adminUser.email}</p>
  </div>
)}
```

### Redirect if Logged In
```jsx
useEffect(() => {
  if (hasRole(ROLES.ADMIN)) {
    navigate('/admin/dashboard')
  }
}, [hasRole, navigate])
```

## 🔧 Utility Functions

### authUtils.js

| Function | Description | Example |
|----------|-------------|---------|
| `isAuthenticated(role)` | Check if user is authenticated | `isAuthenticated(ROLES.ADMIN)` |
| `getCurrentUser(role)` | Get current user object | `getCurrentUser(ROLES.ADMIN)` |
| `getAuthToken(role)` | Get auth token | `getAuthToken(ROLES.ADMIN)` |
| `setAuthData(role, token, user)` | Store auth data | `setAuthData(ROLES.ADMIN, token, user)` |
| `clearAuthData(role)` | Clear auth data | `clearAuthData(ROLES.ADMIN)` |
| `getAuthHeaders(role)` | Get headers for API | `getAuthHeaders(ROLES.ADMIN)` |
| `validateSession(role)` | Validate session | `validateSession(ROLES.ADMIN)` |

## 🎨 Component Props

### ProtectedRoute
```jsx
<ProtectedRoute 
  role={ROLES.ADMIN}           // Required role
  redirectTo="/admin"          // Redirect path if not auth
>
  <YourComponent />
</ProtectedRoute>
```

### DashboardLayout
```jsx
<DashboardLayout
  title="Dashboard"            // Page title
  subtitle="Welcome back"      // Subtitle
  bgGradient="from-blue-600"   // Gradient class
  headerActions={<Button />}   // Header actions
>
  {/* Content */}
</DashboardLayout>
```

### StatCard
```jsx
<StatCard
  title="Total Users"          // Card title
  value={150}                  // Main value
  icon={<Users size={24} />}   // Icon component
  color="bg-blue-500"          // Color class
  trend="+12% from last month" // Trend text
  onClick={() => {}}           // Click handler
/>
```

## 📱 Role Constants

```jsx
import { ROLES } from '../utils/authUtils'

ROLES.ADMIN    // 'admin'
ROLES.FACULTY  // 'faculty'
ROLES.STUDENT  // 'student'
```

## 🔐 Storage Keys

- **Admin**: `adminToken`, `adminUser`
- **Faculty**: `facultyToken`, `facultyData`
- **Student**: `studentToken`, `studentData`

## ⚠️ Common Errors

### "Cannot read property of undefined"
→ Wrap app with AuthProvider

### "Redirect loop"
→ Check if role matches route protection

### "Token expired"
→ Token validation failed, user will be logged out

### "Network error"
→ Backend server not running

## 🌐 API Endpoints

| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/api/admin/login` | POST | `{username, password}` | `{success, data: {token, admin}}` |
| `/api/faculty-auth/login` | POST | `{identifier, password}` | `{success, data: {token, faculty}}` |
| `/api/student/login` | POST | `{identifier, password}` | `{success, data: {token, student}}` |

## 💡 Tips

1. **Always import ROLES** when checking authentication
2. **Use useAuth hook** for accessing auth state
3. **Wrap entire app** with AuthProvider in App.jsx
4. **Protected routes** redirect unauthenticated users
5. **Each role** has separate token and user data
6. **Logout** clears localStorage and redirects

---

For detailed documentation, see [AUTH_SYSTEM.md](./AUTH_SYSTEM.md)
