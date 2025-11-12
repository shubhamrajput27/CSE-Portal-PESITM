import jwt from 'jsonwebtoken'
import FacultyUser from '../models/FacultyUser.js'

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'pesitm-cse-faculty-secret-key-2024'
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h'

// Generate JWT token
const generateToken = (facultyUserId) => {
  return jwt.sign({ facultyUserId, type: 'faculty' }, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

// Faculty Login
export const facultyLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body

    // Validation
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Faculty ID/Email and password are required'
      })
    }

    // Find faculty user by faculty ID or email
    const facultyUser = await FacultyUser.findByIdentifier(identifier)
    
    if (!facultyUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Check if account is active
    if (!facultyUser.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact administration.'
      })
    }

    // Check if account is locked
    if (FacultyUser.isAccountLocked(facultyUser)) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.'
      })
    }

    // Verify password
    const isPasswordValid = await FacultyUser.comparePassword(password, facultyUser.password_hash)
    
    if (!isPasswordValid) {
      // Increment failed login attempts
      await FacultyUser.incrementLoginAttempts(facultyUser.id)
      
      // Log failed login attempt
      const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']
      const userAgent = req.headers['user-agent']
      await FacultyUser.logActivity(facultyUser.id, 'login_failed', 'authentication', null, 
        { reason: 'invalid_password' }, clientIp, userAgent)
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Update last login and reset failed attempts
    await FacultyUser.updateLastLogin(facultyUser.id)

    // Generate JWT token
    const token = generateToken(facultyUser.id)

    // Log successful login
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']
    const userAgent = req.headers['user-agent']
    await FacultyUser.logActivity(facultyUser.id, 'login_success', 'authentication', null, 
      { login_time: new Date().toISOString() }, clientIp, userAgent)

    // Remove sensitive data
    const { password_hash, failed_login_attempts, locked_until, ...safeUserData } = facultyUser

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        faculty: safeUserData
      }
    })

  } catch (error) {
    console.error('Faculty Login Error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Verify Faculty Token
export const verifyFacultyToken = async (req, res, next) => {
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
    
    if (decoded.type !== 'faculty') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type'
      })
    }

    // Find faculty user
    const facultyUser = await FacultyUser.findById(decoded.facultyUserId)
    
    if (!facultyUser || !facultyUser.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or inactive faculty account'
      })
    }

    // Check if account is locked
    if (FacultyUser.isAccountLocked(facultyUser)) {
      return res.status(423).json({
        success: false,
        message: 'Faculty account is locked'
      })
    }

    // Add faculty info to request object
    req.faculty = facultyUser
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

// Get Faculty Profile
export const getFacultyProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        faculty: req.faculty
      }
    })
  } catch (error) {
    console.error('Get Faculty Profile Error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Faculty Logout
export const facultyLogout = async (req, res) => {
  try {
    // Log logout activity
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']
    const userAgent = req.headers['user-agent']
    await FacultyUser.logActivity(req.faculty.id, 'logout', 'authentication', null, 
      { logout_time: new Date().toISOString() }, clientIp, userAgent)
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    console.error('Faculty Logout Error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Change Faculty Password
export const changeFacultyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const facultyUserId = req.faculty.id

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

    // Find faculty user with password hash
    const facultyUser = await FacultyUser.findByIdentifier(req.faculty.faculty_id)
    
    // Verify current password
    const isCurrentPasswordValid = await FacultyUser.comparePassword(currentPassword, facultyUser.password_hash)
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }

    // Update password
    await FacultyUser.changePassword(facultyUserId, newPassword)

    // Log password change
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']
    const userAgent = req.headers['user-agent']
    await FacultyUser.logActivity(facultyUserId, 'password_changed', 'account', facultyUserId, 
      { changed_at: new Date().toISOString() }, clientIp, userAgent)

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    })

  } catch (error) {
    console.error('Change Faculty Password Error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Update Faculty Profile
export const updateFacultyProfile = async (req, res) => {
  try {
    const { phone, profileImage } = req.body
    const facultyUserId = req.faculty.id

    const updatedProfile = await FacultyUser.updateProfile(facultyUserId, { phone, profileImage })

    // Log profile update
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']
    const userAgent = req.headers['user-agent']
    await FacultyUser.logActivity(facultyUserId, 'profile_updated', 'account', facultyUserId, 
      { updated_at: new Date().toISOString() }, clientIp, userAgent)

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        faculty: updatedProfile
      }
    })

  } catch (error) {
    console.error('Update Faculty Profile Error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}
