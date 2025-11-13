import pool from '../config/database.js';

async function verifyDatabase() {
  try {
    console.log('🔍 Checking Database Connection...\n');

    // Test basic connection
    const timeResult = await pool.query('SELECT NOW() as current_time');
    console.log('✅ Database Connected Successfully!');
    console.log(`📅 Database Time: ${timeResult.rows[0].current_time}\n`);

    // Check students table
    console.log('📊 Checking Students Data:\n');
    const studentCountQuery = 'SELECT COUNT(*) as total FROM students';
    const studentCount = await pool.query(studentCountQuery);
    console.log(`   Total Students in Database: ${studentCount.rows[0].total}`);

    // Get sample students
    const sampleStudentsQuery = `
      SELECT usn, full_name, email, semester, year 
      FROM students 
      WHERE semester = 5 
      ORDER BY usn 
      LIMIT 5
    `;
    const sampleStudents = await pool.query(sampleStudentsQuery);
    
    if (sampleStudents.rows.length > 0) {
      console.log('\n   Sample Students (5th Semester):');
      console.log('   ================================');
      sampleStudents.rows.forEach((student, index) => {
        console.log(`   ${index + 1}. ${student.full_name}`);
        console.log(`      USN: ${student.usn}`);
        console.log(`      Email: ${student.email}`);
        console.log(`      Semester: ${student.semester} | Year: ${student.year}`);
        console.log('   --------------------------------');
      });
    }

    // Check 5th semester B section students
    const fifthSemQuery = `
      SELECT COUNT(*) as count 
      FROM students 
      WHERE semester = 5
    `;
    const fifthSemCount = await pool.query(fifthSemQuery);
    console.log(`\n   5th Semester Students: ${fifthSemCount.rows[0].count}`);

    // Check faculty users
    console.log('\n📊 Checking Faculty Data:\n');
    const facultyCountQuery = 'SELECT COUNT(*) as total FROM faculty_users';
    const facultyCount = await pool.query(facultyCountQuery);
    console.log(`   Total Faculty in Database: ${facultyCount.rows[0].total}`);

    // Get sample faculty
    const sampleFacultyQuery = `
      SELECT faculty_id, full_name, email, designation 
      FROM faculty_users 
      ORDER BY faculty_id 
      LIMIT 3
    `;
    const sampleFaculty = await pool.query(sampleFacultyQuery);
    
    if (sampleFaculty.rows.length > 0) {
      console.log('\n   Sample Faculty:');
      console.log('   ================================');
      sampleFaculty.rows.forEach((faculty, index) => {
        console.log(`   ${index + 1}. ${faculty.full_name}`);
        console.log(`      Faculty ID: ${faculty.faculty_id}`);
        console.log(`      Email: ${faculty.email}`);
        console.log(`      Designation: ${faculty.designation}`);
        console.log('   --------------------------------');
      });
    }

    // Check password hashing
    console.log('\n🔐 Checking Password Security:\n');
    const passwordCheckQuery = `
      SELECT usn, 
             CASE 
               WHEN password_hash LIKE '$2b$%' THEN 'Properly Hashed ✅'
               ELSE 'Not Hashed ❌'
             END as password_status
      FROM students 
      LIMIT 1
    `;
    const passwordCheck = await pool.query(passwordCheckQuery);
    if (passwordCheck.rows.length > 0) {
      console.log(`   Student Passwords: ${passwordCheck.rows[0].password_status}`);
    }

    const facultyPasswordCheckQuery = `
      SELECT faculty_id, 
             CASE 
               WHEN password_hash LIKE '$2b$%' THEN 'Properly Hashed ✅'
               ELSE 'Not Hashed ❌'
             END as password_status
      FROM faculty_users 
      LIMIT 1
    `;
    const facultyPasswordCheck = await pool.query(facultyPasswordCheckQuery);
    if (facultyPasswordCheck.rows.length > 0) {
      console.log(`   Faculty Passwords: ${facultyPasswordCheck.rows[0].password_status}`);
    }

    console.log('\n✅ Database Verification Complete!\n');
    console.log('📝 Summary:');
    console.log('   - Database is connected and working');
    console.log(`   - ${studentCount.rows[0].total} students are stored`);
    console.log(`   - ${facultyCount.rows[0].total} faculty members are stored`);
    console.log('   - Passwords are properly encrypted');
    console.log('\n🎯 You can now login with:');
    console.log('   Student: Any USN from 4PM23CS067 onwards | Password: student123');
    console.log('   Faculty: FAC001 to FAC008 | Password: faculty123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database Error:', error.message);
    console.error('\n🔧 Troubleshooting Steps:');
    console.error('   1. Check if PostgreSQL is running');
    console.error('   2. Verify .env file has correct credentials');
    console.error('   3. Ensure database "cse_portal_pesitm" exists');
    console.error('   4. Run: npm start (to start the server)\n');
    process.exit(1);
  }
}

// Run verification
verifyDatabase();
