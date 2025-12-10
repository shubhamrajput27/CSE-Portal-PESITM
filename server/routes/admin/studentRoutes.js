import express from 'express'
import { authenticateAdmin } from '../../middleware/adminAuth.js'
import {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  toggleStudentStatus,
  bulkUpdateStudents,
  resetStudentPassword,
  deleteStudent
} from '../../controllers/admin/studentManagementController.js'

const router = express.Router()

// Apply admin authentication middleware to all routes
router.use(authenticateAdmin)

// Student management routes
router.get('/students', getAllStudents)
router.get('/students/:id', getStudentById)
router.post('/students', addStudent)
router.put('/students/:id', updateStudent)
router.patch('/students/:id/status', toggleStudentStatus)
router.post('/students/bulk-update', bulkUpdateStudents)
router.post('/students/:id/reset-password', resetStudentPassword)
router.delete('/students/:id', deleteStudent)

export default router
