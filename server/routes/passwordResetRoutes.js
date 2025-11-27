import express from 'express'
import {
  requestPasswordReset,
  verifyOTP,
  resetPassword
} from '../controllers/passwordResetController.js'

const router = express.Router()

// Request password reset - Send OTP
router.post('/request-reset', requestPasswordReset)

// Verify OTP
router.post('/verify-otp', verifyOTP)

// Reset password
router.post('/reset-password', resetPassword)

export default router
