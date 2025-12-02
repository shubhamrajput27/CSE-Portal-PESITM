import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'cse_portal_pesitm',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432
});

async function testStudentData() {
  console.log('\n📊 Testing Student Data\n');
  console.log('='.repeat(60));

  try {
    // Check total students
    const countResult = await pool.query('SELECT COUNT(*) FROM students');
    console.log(`\n✅ Total students: ${countResult.rows[0].count}`);

    // Check students with credentials
    const studentsResult = await pool.query(`
      SELECT usn, full_name, email, section, semester, is_active
      FROM students 
      WHERE usn IN ('4PM23CS001', '4PM23CS002', '4PM23CS067', '4PM23CS101')
      ORDER BY usn
    `);

    console.log('\n📋 Sample student records:');
    console.table(studentsResult.rows);

    // Check password hashes
    const passwordCheck = await pool.query(`
      SELECT usn, password_hash IS NOT NULL as has_password
      FROM students 
      LIMIT 5
    `);

    console.log('\n🔐 Password hash check (first 5):');
    console.table(passwordCheck.rows);

    // Check inactive students
    const inactiveResult = await pool.query(`
      SELECT COUNT(*) as count FROM students WHERE is_active = false
    `);
    console.log(`\n⚠️  Inactive students: ${inactiveResult.rows[0].count}`);

    console.log('\n' + '='.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

testStudentData();
