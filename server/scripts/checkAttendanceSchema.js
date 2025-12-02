import { pool } from '../config/database.js';

async function checkSchema() {
  try {
    // Check if table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'attendance'
      )
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('❌ Attendance table does not exist');
      process.exit(1);
    }
    
    console.log('✅ Attendance table exists\n');
    
    // Get columns
    const columns = await pool.query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'attendance' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Attendance table columns:');
    console.log('================================');
    columns.rows.forEach(col => {
      console.log(`  ${col.column_name} (${col.data_type})${col.column_default ? ` DEFAULT ${col.column_default}` : ''}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkSchema();
