import express from 'express';
import searchController from '../../controllers/common/searchController.js';
import facultyAuth from '../../middleware/facultyAuth.js';
import adminAuth from '../../middleware/adminAuth.js';

const router = express.Router();

// Middleware to allow both faculty and admin
const facultyOrAdminAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No authentication token'
    });
  }

  // Try faculty auth first
  facultyAuth(req, res, (err) => {
    if (!err) return next();
    
    // If faculty auth fails, try admin auth
    adminAuth(req, res, next);
  });
};

// Student search endpoint
router.get('/search', facultyOrAdminAuth, searchController.searchStudents);

export default router;
