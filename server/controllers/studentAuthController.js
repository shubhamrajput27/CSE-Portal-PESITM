import jwt from 'jsonwebtoken'
import Student from '../models/Student.js'

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'pesitm-cse-student-secret-key-2024'
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h'

// Generate JWT token
const generateToken = (studentId) => {
  return jwt.sign({ studentId, type: 'student' }, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

// Student Login
export const studentLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body

    // Validation
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'USN/Student ID and password are required'
      })
    }

    // Find student by USN, student ID, or email
    const student = await Student.findByIdentifier(identifier)
    
    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Check if account is active
    if (!student.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact administration.'
      })
    }

    // Check if account is locked
    if (Student.isAccountLocked(student)) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.'
      })
    }

    // Verify password
    const isPasswordValid = await Student.comparePassword(password, student.password_hash)
    
    if (!isPasswordValid) {
      // Increment failed login attempts
      await Student.incrementLoginAttempts(student.id)
      
      // Log failed login attempt
      const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']
      const userAgent = req.headers['user-agent']
      await Student.logActivity(student.id, 'login_failed', 'authentication', null, 
        { reason: 'invalid_password' }, clientIp, userAgent)
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Update last login and reset failed attempts
    await Student.updateLastLogin(student.id)

    // Generate JWT token
    const token = generateToken(student.id)

    // Log successful login
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']
    const userAgent = req.headers['user-agent']
    await Student.logActivity(student.id, 'login_success', 'authentication', null, 
      { login_time: new Date().toISOString() }, clientIp, userAgent)

    // Remove sensitive data
    const { password_hash, failed_login_attempts, locked_until, ...safeUserData } = student

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        student: safeUserData
      }
    })

  } catch (error) {
    console.error('Student Login Error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Verify Student Token
export const verifyStudentToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      })
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET)
    
    if (decoded.type !== 'student') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type'
      })
    }

    // Find student
    const student = await Student.findById(decoded.studentId)
    
    if (!student || !student.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or inactive student account'
      })
    }

    // Check if account is locked
    if (Student.isAccountLocked(student)) {
      return res.status(423).json({
        success: false,
        message: 'Student account is locked'
      })
    }

    // Add student info to request object
    req.student = student
    next()

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      })
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      })
    }

    console.error('Token Verification Error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Get Student Profile
export const getStudentProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        student: req.student
      }
    })
  } catch (error) {
    console.error('Get Student Profile Error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Student Logout
export const studentLogout = async (req, res) => {
  try {
    // Log logout activity
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']
    const userAgent = req.headers['user-agent']
    await Student.logActivity(req.student.id, 'logout', 'authentication', null, 
      { logout_time: new Date().toISOString() }, clientIp, userAgent)
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    console.error('Student Logout Error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Change Student Password
export const changeStudentPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const studentId = req.student.id

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      })
    }

    // Find student with password hash
    const student = await Student.findByIdentifier(req.student.usn)
    
    // Verify current password
    const isCurrentPasswordValid = await Student.comparePassword(currentPassword, student.password_hash)
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }

    // Update password
    await Student.changePassword(studentId, newPassword)

    // Log password change
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']
    const userAgent = req.headers['user-agent']
    await Student.logActivity(studentId, 'password_changed', 'account', studentId, 
      { changed_at: new Date().toISOString() }, clientIp, userAgent)

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    })

  } catch (error) {
    console.error('Change Student Password Error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Update Student Profile
export const updateStudentProfile = async (req, res) => {
  try {
    const { phone, address, profileImage } = req.body
    const studentId = req.student.id

    const updatedProfile = await Student.updateProfile(studentId, { phone, address, profileImage })

    // Log profile update
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']
    const userAgent = req.headers['user-agent']
    await Student.logActivity(studentId, 'profile_updated', 'account', studentId, 
      { updated_at: new Date().toISOString() }, clientIp, userAgent)

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        student: updatedProfile
      }
    })

  } catch (error) {
    console.error('Update Student Profile Error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}
