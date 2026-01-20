import pool from '../config/database.js';

const updateAcademicYear = async () => {
  const client = await pool.connect();
  
  try {
    console.log('Updating academic year to 2025-26...');
    
    const query = `
      UPDATE system_settings
      SET setting_value = '2025-26',
          updated_at = CURRENT_TIMESTAMP
      WHERE setting_key = 'current_academic_year'
      RETURNING *
    `;
    
    const result = await client.query(query);
    
    if (result.rows.length > 0) {
      console.log('✅ Academic year updated successfully!');
      console.log(JSON.stringify(result.rows[0], null, 2));
    } else {
      // Insert if doesn't exist
      console.log('Academic year setting not found, creating...');
      const insertQuery = `
        INSERT INTO system_settings (setting_key, setting_value, description)
        VALUES ('current_academic_year', '2025-26', 'Current academic year')
        RETURNING *
      `;
      const insertResult = await client.query(insertQuery);
      console.log('✅ Academic year created successfully!');
      console.log(JSON.stringify(insertResult.rows[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    client.release();
    process.exit(0);
  }
};

updateAcademicYear();
