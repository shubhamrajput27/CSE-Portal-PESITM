import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  isAuthenticated, 
  getCurrentUser, 
  setAuthData, 
  clearAuthData, 
  ROLES,
  validateSession
} from '../utils/authUtils'

// Create Auth Context
const AuthContext = createContext(null)

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null)
  const [facultyUser, setFacultyUser] = useState(null)
  const [studentUser, setStudentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      // Check and validate sessions
      if (validateSession(ROLES.ADMIN)) {
        setAdminUser(getCurrentUser(ROLES.ADMIN))
      }
      
      if (validateSession(ROLES.FACULTY)) {
        setFacultyUser(getCurrentUser(ROLES.FACULTY))
      }
      
      if (validateSession(ROLES.STUDENT)) {
        setStudentUser(getCurrentUser(ROLES.STUDENT))
      }
      
      setLoading(false)
    }

    initAuth()
  }, [])

  // Login function
  const login = (role, token, user) => {
    setAuthData(role, token, user)
    
    switch (role) {
      case ROLES.ADMIN:
        setAdminUser(user)
        navigate('/admin/dashboard')
        break
      case ROLES.FACULTY:
        setFacultyUser(user)
        navigate('/faculty/dashboard')
        break
      case ROLES.STUDENT:
        setStudentUser(user)
        navigate('/student/dashboard')
        break
      default:
        break
    }
  }

  // Logout function
  const logout = (role) => {
    clearAuthData(role)
    
    switch (role) {
      case ROLES.ADMIN:
        setAdminUser(null)
        break
      case ROLES.FACULTY:
        setFacultyUser(null)
        break
      case ROLES.STUDENT:
        setStudentUser(null)
        break
      default:
        break
    }
    
    // Always redirect to main login page
    navigate('/login')
  }

  // Check if user has specific role
  const hasRole = (role) => {
    return isAuthenticated(role)
  }

  const value = {
    // State
    adminUser,
    facultyUser,
    studentUser,
    loading,
    
    // Functions
    login,
    logout,
    hasRole,
    
    // Role constants
    ROLES
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
