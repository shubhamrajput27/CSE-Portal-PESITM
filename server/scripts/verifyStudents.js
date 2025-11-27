import pool from '../config/database.js';

async function verifyStudents() {
  try {
    const query = `
      SELECT section, COUNT(*) as count 
      FROM students 
      GROUP BY section 
      ORDER BY section
    `;
    
    const result = await pool.query(query);
    
    console.log('\n📊 Students Database Summary:');
    console.log('================================');
    result.rows.forEach(row => {
      console.log(`  Section ${row.section}: ${row.count} students`);
    });
    
    const totalQuery = 'SELECT COUNT(*) as total FROM students';
    const totalResult = await pool.query(totalQuery);
    console.log(`  Total: ${totalResult.rows[0].total} students`);
    console.log('================================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyStudents();
