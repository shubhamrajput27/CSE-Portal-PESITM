import express from 'express';
import studentsController from '../../controllers/faculty/studentsController.js';
import facultyAuth from '../../middleware/facultyAuth.js';

const router = express.Router();

// All routes require faculty authentication
router.use(facultyAuth);

// Get all students
router.get('/students', studentsController.getAllStudents);

// Get students by subject
router.get('/students/by-subject/:subject_id', studentsController.getStudentsBySubject);

// Get students by semester
router.get('/students/semester/:semester', studentsController.getStudentsBySemester);

export default router;
