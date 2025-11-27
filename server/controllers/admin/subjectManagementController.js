import Subject from '../../models/Subject.js';

const subjectManagementController = {
  // Get all subjects with filters
  getAllSubjects: async (req, res) => {
    try {
      const { semester, branch, department, is_active } = req.query;
      
      const filters = {};
      if (semester) filters.semester = parseInt(semester);
      if (branch) filters.branch = branch;
      if (department) filters.department = department;
      if (is_active !== undefined) filters.is_active = is_active === 'true';

      const subjects = await Subject.getAll(filters);
      
      res.json({
        success: true,
        count: subjects.length,
        data: subjects
      });
    } catch (error) {
      console.error('Get all subjects error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch subjects',
        error: error.message
      });
    }
  },

  // Get subject by ID with assigned faculty
  getSubjectById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const subject = await Subject.findById(id);
      
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found'
        });
      }

      // Get assigned faculty
      const assignedFaculty = await Subject.getAssignedFaculty(id);
      
      res.json({
        success: true,
        data: {
          ...subject,
          assigned_faculty: assignedFaculty
        }
      });
    } catch (error) {
      console.error('Get subject by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch subject',
        error: error.message
      });
    }
  },

  // Add new subject
  addSubject: async (req, res) => {
    try {
      const {
        subject_code,
        subject_name,
        semester,
        credits,
        subject_type,
        branch,
        department
      } = req.body;

      // Validation
      if (!subject_code || !subject_name || !semester || !credits) {
        return res.status(400).json({
          success: false,
          message: 'Subject code, name, semester, and credits are required'
        });
      }

      // Check if subject code already exists
      const existing = await Subject.findByCode(subject_code);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Subject code already exists'
        });
      }

      const subjectData = {
        subject_code,
        subject_name,
        semester: parseInt(semester),
        credits: parseFloat(credits),
        subject_type: subject_type || 'theory',
        branch: branch || 'CSE',
        department: department || 'Computer Science'
      };

      const newSubject = await Subject.create(subjectData);
      
      res.status(201).json({
        success: true,
        message: 'Subject created successfully',
        data: newSubject
      });
    } catch (error) {
      console.error('Add subject error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create subject',
        error: error.message
      });
    }
  },

  // Update subject
  updateSubject: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Check if subject exists
      const subject = await Subject.findById(id);
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found'
        });
      }

      // If updating subject_code, check it doesn't exist
      if (updateData.subject_code && updateData.subject_code !== subject.subject_code) {
        const existing = await Subject.findByCode(updateData.subject_code);
        if (existing) {
          return res.status(400).json({
            success: false,
            message: 'Subject code already exists'
          });
        }
      }

      const updatedSubject = await Subject.update(id, updateData);
      
      res.json({
        success: true,
        message: 'Subject updated successfully',
        data: updatedSubject
      });
    } catch (error) {
      console.error('Update subject error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update subject',
        error: error.message
      });
    }
  },

  // Delete subject (soft delete)
  deleteSubject: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if subject exists
      const subject = await Subject.findById(id);
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found'
        });
      }

      await Subject.delete(id);
      
      res.json({
        success: true,
        message: 'Subject deleted successfully'
      });
    } catch (error) {
      console.error('Delete subject error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete subject',
        error: error.message
      });
    }
  },

  // Assign subject to faculty
  assignSubjectToFaculty: async (req, res) => {
    try {
      const { subject_id, faculty_id, section, academic_year } = req.body;

      if (!subject_id || !faculty_id) {
        return res.status(400).json({
          success: false,
          message: 'Subject ID and Faculty ID are required'
        });
      }

      const assignment = await Subject.assignToFaculty(
        subject_id,
        faculty_id,
        section,
        academic_year
      );
      
      res.status(201).json({
        success: true,
        message: 'Subject assigned to faculty successfully',
        data: assignment
      });
    } catch (error) {
      console.error('Assign subject to faculty error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to assign subject',
        error: error.message
      });
    }
  },

  // Get subjects by semester
  getSubjectsBySemester: async (req, res) => {
    try {
      const { semester } = req.params;
      
      const subjects = await Subject.getAll({ 
        semester: parseInt(semester),
        is_active: true
      });
      
      res.json({
        success: true,
        semester: parseInt(semester),
        count: subjects.length,
        data: subjects
      });
    } catch (error) {
      console.error('Get subjects by semester error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch subjects',
        error: error.message
      });
    }
  },

  // Upload syllabus
  uploadSyllabus: async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Syllabus file is required'
        });
      }

      const syllabusPath = `/uploads/syllabus/${req.file.filename}`;
      
      const updatedSubject = await Subject.uploadSyllabus(id, syllabusPath);
      
      res.json({
        success: true,
        message: 'Syllabus uploaded successfully',
        data: updatedSubject
      });
    } catch (error) {
      console.error('Upload syllabus error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload syllabus',
        error: error.message
      });
    }
  }
};

export default subjectManagementController;
