import pool from '../config/database.js';

async function checkAttendanceSetup() {
  try {
    console.log('🔍 Checking Attendance System Setup...\n');
    
    // Check faculty
    const facultyResult = await pool.query('SELECT id, faculty_id, full_name, email FROM faculty_users LIMIT 5');
    console.log('📋 Faculty Users:', facultyResult.rows.length);
    if (facultyResult.rows.length > 0) {
      console.log('   Sample:', facultyResult.rows[0]);
    }
    
    // Check subjects
    const subjectsResult = await pool.query('SELECT id, subject_code, subject_name, semester FROM subjects WHERE is_active = TRUE LIMIT 5');
    console.log('\n📚 Subjects:', subjectsResult.rows.length);
    if (subjectsResult.rows.length > 0) {
      console.log('   Samples:');
      subjectsResult.rows.forEach(s => console.log(`   - ${s.subject_code}: ${s.subject_name} (Sem ${s.semester})`));
    }
    
    // Check faculty_subjects assignments
    const assignmentsResult = await pool.query(`
      SELECT fs.id, f.full_name, s.subject_code, s.subject_name, fs.academic_year, fs.section
      FROM faculty_subjects fs
      JOIN faculty_users f ON fs.faculty_id = f.id
      JOIN subjects s ON fs.subject_id = s.id
      LIMIT 10
    `);
    console.log('\n🔗 Faculty-Subject Assignments:', assignmentsResult.rows.length);
    if (assignmentsResult.rows.length > 0) {
      console.log('   Assignments:');
      assignmentsResult.rows.forEach(a => 
        console.log(`   - ${a.full_name} → ${a.subject_code} (${a.academic_year}, Section ${a.section})`)
      );
    } else {
      console.log('   ⚠️  NO ASSIGNMENTS FOUND! Faculty won\'t see any subjects.');
    }
    
    // Check students
    const studentsResult = await pool.query('SELECT id, usn, full_name, semester, section FROM students LIMIT 5');
    console.log('\n👥 Students:', studentsResult.rows.length);
    if (studentsResult.rows.length > 0) {
      console.log('   Samples:');
      studentsResult.rows.forEach(s => console.log(`   - ${s.usn}: ${s.full_name} (Sem ${s.semester}, Sec ${s.section || 'N/A'})`));
    }
    
    // Check attendance records
    const attendanceResult = await pool.query('SELECT COUNT(*) as count FROM attendance');
    console.log('\n✅ Attendance Records:', attendanceResult.rows[0].count);
    
    // Check marks records
    const marksResult = await pool.query('SELECT COUNT(*) as count FROM marks');
    console.log('📊 Marks Records:', marksResult.rows[0].count);
    
    console.log('\n' + '='.repeat(60));
    
    if (assignmentsResult.rows.length === 0) {
      console.log('\n⚠️  ACTION REQUIRED:');
      console.log('No faculty-subject assignments found!');
      console.log('You need to assign subjects to faculty.');
      console.log('\nExample SQL to assign subjects:');
      console.log(`
INSERT INTO faculty_subjects (faculty_id, subject_id, academic_year, section)
SELECT 
  (SELECT id FROM faculty_users LIMIT 1),
  id,
  '2025-26',
  'A'
FROM subjects
WHERE semester = 5
LIMIT 3;
      `);
    } else {
      console.log('\n✅ Setup looks good!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkAttendanceSetup();
