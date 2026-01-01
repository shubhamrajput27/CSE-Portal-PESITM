import express from 'express'
import {
  requestPasswordReset,
  verifyOTP,
  resetPassword
} from '../controllers/passwordResetController.js'
import { passwordResetLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

// Request password reset - Send OTP
router.post('/request-reset', passwordResetLimiter, requestPasswordReset)

// Verify OTP
router.post('/verify-otp', passwordResetLimiter, verifyOTP)

// Reset password
router.post('/reset-password', passwordResetLimiter, resetPassword)

export default router
