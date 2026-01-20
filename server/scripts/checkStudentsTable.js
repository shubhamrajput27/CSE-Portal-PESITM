import pool from '../config/database.js';

const checkStudentsTable = async () => {
  const client = await pool.connect();
  
  try {
    // Get column information for students table
    const columnQuery = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'students'
      ORDER BY ordinal_position;
    `);
    
    console.log('Students table columns:');
    columnQuery.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // Get a sample student
    const sampleQuery = await client.query('SELECT * FROM students LIMIT 1');
    console.log('\nSample student data:');
    if (sampleQuery.rows.length > 0) {
      console.log(JSON.stringify(sampleQuery.rows[0], null, 2));
    } else {
      console.log('No students found in database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    client.release();
    process.exit(0);
  }
};

checkStudentsTable();
