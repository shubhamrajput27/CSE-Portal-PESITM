import express from 'express';
import subjectManagementController from '../../controllers/admin/subjectManagementController.js';
import adminAuth from '../../middleware/adminAuth.js';

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

// Subject CRUD routes
router.get('/subjects', subjectManagementController.getAllSubjects);
router.get('/subjects/:id', subjectManagementController.getSubjectById);
router.post('/subjects', subjectManagementController.addSubject);
router.put('/subjects/:id', subjectManagementController.updateSubject);
router.delete('/subjects/:id', subjectManagementController.deleteSubject);

// Subject assignment
router.post('/subjects/assign', subjectManagementController.assignSubjectToFaculty);

// Get subjects by semester
router.get('/subjects/semester/:semester', subjectManagementController.getSubjectsBySemester);

// Upload syllabus (will need multer middleware)
// router.post('/subjects/:id/syllabus', upload.single('syllabus'), subjectManagementController.uploadSyllabus);

export default router;
