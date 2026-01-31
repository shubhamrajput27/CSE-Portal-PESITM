import pool from '../config/database.js';

async function assignSubjectsToFaculty() {
  try {
    console.log('🔧 Assigning 5th Semester subjects to faculty...\n');
    
    // Get first faculty member
    const facultyResult = await pool.query('SELECT id, faculty_id, full_name FROM faculty_users LIMIT 1');
    if (facultyResult.rows.length === 0) {
      console.log('❌ No faculty found!');
      return;
    }
    
    const faculty = facultyResult.rows[0];
    console.log(`👨‍🏫 Faculty: ${faculty.full_name} (ID: ${faculty.id})`);
    
    // Get 5th semester subjects
    const subjectsResult = await pool.query(`
      SELECT id, subject_code, subject_name 
      FROM subjects 
      WHERE semester = 5 AND is_active = TRUE
      LIMIT 5
    `);
    
    if (subjectsResult.rows.length === 0) {
      console.log('❌ No 5th semester subjects found!');
      return;
    }
    
    console.log(`\n📚 Found ${subjectsResult.rows.length} subjects for semester 5`);
    
    // Assign subjects to faculty
    for (const subject of subjectsResult.rows) {
      try {
        await pool.query(`
          INSERT INTO faculty_subjects (faculty_id, subject_id, academic_year, section)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (faculty_id, subject_id, academic_year, section) DO NOTHING
        `, [faculty.id, subject.id, '2025-26', 'A']);
        
        console.log(`   ✅ Assigned: ${subject.subject_code} - ${subject.subject_name} (Section A)`);
      } catch (err) {
        console.log(`   ⚠️  Already assigned: ${subject.subject_code}`);
      }
    }
    
    // Also assign to Section B
    for (const subject of subjectsResult.rows) {
      try {
        await pool.query(`
          INSERT INTO faculty_subjects (faculty_id, subject_id, academic_year, section)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (faculty_id, subject_id, academic_year, section) DO NOTHING
        `, [faculty.id, subject.id, '2025-26', 'B']);
        
        console.log(`   ✅ Assigned: ${subject.subject_code} - ${subject.subject_name} (Section B)`);
      } catch (err) {
        console.log(`   ⚠️  Already assigned: ${subject.subject_code}`);
      }
    }
    
    console.log('\n✅ Assignment complete!');
    console.log(`\n💡 Faculty ${faculty.full_name} can now mark attendance for 5th sem students.`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

assignSubjectsToFaculty();
