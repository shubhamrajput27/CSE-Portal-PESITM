import pool from '../config/database.js';

/**
 * Create mentor_mentee table and add current_mentor_id to students
 */

async function createMentorTables() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Creating Mentor-Mentee Tables...\n');
    
    // Create mentor_mentee table
    await client.query(`
      CREATE TABLE IF NOT EXISTS mentor_mentee (
        id SERIAL PRIMARY KEY,
        faculty_id INTEGER REFERENCES faculty_users(id) ON DELETE SET NULL,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        academic_year VARCHAR(20) NOT NULL,
        assigned_date DATE DEFAULT CURRENT_DATE,
        remarks TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, academic_year)
      )
    `);
    console.log('✅ Created mentor_mentee table');
    
    // Add current_mentor_id to students table
    await client.query(`
      ALTER TABLE students 
      ADD COLUMN IF NOT EXISTS current_mentor_id INTEGER REFERENCES faculty_users(id)
    `);
    console.log('✅ Added current_mentor_id column to students table');
    
    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_mentor_mentee_faculty 
      ON mentor_mentee(faculty_id)
    `);
    console.log('✅ Created index on faculty_id');
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_mentor_mentee_student 
      ON mentor_mentee(student_id)
    `);
    console.log('✅ Created index on student_id');
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_mentor_mentee_academic_year 
      ON mentor_mentee(academic_year)
    `);
    console.log('✅ Created index on academic_year');
    
    // Create mentee_remarks table (optional - for detailed notes)
    await client.query(`
      CREATE TABLE IF NOT EXISTS mentee_remarks (
        id SERIAL PRIMARY KEY,
        mentor_id INTEGER REFERENCES faculty_users(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        remark_text TEXT NOT NULL,
        remark_date DATE DEFAULT CURRENT_DATE,
        category VARCHAR(50),
        is_private BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created mentee_remarks table');
    
    // Check counts
    const mentorMenteeCount = await client.query('SELECT COUNT(*) as count FROM mentor_mentee');
    const studentCount = await client.query('SELECT COUNT(*) as count FROM students WHERE is_active = TRUE');
    const facultyCount = await client.query('SELECT COUNT(*) as count FROM faculty_users WHERE is_active = TRUE');
    
    console.log('\n📊 Current Status:');
    console.log(`   Students: ${studentCount.rows[0].count}`);
    console.log(`   Faculty: ${facultyCount.rows[0].count}`);
    console.log(`   Mentor Assignments: ${mentorMenteeCount.rows[0].count}`);
    
    console.log('\n✅ Mentor-Mentee tables created successfully!');
    console.log('\n💡 Next Step: Run the assignment script:');
    console.log('   node scripts/assignMentorsToStudents.js\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    client.release();
    await pool.end();
  }
}

createMentorTables();
