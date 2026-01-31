import express from 'express';
import menteesController from '../../controllers/faculty/menteesController.js';
import facultyAuth from '../../middleware/facultyAuth.js';

const router = express.Router();

// Get all mentees for logged in faculty
router.get('/mentees', facultyAuth, menteesController.getMyMentees);

export default router;
