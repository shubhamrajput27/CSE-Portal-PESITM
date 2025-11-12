import express from 'express'
import {
  studentLogin,
  verifyStudentToken,
  getStudentProfile,
  studentLogout,
  changeStudentPassword,
  updateStudentProfile
} from '../controllers/studentAuthController.js'

const router = express.Router()

// Student authentication routes
router.post('/login', studentLogin)
router.get('/profile', verifyStudentToken, getStudentProfile)
router.post('/logout', verifyStudentToken, studentLogout)
router.post('/change-password', verifyStudentToken, changeStudentPassword)
router.put('/profile', verifyStudentToken, updateStudentProfile)

export default router
