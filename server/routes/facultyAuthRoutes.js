import express from 'express'
import {
  facultyLogin,
  verifyFacultyToken,
  getFacultyProfile,
  facultyLogout,
  changeFacultyPassword,
  updateFacultyProfile
} from '../controllers/facultyAuthController.js'
import { authLimiter } from '../middleware/rateLimiter.js'
import { loginValidation, passwordChangeValidation } from '../middleware/validator.js'

const router = express.Router()

// Faculty authentication routes
router.post('/login', authLimiter, loginValidation, facultyLogin)
router.get('/profile', verifyFacultyToken, getFacultyProfile)
router.post('/logout', verifyFacultyToken, facultyLogout)
router.put('/change-password', verifyFacultyToken, passwordChangeValidation, changeFacultyPassword)
router.put('/profile', verifyFacultyToken, updateFacultyProfile)

export default router
