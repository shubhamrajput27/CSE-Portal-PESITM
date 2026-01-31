import MentorMentee from '../../models/MentorMentee.js';
import logger from '../../utils/logger.js';

const menteesController = {
  // Get all mentees for the logged-in faculty
  async getMyMentees(req, res) {
    try {
      const facultyId = req.user.facultyUserId; // From JWT token
      const academicYear = '2025-26'; // You can make this dynamic from system settings
      
      logger.info(`Fetching mentees for faculty ID: ${facultyId}`);
      
      const mentees = await MentorMentee.getMentees(facultyId, academicYear);
      
      res.json({
        success: true,
        count: mentees.length,
        data: mentees
      });
    } catch (error) {
      logger.error('Error fetching mentees:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch mentees',
        error: error.message
      });
    }
  }
};

export default menteesController;
