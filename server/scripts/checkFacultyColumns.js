import { pool } from '../config/database.js';

async function checkColumns() {
  try {
    console.log('📋 Checking faculty_users table structure...\n');
    
    const result = await pool.query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'faculty_users' 
      ORDER BY ordinal_position
    `);
    
    console.log('Columns in faculty_users table:');
    console.log('================================');
    result.rows.forEach(col => {
      console.log(`  ${col.column_name} (${col.data_type})${col.column_default ? ` DEFAULT ${col.column_default}` : ''}`);
    });
    console.log('');
    
    // Check if is_active exists
    const hasIsActive = result.rows.some(col => col.column_name === 'is_active');
    console.log(`✅ is_active column exists: ${hasIsActive}`);
    
    // Get sample faculty record
    const sampleResult = await pool.query(`
      SELECT faculty_id, full_name, email, is_active 
      FROM faculty_users 
      WHERE faculty_id = 'FAC001'
      LIMIT 1
    `);
    
    if (sampleResult.rows.length > 0) {
      console.log('\n📋 Sample faculty record (FAC001):');
      console.log(JSON.stringify(sampleResult.rows[0], null, 2));
    } else {
      console.log('\n❌ No faculty found with faculty_id = FAC001');
      
      // Show all faculty_ids
      const allFaculty = await pool.query(`
        SELECT faculty_id, full_name, email, is_active 
        FROM faculty_users 
        ORDER BY faculty_id
      `);
      console.log('\n📋 All faculty in database:');
      allFaculty.rows.forEach(f => {
        console.log(`  ${f.faculty_id} - ${f.full_name} (${f.email}) [active: ${f.is_active}]`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkColumns();
