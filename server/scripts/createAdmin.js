import pkg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function createAdminUser() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'pesitm_cse_portal',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Delete existing admin if exists
    await client.query(`DELETE FROM admin_users WHERE username = 'admin'`);
    console.log('🗑️  Removed old admin user');

    // Create new admin with proper password hash
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await client.query(
      `INSERT INTO admin_users (username, email, password_hash, full_name, role, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      ['admin', 'admin@pestrust.edu.in', hashedPassword, 'System Administrator', 'super_admin', true]
    );

    console.log('✅ Admin user created successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n🔐 Password Hash:', hashedPassword);

    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdminUser();
