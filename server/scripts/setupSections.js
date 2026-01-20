import pool from '../config/database.js';

/**
 * Setup sections for CSE students
 * Section A: Students 1-64
 * Section B: Students 65-133
 */

async function setupSections() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Setting up sections for students...\n');

    await client.query('BEGIN');

    // Step 1: Add section column to students table if it doesn't exist
    console.log('📝 Adding section column to students table...');
    await client.query(`
      ALTER TABLE students 
      ADD COLUMN IF NOT EXISTS section VARCHAR(10) DEFAULT 'A';
    `);
    console.log('✅ Section column added');

    // Step 2: Create index for section column
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_students_section ON students(section);
    `);
    console.log('✅ Section index created');

    // Step 3: Update students based on student_id (1-64 = A, 65-133 = B)
    console.log('\n📊 Updating student sections...');
    
    // Update Section A (student_id 1-64)
    const updateSectionA = await client.query(`
      UPDATE students
      SET section = 'A'
      WHERE CAST(REGEXP_REPLACE(student_id, '[^0-9]', '', 'g') AS INTEGER) BETWEEN 1 AND 64
      RETURNING id, student_id, full_name, section;
    `);
    console.log(`✅ Section A: ${updateSectionA.rowCount} students updated`);

    // Update Section B (student_id 65-133)
    const updateSectionB = await client.query(`
      UPDATE students
      SET section = 'B'
      WHERE CAST(REGEXP_REPLACE(student_id, '[^0-9]', '', 'g') AS INTEGER) BETWEEN 65 AND 133
      RETURNING id, student_id, full_name, section;
    `);
    console.log(`✅ Section B: ${updateSectionB.rowCount} students updated`);

    // Step 4: Add section column to attendance table if it doesn't exist
    console.log('\n📝 Updating attendance table...');
    await client.query(`
      ALTER TABLE attendance 
      ADD COLUMN IF NOT EXISTS section VARCHAR(10);
    `);
    
    // Update existing attendance records with student sections
    await client.query(`
      UPDATE attendance a
      SET section = s.section
      FROM students s
      WHERE a.student_id = s.id AND a.section IS NULL;
    `);
    console.log('✅ Attendance table updated with sections');

    // Create index for attendance section
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_attendance_section ON attendance(section);
    `);

    // Step 5: Add section column to marks table if it doesn't exist
    console.log('\n📝 Updating marks table...');
    await client.query(`
      ALTER TABLE marks 
      ADD COLUMN IF NOT EXISTS section VARCHAR(10);
    `);
    
    // Update existing marks records with student sections
    await client.query(`
      UPDATE marks m
      SET section = s.section
      FROM students s
      WHERE m.student_id = s.id AND m.section IS NULL;
    `);
    console.log('✅ Marks table updated with sections');

    // Create index for marks section
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_marks_section ON marks(section);
    `);

    // Step 6: Update faculty_subjects table
    console.log('\n📝 Checking faculty_subjects table...');
    const facultySubjectsExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'faculty_subjects'
      );
    `);

    if (facultySubjectsExists.rows[0].exists) {
      // Section column should already exist in faculty_subjects as per schema
      console.log('✅ Faculty subjects table already has section support');
    }

    await client.query('COMMIT');

    // Step 7: Verify the setup
    console.log('\n📊 VERIFICATION REPORT\n' + '='.repeat(50));
    
    // Students by section
    const studentStats = await client.query(`
      SELECT 
        section,
        COUNT(*) as total_students,
        MIN(student_id) as first_student,
        MAX(student_id) as last_student
      FROM students
      GROUP BY section
      ORDER BY section;
    `);
    
    console.log('\n👥 STUDENTS BY SECTION:');
    studentStats.rows.forEach(row => {
      console.log(`   Section ${row.section}: ${row.total_students} students`);
      console.log(`   Range: ${row.first_student} to ${row.last_student}`);
    });

    // Attendance records by section
    const attendanceStats = await client.query(`
      SELECT 
        COALESCE(section, 'Not Set') as section,
        COUNT(*) as total_records
      FROM attendance
      GROUP BY section
      ORDER BY section;
    `);
    
    if (attendanceStats.rowCount > 0) {
      console.log('\n📋 ATTENDANCE RECORDS BY SECTION:');
      attendanceStats.rows.forEach(row => {
        console.log(`   Section ${row.section}: ${row.total_records} records`);
      });
    } else {
      console.log('\n📋 No attendance records found yet');
    }

    // Marks records by section
    const marksStats = await client.query(`
      SELECT 
        COALESCE(section, 'Not Set') as section,
        COUNT(*) as total_records
      FROM marks
      GROUP BY section
      ORDER BY section;
    `);
    
    if (marksStats.rowCount > 0) {
      console.log('\n📝 MARKS RECORDS BY SECTION:');
      marksStats.rows.forEach(row => {
        console.log(`   Section ${row.section}: ${row.total_records} records`);
      });
    } else {
      console.log('\n📝 No marks records found yet');
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Section setup completed successfully!\n');
    
    process.exit(0);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Error setting up sections:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
  }
}

// Run the setup
setupSections();
