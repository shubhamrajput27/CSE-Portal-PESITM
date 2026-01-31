import express from 'express';
import viewController from '../../controllers/student/viewController.js';
import studentAuth from '../../middleware/studentAuth.js';

const router = express.Router();

// All routes require student authentication
router.use(studentAuth);

// Student's own attendance
router.get('/attendance', viewController.getMyAttendance);
router.get('/attendance/summary', viewController.getMyAttendanceSummary);

// Student's own marks
router.get('/marks', viewController.getMyMarks);
router.get('/marks/summary', viewController.getMyMarksSummary);

// Student's mentor
router.get('/mentor', viewController.getMyMentor);

// Dashboard
router.get('/dashboard', viewController.getDashboardData);

export default router;
