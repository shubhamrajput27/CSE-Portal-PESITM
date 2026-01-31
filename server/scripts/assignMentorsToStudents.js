import pool from '../config/database.js';

/**
 * Script to automatically assign mentors to all students
 * Distributes students evenly among active faculty members
 */

async function assignMentorsToStudents() {
  const client = await pool.connect();
  
  try {
    console.log('🎓 Starting Mentor Assignment Process...\n');
    
    // Get current academic year (with fallback)
    let academicYear = '2025-26';
    try {
      const academicYearResult = await client.query(
        "SELECT setting_value FROM system_settings WHERE setting_key = 'current_academic_year'"
      );
      academicYear = academicYearResult.rows[0]?.setting_value || '2025-26';
    } catch (err) {
      // system_settings table might not exist, use default
      console.log('ℹ️  Using default academic year (system_settings table not found)');
    }
    console.log(`📅 Academic Year: ${academicYear}\n`);
    
    // Get all active faculty members
    const facultyResult = await client.query(`
      SELECT id, faculty_id, full_name, email, designation, department
      FROM faculty_users
      WHERE is_active = TRUE
      ORDER BY id
    `);
    
    if (facultyResult.rows.length === 0) {
      console.log('❌ No active faculty members found!');
      return;
    }
    
    console.log(`👨‍🏫 Found ${facultyResult.rows.length} active faculty members:`);
    facultyResult.rows.forEach((f, i) => {
      console.log(`   ${i + 1}. ${f.full_name} (${f.designation})`);
    });
    
    // Get all students who need mentors
    const studentsResult = await client.query(`
      SELECT s.id, s.usn, s.full_name, s.semester, s.section, s.email,
             s.current_mentor_id
      FROM students s
      WHERE s.is_active = TRUE
      ORDER BY s.semester, s.section, s.usn
    `);
    
    if (studentsResult.rows.length === 0) {
      console.log('\n❌ No students found!');
      return;
    }
    
    console.log(`\n👥 Found ${studentsResult.rows.length} students\n`);
    
    // Check existing mentor assignments
    const existingAssignments = await client.query(`
      SELECT student_id, faculty_id
      FROM mentor_mentee
      WHERE academic_year = $1 AND is_active = TRUE
    `, [academicYear]);
    
    const hasExistingMentor = new Set(
      existingAssignments.rows.map(row => row.student_id)
    );
    
    const studentsNeedingMentor = studentsResult.rows.filter(
      s => !hasExistingMentor.has(s.id)
    );
    
    console.log(`   ✅ Already assigned: ${hasExistingMentor.size} students`);
    console.log(`   📝 Need assignment: ${studentsNeedingMentor.length} students\n`);
    
    if (studentsNeedingMentor.length === 0) {
      console.log('✅ All students already have mentors assigned!');
      return;
    }
    
    // Calculate distribution
    const faculty = facultyResult.rows;
    const studentsPerFaculty = Math.ceil(studentsNeedingMentor.length / faculty.length);
    
    console.log(`📊 Distribution Plan:`);
    console.log(`   Students per faculty: ~${studentsPerFaculty}`);
    console.log(`   Total faculty: ${faculty.length}\n`);
    
    console.log('🔄 Assigning mentors...\n');
    
    await client.query('BEGIN');
    
    let assignmentCount = 0;
    const assignmentsByFaculty = {};
    
    // Initialize counters
    faculty.forEach(f => {
      assignmentsByFaculty[f.id] = {
        name: f.full_name,
        count: 0,
        students: []
      };
    });
    
    // Distribute students evenly
    for (let i = 0; i < studentsNeedingMentor.length; i++) {
      const student = studentsNeedingMentor[i];
      const facultyIndex = i % faculty.length;
      const assignedFaculty = faculty[facultyIndex];
      
      // Insert mentor assignment
      await client.query(`
        INSERT INTO mentor_mentee (student_id, faculty_id, academic_year, assigned_date, is_active)
        VALUES ($1, $2, $3, CURRENT_DATE, TRUE)
        ON CONFLICT (student_id, academic_year)
        DO UPDATE SET 
          faculty_id = EXCLUDED.faculty_id,
          assigned_date = CURRENT_DATE,
          is_active = TRUE
      `, [student.id, assignedFaculty.id, academicYear]);
      
      // Update student's current_mentor_id
      await client.query(
        'UPDATE students SET current_mentor_id = $1 WHERE id = $2',
        [assignedFaculty.id, student.id]
      );
      
      assignmentsByFaculty[assignedFaculty.id].count++;
      assignmentsByFaculty[assignedFaculty.id].students.push({
        usn: student.usn,
        name: student.full_name,
        semester: student.semester,
        section: student.section
      });
      
      assignmentCount++;
      
      if (assignmentCount % 10 === 0) {
        console.log(`   ✓ Assigned ${assignmentCount}/${studentsNeedingMentor.length} students...`);
      }
    }
    
    await client.query('COMMIT');
    
    console.log(`\n✅ Successfully assigned ${assignmentCount} students!\n`);
    
    // Print summary
    console.log('📋 Assignment Summary:\n');
    console.log('='.repeat(80));
    
    for (const facultyId in assignmentsByFaculty) {
      const info = assignmentsByFaculty[facultyId];
      if (info.count > 0) {
        console.log(`\n👨‍🏫 ${info.name}`);
        console.log(`   Total Mentees: ${info.count}`);
        console.log(`   Students:`);
        info.students.slice(0, 5).forEach(s => {
          console.log(`      • ${s.usn} - ${s.name} (Sem ${s.semester}, Sec ${s.section})`);
        });
        if (info.students.length > 5) {
          console.log(`      ... and ${info.students.length - 5} more`);
        }
      }
    }
    
    console.log('\n' + '='.repeat(80));
    
    // Get final statistics
    const statsResult = await client.query(`
      SELECT 
        f.full_name,
        COUNT(mm.id) as mentee_count
      FROM faculty_users f
      LEFT JOIN mentor_mentee mm ON f.id = mm.faculty_id 
        AND mm.academic_year = $1 
        AND mm.is_active = TRUE
      WHERE f.is_active = TRUE
      GROUP BY f.id, f.full_name
      ORDER BY mentee_count DESC
    `, [academicYear]);
    
    console.log('\n📊 Final Distribution:');
    statsResult.rows.forEach(row => {
      console.log(`   ${row.full_name}: ${row.mentee_count} mentees`);
    });
    
    console.log('\n✅ Mentor assignment completed successfully!');
    console.log('\n💡 Next Steps:');
    console.log('   1. Faculty can view their mentees in the dashboard');
    console.log('   2. Students can see their assigned mentor');
    console.log('   3. Use the mentor-mentee reports for tracking\n');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error assigning mentors:', error.message);
    console.error(error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the script
assignMentorsToStudents();
