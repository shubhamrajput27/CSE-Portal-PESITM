import pool from '../config/database.js';

async function checkStudent() {
  try {
    console.log('🔍 Checking student 4PM23CS101...\n');
    
    // Check if student exists
    const studentResult = await pool.query(
      'SELECT * FROM students WHERE usn = $1',
      ['4PM23CS101']
    );
    
    if (studentResult.rows.length === 0) {
      console.log('❌ Student 4PM23CS101 not found in database');
      return;
    }
    
    const student = studentResult.rows[0];
    console.log('✅ Student found:');
    console.log(`   USN: ${student.usn}`);
    console.log(`   Name: ${student.name}`);
    console.log(`   Semester: ${student.semester}`);
    console.log(`   Section: ${student.section}`);
    console.log(`   Student ID: ${student.id}\n`);
    
    // Check mentor assignment
    const mentorResult = await pool.query(
      `SELECT mm.*, f.full_name, f.designation, f.email 
       FROM mentor_mentee mm
       JOIN faculty_users f ON mm.faculty_id = f.id
       WHERE mm.student_id = $1 AND mm.is_active = TRUE`,
      [student.id]
    );
    
    if (mentorResult.rows.length === 0) {
      console.log('❌ No mentor assigned to this student\n');
      
      // Find faculty with least mentees
      const facultyResult = await pool.query(
        `SELECT f.id, f.full_name, f.designation, COUNT(mm.id) as mentee_count
         FROM faculty_users f
         LEFT JOIN mentor_mentee mm ON f.id = mm.faculty_id AND mm.is_active = TRUE
         WHERE f.is_active = TRUE
         GROUP BY f.id, f.full_name, f.designation
         ORDER BY mentee_count ASC
         LIMIT 1`
      );
      
      if (facultyResult.rows.length > 0) {
        const faculty = facultyResult.rows[0];
        console.log('📝 Assigning to faculty with least mentees:');
        console.log(`   Faculty: ${faculty.full_name} (${faculty.designation})`);
        console.log(`   Current mentees: ${faculty.mentee_count}\n`);
        
        // Assign mentor
        await pool.query(
          `INSERT INTO mentor_mentee (student_id, faculty_id, academic_year, is_active)
           VALUES ($1, $2, '2025-26', TRUE)`,
          [student.id, faculty.id]
        );
        
        console.log('✅ Mentor assigned successfully!');
      }
    } else {
      const mentor = mentorResult.rows[0];
      console.log('✅ Mentor already assigned:');
      console.log(`   Faculty: ${mentor.full_name}`);
      console.log(`   Designation: ${mentor.designation}`);
      console.log(`   Email: ${mentor.email}`);
      console.log(`   Academic Year: ${mentor.academic_year}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkStudent();
