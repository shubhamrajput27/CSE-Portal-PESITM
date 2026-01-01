import express from 'express'
import {
  studentLogin,
  verifyStudentToken,
  getStudentProfile,
  studentLogout,
  changeStudentPassword,
  updateStudentProfile
} from '../controllers/studentAuthController.js'
import { authLimiter } from '../middleware/rateLimiter.js'
import { loginValidation, passwordChangeValidation } from '../middleware/validator.js'

const router = express.Router()

// Student authentication routes
router.post('/login', authLimiter, loginValidation, studentLogin)
router.get('/profile', verifyStudentToken, getStudentProfile)
router.post('/logout', verifyStudentToken, studentLogout)
router.put('/change-password', verifyStudentToken, passwordChangeValidation, changeStudentPassword)
router.put('/profile', verifyStudentToken, updateStudentProfile)

export default router
