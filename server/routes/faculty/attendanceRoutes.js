import express from 'express';
import attendanceController from '../../controllers/faculty/attendanceController.js';
import facultyAuth from '../../middleware/facultyAuth.js';

const router = express.Router();

// All routes require faculty authentication
router.use(facultyAuth);

// Mark attendance
router.post('/attendance', attendanceController.markAttendance);
router.post('/attendance/bulk', attendanceController.markBulkAttendance);

// Get attendance
router.get('/attendance/subject', attendanceController.getSubjectAttendance);
router.get('/attendance/student/:student_id', attendanceController.getStudentAttendance);
router.get('/attendance/student/:student_id/summary', attendanceController.getStudentAttendanceSummary);

// Faculty stats
router.get('/attendance/stats', attendanceController.getFacultyAttendanceStats);
router.get('/attendance/low', attendanceController.getLowAttendanceStudents);

// Update attendance
router.put('/attendance/:id', attendanceController.updateAttendance);

export default router;
