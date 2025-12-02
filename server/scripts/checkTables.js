import { pool } from '../config/database.js';

async function checkTables() {
  try {
    console.log('📋 Checking for required tables...\n');
    
    const tables = ['faculty_users', 'faculty_activity_log', 'students'];
    
    for (const tableName of tables) {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = $1
        )
      `, [tableName]);
      
      const exists = result.rows[0].exists;
      console.log(`  ${exists ? '✅' : '❌'} ${tableName}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkTables();
