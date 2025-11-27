import Marks from '../../models/Marks.js';

const marksController = {
  // Add marks for a single student
  addMarks: async (req, res) => {
    try {
      const {
        student_id,
        subject_id,
        exam_type,
        marks_obtained,
        max_marks,
        remarks
      } = req.body;
      const faculty_id = req.user.id;

      // Validation
      if (!student_id || !subject_id || !exam_type || marks_obtained === undefined || !max_marks) {
        return res.status(400).json({
          success: false,
          message: 'Student ID, Subject ID, Exam Type, Marks Obtained, and Max Marks are required'
        });
      }

      // Validate marks
      if (marks_obtained > max_marks) {
        return res.status(400).json({
          success: false,
          message: 'Marks obtained cannot be greater than max marks'
        });
      }

      const marksData = {
        student_id,
        subject_id,
        exam_type,
        marks_obtained: parseFloat(marks_obtained),
        max_marks: parseFloat(max_marks),
        entered_by: faculty_id,
        remarks
      };

      const marks = await Marks.addMarks(marksData);
      
      res.status(201).json({
        success: true,
        message: 'Marks added successfully',
        data: marks
      });
    } catch (error) {
      console.error('Add marks error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add marks',
        error: error.message
      });
    }
  },

  // Add bulk marks for multiple students
  addBulkMarks: async (req, res) => {
    try {
      const { subject_id, exam_type, max_marks, marks_records } = req.body;
      const faculty_id = req.user.id;

      // Validation
      if (!subject_id || !exam_type || !max_marks || !marks_records || !Array.isArray(marks_records)) {
        return res.status(400).json({
          success: false,
          message: 'Subject ID, Exam Type, Max Marks, and Marks Records array are required'
        });
      }

      // Validate all marks
      const invalidMarks = marks_records.filter(
        record => record.marks_obtained > max_marks
      );
      
      if (invalidMarks.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Some marks exceed max marks',
          invalid_records: invalidMarks
        });
      }

      // Format bulk data
      const bulkData = marks_records.map(record => ({
        student_id: record.student_id,
        subject_id,
        exam_type,
        marks_obtained: parseFloat(record.marks_obtained),
        max_marks: parseFloat(max_marks),
        entered_by: faculty_id,
        remarks: record.remarks
      }));

      const result = await Marks.addBulkMarks(bulkData);
      
      res.status(201).json({
        success: true,
        message: `Marks added for ${result.length} students`,
        data: result
      });
    } catch (error) {
      console.error('Add bulk marks error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add bulk marks',
        error: error.message
      });
    }
  },

  // Get marks for a student
  getStudentMarks: async (req, res) => {
    try {
      const { student_id } = req.params;
      const { subject_id, exam_type } = req.query;

      const filters = {};
      if (subject_id) filters.subject_id = subject_id;
      if (exam_type) filters.exam_type = exam_type;

      const marks = await Marks.getStudentMarks(student_id, filters);
      
      res.json({
        success: true,
        student_id,
        count: marks.length,
        data: marks
      });
    } catch (error) {
      console.error('Get student marks error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch student marks',
        error: error.message
      });
    }
  },

  // Get student marks summary with percentages
  getStudentMarksSummary: async (req, res) => {
    try {
      const { student_id } = req.params;

      const summary = await Marks.getStudentMarksSummary(student_id);
      
      res.json({
        success: true,
        student_id,
        data: summary
      });
    } catch (error) {
      console.error('Get student marks summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch marks summary',
        error: error.message
      });
    }
  },

  // Get subject marks for all students
  getSubjectMarks: async (req, res) => {
    try {
      const { subject_id, exam_type } = req.query;

      if (!subject_id || !exam_type) {
        return res.status(400).json({
          success: false,
          message: 'Subject ID and Exam Type are required'
        });
      }

      const marks = await Marks.getSubjectMarks(subject_id, exam_type);
      
      res.json({
        success: true,
        subject_id,
        exam_type,
        count: marks.length,
        data: marks
      });
    } catch (error) {
      console.error('Get subject marks error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch subject marks',
        error: error.message
      });
    }
  },

  // Get faculty's marks statistics
  getFacultyMarksStats: async (req, res) => {
    try {
      const faculty_id = req.user.id;
      const { subject_id, exam_type } = req.query;

      const stats = await Marks.getFacultyMarksStats(faculty_id, subject_id, exam_type);
      
      res.json({
        success: true,
        faculty_id,
        data: stats
      });
    } catch (error) {
      console.error('Get faculty marks stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch marks statistics',
        error: error.message
      });
    }
  },

  // Get top performers
  getTopPerformers: async (req, res) => {
    try {
      const { subject_id, exam_type, limit } = req.query;

      if (!subject_id || !exam_type) {
        return res.status(400).json({
          success: false,
          message: 'Subject ID and Exam Type are required'
        });
      }

      const topStudents = await Marks.getTopPerformers(
        subject_id,
        exam_type,
        limit ? parseInt(limit) : 10
      );
      
      res.json({
        success: true,
        subject_id,
        exam_type,
        count: topStudents.length,
        data: topStudents
      });
    } catch (error) {
      console.error('Get top performers error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch top performers',
        error: error.message
      });
    }
  },

  // Get class analytics
  getClassAnalytics: async (req, res) => {
    try {
      const { subject_id, exam_type } = req.query;

      if (!subject_id || !exam_type) {
        return res.status(400).json({
          success: false,
          message: 'Subject ID and Exam Type are required'
        });
      }

      const analytics = await Marks.getClassAnalytics(subject_id, exam_type);
      
      res.json({
        success: true,
        subject_id,
        exam_type,
        data: analytics
      });
    } catch (error) {
      console.error('Get class analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch class analytics',
        error: error.message
      });
    }
  },

  // Update marks
  updateMarks: async (req, res) => {
    try {
      const { id } = req.params;
      const { marks_obtained, remarks } = req.body;

      if (marks_obtained === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Marks obtained is required'
        });
      }

      // You'll need to add an update method to Marks model
      // For now, return a placeholder
      res.json({
        success: true,
        message: 'Marks update functionality coming soon'
      });
    } catch (error) {
      console.error('Update marks error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update marks',
        error: error.message
      });
    }
  },

  // Delete marks
  deleteMarks: async (req, res) => {
    try {
      const { id } = req.params;

      // You'll need to add a delete method to Marks model
      res.json({
        success: true,
        message: 'Marks delete functionality coming soon'
      });
    } catch (error) {
      console.error('Delete marks error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete marks',
        error: error.message
      });
    }
  }
};

export default marksController;
