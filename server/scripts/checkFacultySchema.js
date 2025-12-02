import pool from '../config/database.js';

async function checkSchema() {
  try {
    // Check faculty_users columns
    const facultyColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'faculty_users' 
      ORDER BY column_name
    `);
    
    console.log('\n📋 Faculty Users Table Columns:');
    console.log('================================');
    facultyColumns.rows.forEach(row => {
      console.log(`  - ${row.column_name}`);
    });
    
    // Check if students are accessible
    const students = await pool.query('SELECT COUNT(*) as count FROM students');
    console.log('\n📊 Database Summary:');
    console.log('================================');
    console.log(`  Total Students: ${students.rows[0].count}`);
    
    const bySection = await pool.query(`
      SELECT section, COUNT(*) as count 
      FROM students 
      GROUP BY section 
      ORDER BY section
    `);
    bySection.rows.forEach(row => {
      console.log(`  Section ${row.section}: ${row.count} students`);
    });
    console.log('================================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkSchema();
