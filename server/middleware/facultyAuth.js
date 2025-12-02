import jwt from 'jsonwebtoken';

const facultyAuth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token, access denied'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pesitm-cse-faculty-secret-key-2024');

    // Check if user is faculty
    if (decoded.type !== 'faculty') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Faculty role required.'
      });
    }

    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid',
      error: error.message
    });
  }
};

export default facultyAuth;
