import { Navigate } from 'react-router-dom'
import { isAuthenticated } from '../utils/authUtils'
import LoadingSpinner from './LoadingSpinner'

/**
 * Protected Route Component
 * Wraps routes that require authentication
 * 
 * @param {string} role - Required role (admin, faculty, student)
 * @param {element} children - Child components to render if authenticated
 * @param {string} redirectTo - Path to redirect if not authenticated
 */
const ProtectedRoute = ({ role, children, redirectTo }) => {
  // Check if user is authenticated for the required role
  const authenticated = isAuthenticated(role)

  // If not authenticated, redirect to login
  if (!authenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // If authenticated, render children
  return children
}

export default ProtectedRoute
