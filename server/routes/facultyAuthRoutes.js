import express from 'express'
import {
  facultyLogin,
  verifyFacultyToken,
  getFacultyProfile,
  facultyLogout,
  changeFacultyPassword,
  updateFacultyProfile
} from '../controllers/facultyAuthController.js'

const router = express.Router()

// Faculty authentication routes
router.post('/login', facultyLogin)
router.get('/profile', verifyFacultyToken, getFacultyProfile)
router.post('/logout', verifyFacultyToken, facultyLogout)
router.post('/change-password', verifyFacultyToken, changeFacultyPassword)
router.put('/profile', verifyFacultyToken, updateFacultyProfile)

export default router
