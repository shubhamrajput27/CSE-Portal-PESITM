import express from 'express'
import { authenticateAdmin } from '../../middleware/adminAuth.js'
import {
  getAllFaculty,
  addFaculty,
  updateFaculty,
  toggleFacultyStatus,
  assignMentor,
  getFacultyWorkload,
  deleteFaculty
} from '../../controllers/admin/facultyManagementController.js'

const router = express.Router()

// Apply admin authentication middleware to all routes
router.use(authenticateAdmin)

// Faculty management routes
router.get('/faculty', getAllFaculty)
router.post('/faculty', addFaculty)
router.put('/faculty/:id', updateFaculty)
router.patch('/faculty/:id/status', toggleFacultyStatus)
router.get('/faculty/:id/workload', getFacultyWorkload)
router.delete('/faculty/:id', deleteFaculty)

// Mentor assignment
router.post('/faculty/assign-mentor', assignMentor)

export default router
