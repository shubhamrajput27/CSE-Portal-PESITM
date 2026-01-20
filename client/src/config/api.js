// API Configuration
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const trimmedUrl = rawApiUrl.replace(/\/+$/, '')
const API_BASE_URL = trimmedUrl.endsWith('/api') ? trimmedUrl : `${trimmedUrl}/api`

export const API_ENDPOINTS = {
  // Auth endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/admin/login`,
  ADMIN_PROFILE: `${API_BASE_URL}/admin/profile`,
  ADMIN_LOGOUT: `${API_BASE_URL}/admin/logout`,
  
  STUDENT_LOGIN: `${API_BASE_URL}/student/login`,
  STUDENT_PROFILE: `${API_BASE_URL}/student/profile`,
  STUDENT_LOGOUT: `${API_BASE_URL}/student/logout`,
  
  FACULTY_LOGIN: `${API_BASE_URL}/faculty-auth/login`,
  FACULTY_PROFILE: `${API_BASE_URL}/faculty-auth/profile`,
  FACULTY_LOGOUT: `${API_BASE_URL}/faculty-auth/logout`,
  
  // Password reset
  PASSWORD_RESET_REQUEST: `${API_BASE_URL}/password-reset/request-reset`,
  PASSWORD_RESET_VERIFY: `${API_BASE_URL}/password-reset/verify-otp`,
  PASSWORD_RESET: `${API_BASE_URL}/password-reset/reset-password`,
  
  // Public endpoints
  FACULTY: `${API_BASE_URL}/faculty`,
  EVENTS: `${API_BASE_URL}/events`,
  NEWS: `${API_BASE_URL}/news`,
  RESEARCH: `${API_BASE_URL}/research`,
  ACHIEVEMENTS: `${API_BASE_URL}/achievements`,
  
  // Contact
  CONTACT: `${API_BASE_URL}/contact`,

  // Faculty utilities
  FACULTY_SUBJECTS: `${API_BASE_URL}/faculty/subjects`,
  FACULTY_STUDENTS_BY_SUBJECT: `${API_BASE_URL}/faculty/students/by-subject`,
  FACULTY_MARKS_BULK: `${API_BASE_URL}/faculty/marks/bulk`,
}

export default API_BASE_URL
