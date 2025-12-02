import { pool } from '../config/database.js';

async function createAttendanceTables() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Creating attendance and marks tables...\n');
    
    await client.query('BEGIN');
    
    // Create subjects table first (if not exists)
    await client.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id SERIAL PRIMARY KEY,
        subject_code VARCHAR(20) UNIQUE NOT NULL,
        subject_name VARCHAR(200) NOT NULL,
        semester INTEGER NOT NULL CHECK (semester >= 1 AND semester <= 8),
        credits INTEGER DEFAULT 3,
        department VARCHAR(100) DEFAULT 'CSE',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Subjects table created/verified');
    
    // Create attendance table
    await client.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
        faculty_id INTEGER REFERENCES faculty_users(id) ON DELETE SET NULL,
        attendance_date DATE NOT NULL,
        status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late')),
        period_number INTEGER DEFAULT 1,
        academic_year VARCHAR(20),
        semester INTEGER,
        remarks TEXT,
        marked_by INTEGER REFERENCES faculty_users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, subject_id, attendance_date, period_number)
      )
    `);
    console.log('✅ Attendance table created');
    
    // Create indexes for attendance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
      CREATE INDEX IF NOT EXISTS idx_attendance_subject ON attendance(subject_id);
      CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attendance_date);
      CREATE INDEX IF NOT EXISTS idx_attendance_faculty ON attendance(faculty_id);
    `);
    console.log('✅ Attendance indexes created');
    
    // Create marks table
    await client.query(`
      CREATE TABLE IF NOT EXISTS marks (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
        faculty_id INTEGER REFERENCES faculty_users(id) ON DELETE SET NULL,
        exam_type VARCHAR(50) NOT NULL CHECK (exam_type IN ('IA1', 'IA2', 'IA3', 'Assignment', 'Quiz', 'Final')),
        marks_obtained DECIMAL(5,2) NOT NULL,
        max_marks DECIMAL(5,2) NOT NULL,
        exam_date DATE,
        academic_year VARCHAR(20),
        semester INTEGER,
        remarks TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, subject_id, exam_type, exam_date)
      )
    `);
    console.log('✅ Marks table created');
    
    // Create indexes for marks
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_marks_student ON marks(student_id);
      CREATE INDEX IF NOT EXISTS idx_marks_subject ON marks(subject_id);
      CREATE INDEX IF NOT EXISTS idx_marks_exam_type ON marks(exam_type);
      CREATE INDEX IF NOT EXISTS idx_marks_faculty ON marks(faculty_id);
    `);
    console.log('✅ Marks indexes created');
    
    // Insert some sample subjects for semester 5
    await client.query(`
      INSERT INTO subjects (subject_code, subject_name, semester, credits) VALUES
        ('CS501', 'Computer Networks', 5, 4),
        ('CS502', 'Database Management Systems', 5, 4),
        ('CS503', 'Operating Systems', 5, 4),
        ('CS504', 'Software Engineering', 5, 3),
        ('CS505', 'Web Technologies', 5, 3)
      ON CONFLICT (subject_code) DO NOTHING
    `);
    console.log('✅ Sample subjects inserted');
    
    await client.query('COMMIT');
    
    // Verify table creation
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name IN ('attendance', 'marks', 'subjects')
      ORDER BY table_name
    `);
    
    console.log('\n📊 Created tables:');
    result.rows.forEach(row => console.log(`   - ${row.table_name}`));
    
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

createAttendanceTables();
