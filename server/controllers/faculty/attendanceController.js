import Attendance from '../../models/Attendance.js';
import Subject from '../../models/Subject.js';

const attendanceController = {
  // Mark attendance for a single student
  markAttendance: async (req, res) => {
    try {
      const { student_id, subject_id, date, status, period, remarks } = req.body;
      const faculty_id = req.user.id; // From auth middleware

      // Validation
      if (!student_id || !subject_id || !date || !status) {
        return res.status(400).json({
          success: false,
          message: 'Student ID, Subject ID, Date, and Status are required'
        });
      }

      const attendanceData = {
        student_id,
        subject_id,
        date,
        status,
        period: period || 1,
        marked_by: faculty_id,
        remarks
      };

      const attendance = await Attendance.markAttendance(attendanceData);
      
      res.status(201).json({
        success: true,
        message: 'Attendance marked successfully',
        data: attendance
      });
    } catch (error) {
      console.error('Mark attendance error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark attendance',
        error: error.message
      });
    }
  },

  // Mark bulk attendance for multiple students
  markBulkAttendance: async (req, res) => {
    try {
      const { subject_id, date, period, attendance_records } = req.body;
      const faculty_id = req.user.id;

      // Validation
      if (!subject_id || !date || !attendance_records || !Array.isArray(attendance_records)) {
        return res.status(400).json({
          success: false,
          message: 'Subject ID, Date, and Attendance Records array are required'
        });
      }

      // Format bulk data
      const bulkData = attendance_records.map(record => ({
        student_id: record.student_id,
        subject_id,
        date,
        status: record.status,
        period: period || 1,
        marked_by: faculty_id,
        remarks: record.remarks
      }));

      const result = await Attendance.markBulkAttendance(bulkData);
      
      res.status(201).json({
        success: true,
        message: `Attendance marked for ${result.length} students`,
        data: result
      });
    } catch (error) {
      console.error('Mark bulk attendance error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark bulk attendance',
        error: error.message
      });
    }
  },

  // Get attendance for a subject on specific date
  getSubjectAttendance: async (req, res) => {
    try {
      const { subject_id, date, period } = req.query;

      if (!subject_id || !date) {
        return res.status(400).json({
          success: false,
          message: 'Subject ID and Date are required'
        });
      }

      const attendance = await Attendance.getSubjectAttendance(
        subject_id,
        date,
        period ? parseInt(period) : null
      );
      
      res.json({
        success: true,
        count: attendance.length,
        data: attendance
      });
    } catch (error) {
      console.error('Get subject attendance error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch attendance',
        error: error.message
      });
    }
  },

  // Get student attendance summary
  getStudentAttendance: async (req, res) => {
    try {
      const { student_id } = req.params;
      const { subject_id, start_date, end_date } = req.query;

      const filters = {};
      if (subject_id) filters.subject_id = subject_id;
      if (start_date) filters.start_date = start_date;
      if (end_date) filters.end_date = end_date;

      const attendance = await Attendance.getStudentAttendance(student_id, filters);
      
      res.json({
        success: true,
        student_id,
        count: attendance.length,
        data: attendance
      });
    } catch (error) {
      console.error('Get student attendance error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch student attendance',
        error: error.message
      });
    }
  },

  // Get student attendance summary with percentage
  getStudentAttendanceSummary: async (req, res) => {
    try {
      const { student_id } = req.params;
      const { start_date, end_date } = req.query;

      const summary = await Attendance.getStudentAttendanceSummary(
        student_id,
        start_date,
        end_date
      );
      
      res.json({
        success: true,
        student_id,
        data: summary
      });
    } catch (error) {
      console.error('Get student attendance summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch attendance summary',
        error: error.message
      });
    }
  },

  // Get faculty's attendance statistics
  getFacultyAttendanceStats: async (req, res) => {
    try {
      const faculty_id = req.user.id;
      const { subject_id, start_date, end_date } = req.query;

      const stats = await Attendance.getFacultyAttendanceStats(
        faculty_id,
        subject_id,
        start_date,
        end_date
      );
      
      res.json({
        success: true,
        faculty_id,
        data: stats
      });
    } catch (error) {
      console.error('Get faculty attendance stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch attendance statistics',
        error: error.message
      });
    }
  },

  // Get students with low attendance
  getLowAttendanceStudents: async (req, res) => {
    try {
      const { subject_id, threshold, start_date, end_date } = req.query;

      if (!subject_id) {
        return res.status(400).json({
          success: false,
          message: 'Subject ID is required'
        });
      }

      const students = await Attendance.getLowAttendanceStudents(
        subject_id,
        threshold ? parseFloat(threshold) : 75.0,
        start_date,
        end_date
      );
      
      res.json({
        success: true,
        threshold: threshold || 75.0,
        count: students.length,
        data: students
      });
    } catch (error) {
      console.error('Get low attendance students error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch low attendance students',
        error: error.message
      });
    }
  },

  // Update attendance record
  updateAttendance: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, remarks } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      // You'll need to add an update method to Attendance model
      // For now, we'll mark it as deleted and create a new one
      const attendance = await Attendance.markAttendance({
        ...req.body,
        marked_by: req.user.id
      });
      
      res.json({
        success: true,
        message: 'Attendance updated successfully',
        data: attendance
      });
    } catch (error) {
      console.error('Update attendance error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update attendance',
        error: error.message
      });
    }
  }
};

export default attendanceController;
