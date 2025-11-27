// Authentication utility functions

// Role constants
export const ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty',
  STUDENT: 'student'
}

// Local storage keys
const STORAGE_KEYS = {
  [ROLES.ADMIN]: {
    token: 'adminToken',
    user: 'adminUser'
  },
  [ROLES.FACULTY]: {
    token: 'facultyToken',
    user: 'facultyData'
  },
  [ROLES.STUDENT]: {
    token: 'studentToken',
    user: 'studentData'
  }
}

/**
 * Check if user is authenticated for a specific role
 * @param {string} role - User role (admin, faculty, student)
 * @returns {boolean}
 */
export const isAuthenticated = (role) => {
  const keys = STORAGE_KEYS[role]
  if (!keys) return false
  
  const token = localStorage.getItem(keys.token)
  const user = localStorage.getItem(keys.user)
  
  return !!(token && user)
}

/**
 * Get current user data for a specific role
 * @param {string} role - User role (admin, faculty, student)
 * @returns {object|null}
 */
export const getCurrentUser = (role) => {
  const keys = STORAGE_KEYS[role]
  if (!keys) return null
  
  try {
    const user = localStorage.getItem(keys.user)
    return user ? JSON.parse(user) : null
  } catch (error) {
    console.error('Error parsing user data:', error)
    return null
  }
}

/**
 * Get auth token for a specific role
 * @param {string} role - User role (admin, faculty, student)
 * @returns {string|null}
 */
export const getAuthToken = (role) => {
  const keys = STORAGE_KEYS[role]
  if (!keys) return null
  
  return localStorage.getItem(keys.token)
}

/**
 * Store authentication data
 * @param {string} role - User role
 * @param {string} token - Auth token
 * @param {object} user - User data
 */
export const setAuthData = (role, token, user) => {
  const keys = STORAGE_KEYS[role]
  if (!keys) return
  
  localStorage.setItem(keys.token, token)
  localStorage.setItem(keys.user, JSON.stringify(user))
}

/**
 * Clear authentication data for a specific role
 * @param {string} role - User role
 */
export const clearAuthData = (role) => {
  const keys = STORAGE_KEYS[role]
  if (!keys) return
  
  localStorage.removeItem(keys.token)
  localStorage.removeItem(keys.user)
}

/**
 * Logout user and redirect
 * @param {string} role - User role
 * @param {function} navigate - React router navigate function
 */
export const logout = (role, navigate) => {
  clearAuthData(role)
  
  // Redirect to appropriate login page
  const loginRoutes = {
    [ROLES.ADMIN]: '/admin',
    [ROLES.FACULTY]: '/faculty/login',
    [ROLES.STUDENT]: '/student/login'
  }
  
  navigate(loginRoutes[role] || '/login')
}

/**
 * Get authorization headers for API requests
 * @param {string} role - User role
 * @returns {object}
 */
export const getAuthHeaders = (role) => {
  const token = getAuthToken(role)
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

/**
 * Check if token is expired (basic check)
 * Note: This is a simple implementation. For production, use JWT decode
 * @param {string} token - JWT token
 * @returns {boolean}
 */
export const isTokenExpired = (token) => {
  if (!token) return true
  
  try {
    // Basic JWT structure check
    const parts = token.split('.')
    if (parts.length !== 3) return true
    
    // Decode payload
    const payload = JSON.parse(atob(parts[1]))
    
    // Check expiration
    if (payload.exp) {
      return Date.now() >= payload.exp * 1000
    }
    
    return false
  } catch (error) {
    console.error('Error checking token expiration:', error)
    return true
  }
}

/**
 * Validate session for a role
 * @param {string} role - User role
 * @returns {boolean}
 */
export const validateSession = (role) => {
  const token = getAuthToken(role)
  
  if (!token || isTokenExpired(token)) {
    clearAuthData(role)
    return false
  }
  
  return isAuthenticated(role)
}
