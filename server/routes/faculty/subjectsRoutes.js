import express from 'express'
import subjectsController from '../../controllers/faculty/subjectsController.js'
import facultyAuth from '../../middleware/facultyAuth.js'

const router = express.Router()

router.use(facultyAuth)

router.get('/subjects', subjectsController.getAssignedSubjects)

export default router