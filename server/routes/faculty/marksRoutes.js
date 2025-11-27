import express from 'express';
import marksController from '../../controllers/faculty/marksController.js';
import facultyAuth from '../../middleware/facultyAuth.js';

const router = express.Router();

// All routes require faculty authentication
router.use(facultyAuth);

// Add marks
router.post('/marks', marksController.addMarks);
router.post('/marks/bulk', marksController.addBulkMarks);

// Get marks
router.get('/marks/student/:student_id', marksController.getStudentMarks);
router.get('/marks/student/:student_id/summary', marksController.getStudentMarksSummary);
router.get('/marks/subject', marksController.getSubjectMarks);

// Faculty stats and analytics
router.get('/marks/stats', marksController.getFacultyMarksStats);
router.get('/marks/top-performers', marksController.getTopPerformers);
router.get('/marks/analytics', marksController.getClassAnalytics);

// Update/Delete marks
router.put('/marks/:id', marksController.updateMarks);
router.delete('/marks/:id', marksController.deleteMarks);

export default router;
