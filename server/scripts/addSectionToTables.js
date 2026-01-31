import pool from '../config/database.js';

async function addSectionColumn() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Adding section column to tables...');
    
    // Add section to students table if not exists
    await client.query(`
      ALTER TABLE students 
      ADD COLUMN IF NOT EXISTS section VARCHAR(10) DEFAULT 'A'
    `);
    console.log('✅ Section column added to students table');
    
    // Add section to attendance table if not exists
    await client.query(`
      ALTER TABLE attendance 
      ADD COLUMN IF NOT EXISTS section VARCHAR(10)
    `);
    console.log('✅ Section column added to attendance table');
    
    // Add section to marks table if not exists
    await client.query(`
      ALTER TABLE marks 
      ADD COLUMN IF NOT EXISTS section VARCHAR(10)
    `);
    console.log('✅ Section column added to marks table');
    
    console.log('✅ All section columns added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding section columns:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

addSectionColumn();
