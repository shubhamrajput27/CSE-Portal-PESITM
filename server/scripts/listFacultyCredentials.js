import pool from '../config/database.js';

async function listFaculty() {
  try {
    console.log('📋 Listing all faculty credentials...\n');
    
    const result = await pool.query(
      `SELECT id, faculty_id, full_name, email, designation, is_active
       FROM faculty_users 
       ORDER BY id`
    );
    
    console.log(`Total Faculty: ${result.rows.length}\n`);
    console.log('='.repeat(80));
    
    result.rows.forEach((faculty, index) => {
      console.log(`\n${index + 1}. ${faculty.full_name}`);
      console.log(`   Database ID: ${faculty.id}`);
      console.log(`   Faculty ID: ${faculty.faculty_id}`);
      console.log(`   Email: ${faculty.email}`);
      console.log(`   Designation: ${faculty.designation}`);
      console.log(`   Status: ${faculty.is_active ? '✅ Active' : '❌ Inactive'}`);
      console.log(`   Login: Email = ${faculty.email}, Password = (default: password123)`);
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('\n💡 To login: Use email address as username\n');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

listFaculty();
