import pool from '../config/database.js';

const checkTableStructure = async () => {
  const client = await pool.connect();
  
  try {
    // Check if subjects table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'subjects'
      );
    `);
    
    console.log('Subjects table exists:', tableCheck.rows[0].exists);
    
    if (tableCheck.rows[0].exists) {
      // Get column information
      const columnQuery = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'subjects'
        ORDER BY ordinal_position;
      `);
      
      console.log('\nSubjects table columns:');
      columnQuery.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
    } else {
      console.log('\n Creating subjects table...');
      
      // Create the subjects table
      await client.query(`
        CREATE TABLE subjects (
          id SERIAL PRIMARY KEY,
          subject_code VARCHAR(20) UNIQUE NOT NULL,
          subject_name VARCHAR(200) NOT NULL,
          semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
          credits INTEGER DEFAULT 4,
          department VARCHAR(100) DEFAULT 'CSE',
          is_lab BOOLEAN DEFAULT FALSE,
          syllabus_file VARCHAR(255),
          description TEXT,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      console.log('✅ Subjects table created!');
    }
    
    // Check faculty_subjects table
    const facultySubjectsCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'faculty_subjects'
      );
    `);
    
    console.log('\nFaculty_subjects table exists:', facultySubjectsCheck.rows[0].exists);
    
    if (!facultySubjectsCheck.rows[0].exists) {
      console.log('Creating faculty_subjects table...');
      
      await client.query(`
        CREATE TABLE faculty_subjects (
          id SERIAL PRIMARY KEY,
          faculty_id INTEGER REFERENCES faculty_users(id) ON DELETE CASCADE,
          subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
          academic_year VARCHAR(20) NOT NULL,
          section VARCHAR(10),
          assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(faculty_id, subject_id, academic_year, section)
        );
      `);
      
      console.log('✅ Faculty_subjects table created!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    client.release();
    process.exit(0);
  }
};

checkTableStructure();
