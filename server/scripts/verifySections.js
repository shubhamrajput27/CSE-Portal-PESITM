import pool from '../config/database.js';

/**
 * Verify sections setup and show summary
 */

async function verifySections() {
  try {
    console.log('\n📊 SECTION VERIFICATION REPORT');
    console.log('='.repeat(60));

    // Students summary
    const studentStats = await pool.query(`
      SELECT 
        section,
        COUNT(*) as total,
        MIN(CAST(REGEXP_REPLACE(student_id, '[^0-9]', '', 'g') AS INTEGER)) as min_id,
        MAX(CAST(REGEXP_REPLACE(student_id, '[^0-9]', '', 'g') AS INTEGER)) as max_id,
        MIN(usn) as first_usn,
        MAX(usn) as last_usn
      FROM students
      GROUP BY section
      ORDER BY section;
    `);

    console.log('\n👥 STUDENTS:');
    studentStats.rows.forEach(row => {
      console.log(`\n   Section ${row.section}:`);
      console.log(`     Total: ${row.total} students`);
      console.log(`     ID Range: ${row.min_id} to ${row.max_id}`);
      console.log(`     USN Range: ${row.first_usn} to ${row.last_usn}`);
    });

    // Attendance summary
    const attendanceStats = await pool.query(`
      SELECT 
        section,
        COUNT(*) as total_records,
        COUNT(DISTINCT student_id) as unique_students,
        COUNT(DISTINCT attendance_date) as unique_dates,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_count,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent_count
      FROM attendance
      WHERE section IS NOT NULL
      GROUP BY section
      ORDER BY section;
    `);

    console.log('\n\n📋 ATTENDANCE:');
    if (attendanceStats.rowCount > 0) {
      attendanceStats.rows.forEach(row => {
        console.log(`\n   Section ${row.section}:`);
        console.log(`     Total Records: ${row.total_records}`);
        console.log(`     Unique Students: ${row.unique_students}`);
        console.log(`     Dates Covered: ${row.unique_dates}`);
        console.log(`     Present: ${row.present_count} | Absent: ${row.absent_count}`);
      });
    } else {
      console.log('     No attendance records found');
    }

    // Marks summary
    const marksStats = await pool.query(`
      SELECT 
        section,
        COUNT(*) as total_records,
        COUNT(DISTINCT student_id) as unique_students,
        AVG(marks_obtained) as avg_marks
      FROM marks
      WHERE section IS NOT NULL
      GROUP BY section
      ORDER BY section;
    `);

    console.log('\n\n📝 MARKS:');
    if (marksStats.rowCount > 0) {
      marksStats.rows.forEach(row => {
        console.log(`\n   Section ${row.section}:`);
        console.log(`     Total Records: ${row.total_records}`);
        console.log(`     Unique Students: ${row.unique_students}`);
        console.log(`     Average Marks: ${parseFloat(row.avg_marks).toFixed(2)}`);
      });
    } else {
      console.log('     No marks records found yet');
    }

    // Check for any records without sections
    const missingSection = await pool.query(`
      SELECT 
        'attendance' as table_name,
        COUNT(*) as count
      FROM attendance
      WHERE section IS NULL
      UNION ALL
      SELECT 
        'marks' as table_name,
        COUNT(*) as count
      FROM marks
      WHERE section IS NULL;
    `);

    console.log('\n\n⚠️  RECORDS WITHOUT SECTION:');
    let hasMissing = false;
    missingSection.rows.forEach(row => {
      if (row.count > 0) {
        console.log(`     ${row.table_name}: ${row.count} records need updating`);
        hasMissing = true;
      }
    });
    if (!hasMissing) {
      console.log('     ✅ All records have sections assigned!');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Verification completed successfully!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during verification:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run verification
verifySections();
