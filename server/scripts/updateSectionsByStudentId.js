import pool from '../config/database.js';

/**
 * Update sections based on student_id numeric value
 * Section A: Students with ID containing 1-64
 * Section B: Students with ID containing 65-133
 */

async function updateSectionsByStudentId() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Updating student sections based on student_id...\n');

    await client.query('BEGIN');

    // Get all students and update their sections based on numeric ID
    const students = await client.query(`
      SELECT id, student_id, usn, full_name 
      FROM students 
      ORDER BY student_id
    `);

    console.log(`📊 Found ${students.rowCount} students total\n`);

    let sectionACount = 0;
    let sectionBCount = 0;

    for (const student of students.rows) {
      // Extract numeric part from student_id
      const numericMatch = student.student_id.match(/\d+/g);
      if (numericMatch) {
        // Get the last number which is typically the student number
        const lastNumber = numericMatch[numericMatch.length - 1];
        const studentNumber = parseInt(lastNumber, 10);
        
        let section;
        if (studentNumber >= 1 && studentNumber <= 64) {
          section = 'A';
          sectionACount++;
        } else if (studentNumber >= 65 && studentNumber <= 133) {
          section = 'B';
          sectionBCount++;
        } else {
          // Default to section based on USN
          section = student.usn && student.usn.includes('067') ? 'B' : 'A';
        }

        await client.query(`
          UPDATE students 
          SET section = $1 
          WHERE id = $2
        `, [section, student.id]);

        console.log(`   ${student.student_id} (${student.usn}) → Section ${section}`);
      }
    }

    // Update attendance records
    await client.query(`
      UPDATE attendance a
      SET section = s.section
      FROM students s
      WHERE a.student_id = s.id;
    `);

    // Update marks records
    await client.query(`
      UPDATE marks m
      SET section = s.section
      FROM students s
      WHERE m.student_id = s.id;
    `);

    await client.query('COMMIT');

    // Verification
    console.log('\n📊 FINAL SECTION DISTRIBUTION:\n' + '='.repeat(50));
    console.log(`   Section A: ${sectionACount} students (IDs 1-64)`);
    console.log(`   Section B: ${sectionBCount} students (IDs 65-133)`);

    const verifyQuery = await client.query(`
      SELECT section, COUNT(*) as count
      FROM students
      GROUP BY section
      ORDER BY section;
    `);
    
    console.log('\n✅ Database Verification:');
    verifyQuery.rows.forEach(row => {
      console.log(`   Section ${row.section}: ${row.count} students`);
    });

    console.log('\n✅ Section update completed successfully!\n');
    process.exit(0);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Error updating sections:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
  }
}

// Run the update
updateSectionsByStudentId();
