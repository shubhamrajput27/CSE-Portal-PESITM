import pg from 'pg'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const { Pool } = pg
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env') })

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pesitm_cse_portal',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
})

async function addAchievementsTable() {
  try {
    console.log('🔄 Adding achievements table to database...')

    // Create achievements table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS achievements (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        achiever_name VARCHAR(100) NOT NULL,
        achievement_date DATE NOT NULL,
        award_type VARCHAR(100),
        organization VARCHAR(200),
        details TEXT,
        author_id INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)
    console.log('✅ Achievements table created')

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
      CREATE INDEX IF NOT EXISTS idx_achievements_date ON achievements(achievement_date);
      CREATE INDEX IF NOT EXISTS idx_achievements_achiever ON achievements(achiever_name);
    `)
    console.log('✅ Indexes created')

    // Create trigger (drop if exists first)
    await pool.query(`
      DROP TRIGGER IF EXISTS update_achievements_updated_at ON achievements;
    `)
    await pool.query(`
      CREATE TRIGGER update_achievements_updated_at 
        BEFORE UPDATE ON achievements 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    `)
    console.log('✅ Trigger created')

    // Insert sample data (without author_id to avoid foreign key constraint)
    await pool.query(`
      INSERT INTO achievements (title, description, category, achiever_name, achievement_date, award_type, organization, details) VALUES
      ('First Prize in National Hackathon', 'Our team won first place in the national level hackathon organized by IIT Delhi, competing against 150+ teams from across the country.', 'student', 'Rahul Sharma, Priya Singh, Amit Kumar', '2024-11-15', 'Gold Medal', 'IIT Delhi', 'Developed an innovative AI-powered solution for smart agriculture. Prize money: ₹1,00,000'),
      ('Best Paper Award at IEEE Conference', 'Research paper on Machine Learning algorithms published and awarded best paper at International IEEE Conference.', 'faculty', 'Dr. Manu A P', '2024-10-20', 'Best Paper Award', 'IEEE International Conference', 'Paper titled "Novel Approaches to Deep Learning in Healthcare" recognized among 200+ submissions.'),
      ('NBA Accreditation Achieved', 'Department successfully received NBA accreditation for CSE program, valid for 3 years (2024-2027).', 'department', 'CSE Department', '2024-09-01', 'Accreditation', 'National Board of Accreditation', 'Comprehensive evaluation covering curriculum, infrastructure, faculty qualifications, and student outcomes.'),
      ('Smart City Project Excellence Award', 'Research team received excellence award for Smart City IoT implementation project.', 'research', 'Dr. Chethan L S and Team', '2024-08-10', 'Excellence Award', 'Ministry of Urban Development', 'Implemented IoT-based smart traffic management system in Bangalore. Grant amount: ₹50 lakhs'),
      ('Inter-College Coding Championship Winner', 'Students secured first position in state-level coding competition with 80+ participating colleges.', 'competition', 'Sneha Reddy, Karthik Gowda', '2024-07-25', 'First Prize', 'Karnataka State IT Association', 'Solved complex algorithmic challenges in record time. Won trophy and certificates.'),
      ('Outstanding Teacher Award', 'Recognized for exceptional teaching and student mentorship over the past academic year.', 'award', 'Dr. Prasanna Kumar H R', '2024-06-15', 'Outstanding Teacher Award', 'PESTRUST Management', 'Honored for innovative teaching methods and 95%+ student satisfaction rating.'),
      ('Startup Incubation Success', 'Student startup "TechVenture" successfully incubated and received seed funding.', 'student', 'Arjun Patel (Batch 2021)', '2024-05-01', 'Seed Funding', 'Karnataka Startup Cell', 'EdTech startup raised ₹25 lakhs seed funding. Product: AI-powered learning platform.'),
      ('Research Grant Sanctioned', 'Major research grant of ₹75 lakhs sanctioned by DST for AI in Agriculture project.', 'research', 'Dr. Priya Sharma', '2024-04-10', 'Research Grant', 'Department of Science & Technology', '3-year project on precision farming using AI and drone technology.')
      ON CONFLICT DO NOTHING;
    `)
    console.log('✅ Sample achievements data inserted')

    console.log('🎉 Achievements table setup completed successfully!')
  } catch (error) {
    console.error('❌ Error setting up achievements table:', error.message)
    throw error
  } finally {
    await pool.end()
  }
}

addAchievementsTable()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
