import express from 'express'
import {
  adminLogin,
  verifyAdminToken,
  getAdminProfile,
  adminLogout,
  changeAdminPassword,
  updateAdminProfile,
  getAllAdminUsers
} from '../controllers/adminAuthPostgresController.js'
import { authLimiter } from '../middleware/rateLimiter.js'
import { adminLoginValidation, passwordChangeValidation } from '../middleware/validator.js'

const router = express.Router()

// Public routes
router.post('/login', authLimiter, adminLoginValidation, adminLogin)

// Protected routes (require authentication)
router.use(verifyAdminToken) // Apply middleware to all routes below

router.get('/profile', getAdminProfile)
router.put('/profile', updateAdminProfile)
router.post('/logout', adminLogout)
router.put('/change-password', passwordChangeValidation, changeAdminPassword)
router.get('/users', getAllAdminUsers) // Super admin only

export default router