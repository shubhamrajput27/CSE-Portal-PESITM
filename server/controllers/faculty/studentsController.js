import pool from '../../config/database.js';

// Get all students
const getAllStudents = async (req, res) => {
  try {
    console.log('Fetching all students...');
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
    console.log(`Found ${result.rows.length} students`);
    
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
const getStudentsBySubject = async (req, res) => {
  try {
    const { subject_id } = req.params;
    console.log(`Fetching students for subject ${subject_id}...`);
    
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
    console.log(`Found ${result.rows.length} students for subject ${subject_id}`);
    
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
const getStudentsBySemester = async (req, res) => {
  try {
    const { semester } = req.params;
    console.log(`Fetching students for semester ${semester}...`);
    
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
    console.log(`Found ${result.rows.length} students for semester ${semester}`);
    
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
