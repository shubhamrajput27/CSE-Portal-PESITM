import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupEnhancedSchema = async () => {
  const client = await pool.connect();
  
  try {
    console.log('📚 Reading enhanced schema SQL file...');
    
    const sqlFilePath = path.join(__dirname, '../database/enhanced_schema.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('⚡ Executing enhanced schema...');
    
    await client.query(sqlContent);
    
    console.log('✅ Enhanced schema created successfully!');
    console.log('\nCreated tables:');
    console.log('  • subjects');
    console.log('  • faculty_subjects');
    console.log('  • mentor_mentee');
    console.log('  • attendance');
    console.log('  • marks');
    console.log('  • study_materials');
    console.log('  • timetable');
    console.log('  • notices');
    console.log('  • leave_requests');
    console.log('  • and more...\n');
    
  } catch (error) {
    console.error('❌ Error setting up enhanced schema:', error);
    throw error;
  } finally {
    client.release();
  }
};

setupEnhancedSchema()
  .then(() => {
    console.log('✅ Database setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
