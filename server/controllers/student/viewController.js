import Attendance from '../../models/Attendance.js';
import Marks from '../../models/Marks.js';
import MentorMentee from '../../models/MentorMentee.js';

const viewController = {
  // Get student's own attendance
  getMyAttendance: async (req, res) => {
    try {
      const student_id = req.user.id; // From auth middleware
      const { subject_id, start_date, end_date } = req.query;

      const filters = {};
      if (subject_id) filters.subject_id = subject_id;
      if (start_date) filters.start_date = start_date;
      if (end_date) filters.end_date = end_date;

      const attendance = await Attendance.getStudentAttendance(student_id, filters);
      
      res.json({
        success: true,
        count: attendance.length,
        data: attendance
      });
    } catch (error) {
      console.error('Get my attendance error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch attendance',
        error: error.message
      });
    }
  },

  // Get student's attendance summary
  getMyAttendanceSummary: async (req, res) => {
    try {
      const student_id = req.user.id;
      const { start_date, end_date } = req.query;

      const summary = await Attendance.getStudentAttendanceSummary(
        student_id,
        start_date,
        end_date
      );
      
      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Get my attendance summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch attendance summary',
        error: error.message
      });
    }
  },

  // Get student's own marks
  getMyMarks: async (req, res) => {
    try {
      const student_id = req.user.id;
      const { subject_id, exam_type } = req.query;

      const filters = {};
      if (subject_id) filters.subject_id = subject_id;
      if (exam_type) filters.exam_type = exam_type;

      const marks = await Marks.getStudentMarks(student_id, filters);
      
      res.json({
        success: true,
        count: marks.length,
        data: marks
      });
    } catch (error) {
      console.error('Get my marks error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch marks',
        error: error.message
      });
    }
  },

  // Get student's marks summary
  getMyMarksSummary: async (req, res) => {
    try {
      const student_id = req.user.id;

      const summary = await Marks.getStudentMarksSummary(student_id);
      
      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Get my marks summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch marks summary',
        error: error.message
      });
    }
  },

  // Get combined dashboard data
  getDashboardData: async (req, res) => {
    try {
      const student_id = req.user.id;

      // Fetch attendance and marks summaries in parallel
      const [attendanceSummary, marksSummary] = await Promise.all([
        Attendance.getStudentAttendanceSummary(student_id),
        Marks.getStudentMarksSummary(student_id)
      ]);
      
      res.json({
        success: true,
        data: {
          attendance: attendanceSummary,
          marks: marksSummary
        }
      });
    } catch (error) {
      console.error('Get dashboard data error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard data',
        error: error.message
      });
    }
  },

  // Get student's mentor
  getMyMentor: async (req, res) => {
    try {
      const student_id = req.user.id;
      const academicYear = '2025-26'; // You can make this dynamic

      const mentor = await MentorMentee.getMentor(student_id, academicYear);
      
      if (!mentor) {
        return res.json({
          success: true,
          data: null,
          message: 'No mentor assigned yet'
        });
      }

      res.json({
        success: true,
        data: mentor
      });
    } catch (error) {
      console.error('Get my mentor error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch mentor information',
        error: error.message
      });
    }
  }
};

export default viewController;
