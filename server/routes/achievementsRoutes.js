import express from 'express'
import {
  getAllAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement
} from '../controllers/achievementsController.js'
import { authenticateAdmin } from '../middleware/adminAuth.js'

const router = express.Router()

// Public routes
router.get('/', getAllAchievements)
router.get('/:id', getAchievementById)

// Admin protected routes
router.post('/', authenticateAdmin, createAchievement)
router.put('/:id', authenticateAdmin, updateAchievement)
router.delete('/:id', authenticateAdmin, deleteAchievement)

export default router
