import pool from '../config/database.js';

const addMissingColumns = async () => {
  const client = await pool.connect();
  
  try {
    console.log('Adding missing columns to subjects table...');
    
    await client.query(`
      ALTER TABLE subjects 
      ADD COLUMN IF NOT EXISTS is_lab BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS syllabus_file VARCHAR(255),
      ADD COLUMN IF NOT EXISTS description TEXT;
    `);
    
    console.log('✅ Columns added successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    client.release();
    process.exit(0);
  }
};

addMissingColumns();
