import pool from '../config/database.js';

async function addFacultyIsActiveColumn() {
  try {
    console.log('🔄 Adding is_active column to faculty_users table...\n');

    // Add is_active column
    const alterQuery = `
      ALTER TABLE faculty_users 
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    `;
    
    await pool.query(alterQuery);
    console.log('✅ is_active column added successfully!');

    // Update all existing faculty to active
    const updateQuery = `
      UPDATE faculty_users
      SET is_active = TRUE
      WHERE is_active IS NULL;
    `;

    const result = await pool.query(updateQuery);
    console.log(`✅ Updated ${result.rowCount} faculty records to active!`);

    // Verify the update
    const verifyQuery = `
      SELECT COUNT(*) as count, is_active
      FROM faculty_users
      GROUP BY is_active
      ORDER BY is_active DESC;
    `;
    
    const verifyResult = await pool.query(verifyQuery);
    console.log('\n📊 Faculty by Active Status:');
    verifyResult.rows.forEach(row => {
      console.log(`   Active=${row.is_active}: ${row.count} faculty`);
    });

    console.log('\n✅ Migration completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding is_active column:', error);
    process.exit(1);
  }
}

addFacultyIsActiveColumn();
