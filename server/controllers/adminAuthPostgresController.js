import jwt from 'jsonwebtoken'
import pkg from 'pg'
import AdminUser from '../models/AdminUserPostgres.js'

const { Pool } = pkg

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pesitm_cse_portal',
  password: process.env.DB_PASSWORD || 'admin123',
  port: process.env.DB_PORT || 5432,
})

// JWT Secret - In production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'pesitm-cse-admin-secret-key-2024'
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h'

// Generate JWT token
const generateToken = (adminId) => {
  return jwt.sign({ adminId, type: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      })
    }

    // Find admin user by username or email
    const adminUser = await AdminUser.findByUsernameOrEmail(username)
    
    if (!adminUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Check if account is active
    if (!adminUser.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact system administrator.'
      })
    }

    // Check if account is locked
    if (AdminUser.isAccountLocked(adminUser)) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.'
      })
    }

    // Verify password
    const isPasswordValid = await AdminUser.comparePassword(password, adminUser.password_hash)
    
    if (!isPasswordValid) {
      // Increment failed login attempts
      await AdminUser.incrementLoginAttempts(adminUser.id)
      
      // Log failed login attempt
      const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']
      const userAgent = req.headers['user-agent']
      await AdminUser.logActivity(adminUser.id, 'login_failed', 'authentication', null, 
        { reason: 'invalid_password' }, clientIp, userAgent)
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Update last login and reset failed attempts
    await AdminUser.updateLastLogin(adminUser.id)

    // Generate JWT token
    const token = generateToken(adminUser.id)

    // Create session in admin_sessions table
    const hashedToken = Buffer.from(token).toString('base64') // Simple hash for demo
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    const sessionQuery = `
      INSERT INTO admin_sessions (admin_id, token_hash, expires_at, is_active)
      VALUES ($1, $2, $3, true)
      RETURNING id
    `
    try {
      await pool.query(sessionQuery, [adminUser.id, hashedToken, expiresAt])
    } catch (sessionError) {
      console.log('Session creation note:', sessionError.message)
      // Continue even if session creation fails - don't block login
    }

    // Log successful login
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']
    const userAgent = req.headers['user-agent']
    await AdminUser.logActivity(adminUser.id, 'login_success', 'authentication', null, 
      { login_time: new Date().toISOString() }, clientIp, userAgent)

    // Remove sensitive data
    const { password_hash, failed_login_attempts, locked_until, ...safeUserData } = adminUser

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: safeUserData
      }
    })

  } catch (error) {
    console.error('Admin Login Error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Verify Admin Token
export const verifyAdminToken = async (req, res, next) => {
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
    
    if (decoded.type !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type'
      })
    }

    // Find admin user
    const adminUser = await AdminUser.findById(decoded.adminId)
    
    if (!adminUser || !adminUser.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or inactive admin account'
      })
    }

    // Check if account is locked
    if (AdminUser.isAccountLocked(adminUser)) {
      return res.status(423).json({
        success: false,
        message: 'Admin account is locked'
      })
    }

    // Add admin info to request object
    req.admin = adminUser
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

// Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        admin: req.admin
      }
    })
  } catch (error) {
    console.error('Get Admin Profile Error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Admin Logout
export const adminLogout = async (req, res) => {
  try {
    // Log logout activity
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']
    const userAgent = req.headers['user-agent']
    await AdminUser.logActivity(req.admin.id, 'logout', 'authentication', null, 
      { logout_time: new Date().toISOString() }, clientIp, userAgent)
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    console.error('Admin Logout Error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Change Admin Password
export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const adminId = req.admin.id

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

    // Find admin user with password hash
    const adminUser = await AdminUser.findByUsernameOrEmail(req.admin.username)
    
    // Verify current password
    const isCurrentPasswordValid = await AdminUser.comparePassword(currentPassword, adminUser.password_hash)
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }

    // Update password
    await AdminUser.changePassword(adminId, newPassword)

    // Log password change
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']
    const userAgent = req.headers['user-agent']
    await AdminUser.logActivity(adminId, 'password_changed', 'account', adminId, 
      { changed_at: new Date().toISOString() }, clientIp, userAgent)

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    })

  } catch (error) {
    console.error('Change Admin Password Error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Update Admin Profile
export const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin.id
    const { username, email } = req.body

    // Validation
    if (!username && !email) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (username or email) is required'
      })
    }

    // Check if username is already taken by another admin
    if (username) {
      const existingUser = await AdminUser.findByUsernameOrEmail(username)
      if (existingUser && existingUser.id !== adminId) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists'
        })
      }
    }

    // Check if email is already taken by another admin
    if (email) {
      const existingUser = await AdminUser.findByUsernameOrEmail(email)
      if (existingUser && existingUser.id !== adminId) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        })
      }
    }

    // Update profile
    const updatedData = {}
    if (username) updatedData.username = username
    if (email) updatedData.email = email

    await AdminUser.update(adminId, updatedData)

    // Get updated admin user
    const updatedAdmin = await AdminUser.findById(adminId)

    // Log activity
    const clientIp = req.ip || req.connection.remoteAddress
    const userAgent = req.headers['user-agent']
    await AdminUser.logActivity(adminId, 'profile_updated', 'account', adminId, 
      { updated_fields: Object.keys(updatedData) }, clientIp, userAgent)

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        admin: {
          id: updatedAdmin.id,
          username: updatedAdmin.username,
          email: updatedAdmin.email,
          role: updatedAdmin.role
        }
      }
    })

  } catch (error) {
    console.error('Update Admin Profile Error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Get All Admin Users (Super Admin only)
export const getAllAdminUsers = async (req, res) => {
  try {
    // Check if user is super admin
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Super admin privileges required.'
      })
    }

    const adminUsers = await AdminUser.getAll()

    res.status(200).json({
      success: true,
      data: {
        adminUsers
      }
    })

  } catch (error) {
    console.error('Get All Admin Users Error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}