import pool from '../config/database.js';

async function addSectionColumn() {
  try {
    console.log('🔄 Adding section column to students table...\n');

    // Add section column
    const alterQuery = `
      ALTER TABLE students 
      ADD COLUMN IF NOT EXISTS section VARCHAR(10) DEFAULT 'A';
    `;
    
    await pool.query(alterQuery);
    console.log('✅ Section column added successfully!');

    // Update existing students based on their USN
    // Section A: 4PM23CS001-066, 4PM24CS400-402
    // Section B: 4PM23CS067-126, 4PM24CS403-411
    const updateQuery = `
      UPDATE students
      SET section = CASE
        WHEN (usn LIKE '4PM23CS0%' AND CAST(SUBSTRING(usn FROM 9) AS INTEGER) <= 66) THEN 'A'
        WHEN (usn LIKE '4PM23CS0%' AND CAST(SUBSTRING(usn FROM 9) AS INTEGER) >= 67) THEN 'B'
        WHEN (usn LIKE '4PM23CS1%') THEN 'B'
        WHEN (usn LIKE '4PM24CS40%' AND CAST(SUBSTRING(usn FROM 9) AS INTEGER) <= 402) THEN 'A'
        WHEN (usn LIKE '4PM24CS40%' AND CAST(SUBSTRING(usn FROM 9) AS INTEGER) >= 403) THEN 'B'
        WHEN (usn LIKE '4PM24CS41%') THEN 'B'
        ELSE 'A'
      END
      WHERE section IS NULL OR section = 'A';
    `;

    await pool.query(updateQuery);
    console.log('✅ Existing students section updated!');

    // Verify the update
    const verifyQuery = `
      SELECT section, COUNT(*) as count
      FROM students
      GROUP BY section
      ORDER BY section;
    `;
    
    const result = await pool.query(verifyQuery);
    console.log('\n📊 Students by Section:');
    result.rows.forEach(row => {
      console.log(`   Section ${row.section}: ${row.count} students`);
    });

    console.log('\n✅ Migration completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding section column:', error);
    process.exit(1);
  }
}

addSectionColumn();
