import pool from '../../config/database.js';

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        student_id,
        usn,
        full_name,
        email,
        semester,
        year,
        department,
        section
      FROM students
      ORDER BY usn
    `;
    
    const result = await pool.query(query);
    
    res.status(200).json({
      success: true,
      message: 'Students retrieved successfully',
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
};

// Get students by subject
export const getStudentsBySubject = async (req, res) => {
  try {
    const { subject_id } = req.params;
    
    // For now, return all students
    // TODO: Implement subject-student mapping when subject enrollment is added
    const query = `
      SELECT 
        id,
        student_id,
        usn,
        full_name,
        email,
        semester,
        year,
        department,
        section
      FROM students
      ORDER BY usn
    `;
    
    const result = await pool.query(query);
    
    res.status(200).json({
      success: true,
      message: 'Students retrieved successfully',
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching students by subject:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
};

// Get students by semester
export const getStudentsBySemester = async (req, res) => {
  try {
    const { semester } = req.params;
    
    const query = `
      SELECT 
        id,
        student_id,
        usn,
        full_name,
        email,
        semester,
        year,
        department,
        section
      FROM students
      WHERE semester = $1
      ORDER BY usn
    `;
    
    const result = await pool.query(query, [semester]);
    
    res.status(200).json({
      success: true,
      message: 'Students retrieved successfully',
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching students by semester:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
};

export default {
  getAllStudents,
  getStudentsBySubject,
  getStudentsBySemester
};
