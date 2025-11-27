import pool from './config/database.js';
import bcrypt from 'bcrypt';

async function testLogin() {
  console.log('Testing Student Login Credentials...\n');
  
  try {
    // Check student exists
    const studentQuery = 'SELECT * FROM students WHERE usn = $1 OR student_id = $1';
    const studentResult = await pool.query(studentQuery, ['4PM23CS101']);
    
    if (studentResult.rows.length === 0) {
      console.log('❌ Student not found');
    } else {
      const student = studentResult.rows[0];
      console.log('✓ Student found:', student.full_name);
      console.log('  USN:', student.usn);
      console.log('  Active:', student.is_active);
      
      // Test password
      const isValid = await bcrypt.compare('student123', student.password_hash);
      console.log('  Password valid:', isValid ? '✓' : '❌');
    }
  } catch (error) {
    console.error('Student test error:', error.message);
  }

  console.log('\n---\n');
  console.log('Testing Faculty Login Credentials...\n');
  
  try {
    // Check faculty exists
    const facultyQuery = 'SELECT * FROM faculty_users WHERE faculty_id = $1';
    const facultyResult = await pool.query(facultyQuery, ['FAC001']);
    
    if (facultyResult.rows.length === 0) {
      console.log('❌ Faculty not found');
    } else {
      const faculty = facultyResult.rows[0];
      console.log('✓ Faculty found:', faculty.full_name);
      console.log('  Faculty ID:', faculty.faculty_id);
      console.log('  Active:', faculty.is_active);
      
      // Test password
      const isValid = await bcrypt.compare('faculty123', faculty.password_hash);
      console.log('  Password valid:', isValid ? '✓' : '❌');
    }
  } catch (error) {
    console.error('Faculty test error:', error.message);
  }
  
  await pool.end();
}

testLogin();
