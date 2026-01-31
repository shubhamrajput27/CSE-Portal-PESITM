import pool from '../config/database.js';

/**
 * Script to check and display mentor-mentee assignments
 */

async function checkMentorAssignments() {
  try {
    console.log('🔍 Checking Mentor-Mentee Assignments...\n');
    
    // Get current academic year (with fallback)
    let academicYear = '2025-26';
    try {
      const academicYearResult = await pool.query(
        "SELECT setting_value FROM system_settings WHERE setting_key = 'current_academic_year'"
      );
      academicYear = academicYearResult.rows[0]?.setting_value || '2025-26';
    } catch (err) {
      // system_settings table might not exist, use default
      console.log('ℹ️  Using default academic year (system_settings table not found)');
    }
    console.log(`📅 Academic Year: ${academicYear}\n`);
    
    // Check total students
    const totalStudentsResult = await pool.query(
      'SELECT COUNT(*) as count FROM students WHERE is_active = TRUE'
    );
    const totalStudents = parseInt(totalStudentsResult.rows[0].count);
    console.log(`👥 Total Active Students: ${totalStudents}`);
    
    // Check total faculty
    const totalFacultyResult = await pool.query(
      'SELECT COUNT(*) as count FROM faculty_users WHERE is_active = TRUE'
    );
    const totalFaculty = parseInt(totalFacultyResult.rows[0].count);
    console.log(`👨‍🏫 Total Active Faculty: ${totalFaculty}`);
    
    // Check mentor assignments
    const assignedResult = await pool.query(`
      SELECT COUNT(DISTINCT student_id) as count 
      FROM mentor_mentee 
      WHERE academic_year = $1 AND is_active = TRUE
    `, [academicYear]);
    const assignedStudents = parseInt(assignedResult.rows[0].count);
    
    console.log(`\n📊 Assignment Status:`);
    console.log(`   Assigned: ${assignedStudents} students (${((assignedStudents/totalStudents)*100).toFixed(1)}%)`);
    console.log(`   Unassigned: ${totalStudents - assignedStudents} students`);
    
    // Get students without mentors
    const unassignedResult = await pool.query(`
      SELECT s.id, s.usn, s.full_name, s.semester, s.section
      FROM students s
      LEFT JOIN mentor_mentee mm ON s.id = mm.student_id 
        AND mm.academic_year = $1 
        AND mm.is_active = TRUE
      WHERE s.is_active = TRUE AND mm.id IS NULL
      ORDER BY s.semester, s.section, s.usn
      LIMIT 10
    `, [academicYear]);
    
    if (unassignedResult.rows.length > 0) {
      console.log(`\n⚠️  Students Without Mentors (showing first 10):`);
      unassignedResult.rows.forEach(s => {
        console.log(`   • ${s.usn} - ${s.full_name} (Sem ${s.semester}, Sec ${s.section})`);
      });
      if (totalStudents - assignedStudents > 10) {
        console.log(`   ... and ${totalStudents - assignedStudents - 10} more`);
      }
    }
    
    // Get faculty mentor distribution
    const distributionResult = await pool.query(`
      SELECT 
        f.id,
        f.full_name,
        f.designation,
        COUNT(mm.id) as mentee_count,
        json_agg(
          json_build_object(
            'usn', s.usn,
            'name', s.full_name,
            'semester', s.semester,
            'section', s.section
          ) ORDER BY s.semester, s.section, s.usn
        ) FILTER (WHERE mm.id IS NOT NULL) as mentees
      FROM faculty_users f
      LEFT JOIN mentor_mentee mm ON f.id = mm.faculty_id 
        AND mm.academic_year = $1 
        AND mm.is_active = TRUE
      LEFT JOIN students s ON mm.student_id = s.id
      WHERE f.is_active = TRUE
      GROUP BY f.id, f.full_name, f.designation
      ORDER BY mentee_count DESC
    `, [academicYear]);
    
    console.log(`\n📋 Faculty-wise Distribution:\n`);
    console.log('='.repeat(80));
    
    distributionResult.rows.forEach((faculty, index) => {
      console.log(`\n${index + 1}. ${faculty.full_name} (${faculty.designation})`);
      console.log(`   Total Mentees: ${faculty.mentee_count}`);
      
      if (faculty.mentee_count > 0 && faculty.mentees) {
        console.log(`   Students:`);
        const menteesToShow = faculty.mentees.slice(0, 5);
        menteesToShow.forEach(m => {
          console.log(`      • ${m.usn} - ${m.name} (Sem ${m.semester}, Sec ${m.section})`);
        });
        if (faculty.mentees.length > 5) {
          console.log(`      ... and ${faculty.mentees.length - 5} more`);
        }
      }
    });
    
    console.log('\n' + '='.repeat(80));
    
    // Calculate statistics
    const menteeCounts = distributionResult.rows.map(f => f.mentee_count);
    const avgMentees = menteeCounts.reduce((a, b) => a + b, 0) / menteeCounts.length;
    const maxMentees = Math.max(...menteeCounts);
    const minMentees = Math.min(...menteeCounts);
    
    console.log(`\n📈 Statistics:`);
    console.log(`   Average mentees per faculty: ${avgMentees.toFixed(1)}`);
    console.log(`   Maximum mentees: ${maxMentees}`);
    console.log(`   Minimum mentees: ${minMentees}`);
    console.log(`   Distribution balance: ${maxMentees - minMentees} (difference between max and min)`);
    
    if (totalStudents - assignedStudents > 0) {
      console.log(`\n💡 Action Required:`);
      console.log(`   Run the assignment script to assign mentors to unassigned students:`);
      console.log(`   node server/scripts/assignMentorsToStudents.js\n`);
    } else {
      console.log(`\n✅ All students have been assigned mentors!\n`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

checkMentorAssignments();
