import pool from '../config/database.js'
import { generateOTP, sendOTPEmail, sendPasswordResetConfirmation } from '../utils/emailService.js'
import bcrypt from 'bcrypt'

// OTP storage (in production, use Redis or database)
const otpStore = new Map()

// OTP expiry time (10 minutes)
const OTP_EXPIRY = 10 * 60 * 1000

/**
 * Request Password Reset - Send OTP
 */
export const requestPasswordReset = async (req, res) => {
  try {
    const { email, role } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      })
    }

    let user = null
    let tableName = ''
    let userName = ''

    // Check which role and get user
    switch (role) {
      case 'admin':
        tableName = 'admin_users'
        const adminResult = await pool.query(
          'SELECT id, email, full_name FROM admin_users WHERE email = $1 AND is_active = true',
          [email]
        )
        user = adminResult.rows[0]
        userName = user?.full_name || 'Admin'
        break

      case 'faculty':
        tableName = 'faculty_users'
        const facultyResult = await pool.query(
          'SELECT id, email, full_name FROM faculty_users WHERE email = $1',
          [email]
        )
        user = facultyResult.rows[0]
        userName = user?.full_name || 'Faculty'
        break

      case 'student':
        tableName = 'students'
        const studentResult = await pool.query(
          'SELECT id, email, full_name FROM students WHERE email = $1',
          [email]
        )
        user = studentResult.rows[0]
        userName = user?.full_name || 'Student'
        break

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid role specified'
        })
    }

    if (!user) {
      // Don't reveal if email exists for security
      return res.status(200).json({
        success: true,
        message: 'If the email exists, an OTP has been sent to your email address'
      })
    }

    // Generate OTP
    const otp = generateOTP()
    const expiryTime = Date.now() + OTP_EXPIRY

    // Store OTP with email and role as key
    const otpKey = `${role}:${email}`
    otpStore.set(otpKey, {
      otp,
      expiryTime,
      userId: user.id,
      attempts: 0
    })

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, userName)

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again later.'
      })
    }

    res.status(200).json({
      success: true,
      message: 'OTP has been sent to your email address',
      data: {
        email,
        expiresIn: '10 minutes'
      }
    })

  } catch (error) {
    console.error('Request password reset error:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request'
    })
  }
}

/**
 * Verify OTP
 */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, role } = req.body

    if (!email || !otp || !role) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, and role are required'
      })
    }

    const otpKey = `${role}:${email}`
    const storedOTPData = otpStore.get(otpKey)

    if (!storedOTPData) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired. Please request a new one.'
      })
    }

    // Check if OTP expired
    if (Date.now() > storedOTPData.expiryTime) {
      otpStore.delete(otpKey)
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      })
    }

    // Check attempts
    if (storedOTPData.attempts >= 3) {
      otpStore.delete(otpKey)
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      })
    }

    // Verify OTP
    if (storedOTPData.otp !== otp) {
      storedOTPData.attempts++
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${3 - storedOTPData.attempts} attempts remaining.`
      })
    }

    // OTP verified successfully
    // Generate a temporary reset token
    const resetToken = `${Date.now()}-${Math.random().toString(36).substring(7)}`
    storedOTPData.resetToken = resetToken
    storedOTPData.verified = true

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        resetToken
      }
    })

  } catch (error) {
    console.error('Verify OTP error:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred while verifying OTP'
    })
  }
}

/**
 * Reset Password
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword, role } = req.body

    if (!email || !resetToken || !newPassword || !role) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      })
    }

    const otpKey = `${role}:${email}`
    const storedOTPData = otpStore.get(otpKey)

    if (!storedOTPData || !storedOTPData.verified || storedOTPData.resetToken !== resetToken) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      })
    }

    // Hash new password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(newPassword, saltRounds)

    // Update password in database
    let updateQuery = ''
    let userName = ''

    switch (role) {
      case 'admin':
        updateQuery = 'UPDATE admin_users SET password_hash = $1, updated_at = NOW() WHERE id = $2 RETURNING full_name, email'
        break
      case 'faculty':
        updateQuery = 'UPDATE faculty_users SET password_hash = $1, updated_at = NOW() WHERE id = $2 RETURNING full_name, email'
        break
      case 'student':
        updateQuery = 'UPDATE students SET password_hash = $1, updated_at = NOW() WHERE id = $2 RETURNING full_name, email'
        break
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid role'
        })
    }

    const result = await pool.query(updateQuery, [passwordHash, storedOTPData.userId])

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const user = result.rows[0]
    userName = user.full_name

    // Clear OTP data
    otpStore.delete(otpKey)

    // Send confirmation email
    await sendPasswordResetConfirmation(email, userName)

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.'
    })

  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred while resetting password'
    })
  }
}

/**
 * Clean up expired OTPs (run periodically)
 */
export const cleanupExpiredOTPs = () => {
  const now = Date.now()
  for (const [key, value] of otpStore.entries()) {
    if (now > value.expiryTime) {
      otpStore.delete(key)
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredOTPs, 5 * 60 * 1000)

export default {
  requestPasswordReset,
  verifyOTP,
  resetPassword,
  cleanupExpiredOTPs
}
