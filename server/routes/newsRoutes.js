import express from 'express'
import {
  getAllNews,
  getAllNewsForAdmin,
  getFeaturedNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  getNewsCategories,
  searchNews
} from '../controllers/newsController.js'
import { verifyAdminToken } from '../controllers/adminAuthPostgresController.js'

const router = express.Router()

// Admin routes (require admin authentication) - MUST come before /:id route
router.get('/admin/all', verifyAdminToken, getAllNewsForAdmin)

// Public routes
router.get('/', getAllNews)
router.get('/featured', getFeaturedNews)
router.get('/categories', getNewsCategories)
router.get('/search', searchNews)
router.get('/:id', getNewsById)

// Protected routes (require admin authentication)
router.post('/', verifyAdminToken, createNews)
router.put('/:id', verifyAdminToken, updateNews)
router.delete('/:id', verifyAdminToken, deleteNews)

export default router