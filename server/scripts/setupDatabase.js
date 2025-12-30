import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const { Client } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function setupDatabase() {
  // First, connect to postgres database to create our database
  const adminClient = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres', // Connect to default postgres database
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
  });

  try {
    console.log('🔗 Connecting to PostgreSQL...');
    await adminClient.connect();
    
    // Check if database exists
    const dbName = process.env.DB_NAME || 'pesitm_cse_portal';
    const checkDbQuery = `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`;
    const result = await adminClient.query(checkDbQuery);
    
    if (result.rows.length === 0) {
      console.log(`📦 Creating database: ${dbName}...`);
      await adminClient.query(`CREATE DATABASE ${dbName}`);
      console.log('✅ Database created successfully!');
    } else {
      console.log(`✅ Database ${dbName} already exists`);
    }
    
    await adminClient.end();
    
    // Now connect to our new database to create tables
    const dbClient = new Client({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: dbName,
      password: process.env.DB_PASSWORD || 'postgres',
      port: process.env.DB_PORT || 5432,
    });
    
    console.log(`🔗 Connecting to ${dbName} database...`);
    await dbClient.connect();
    
    // Read and execute schema file
    const schemaPath = path.join(__dirname, '..', 'database', 'postgresql_schema.sql');
    console.log('📄 Reading schema file...');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('⚙️  Creating tables and indexes...');
    await dbClient.query(schema);
    console.log('✅ Schema created successfully!');
    
    // Check if default admin exists
    const adminCheck = await dbClient.query(`SELECT * FROM admin_users WHERE username = 'admin'`);
    
    if (adminCheck.rows.length === 0) {
      console.log('👤 Creating default admin user...');
      // Default password: admin123 (hashed)
      const bcrypt = await import('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await dbClient.query(
        `INSERT INTO admin_users (username, email, password_hash, full_name, role) 
         VALUES ($1, $2, $3, $4, $5)`,
        ['admin', 'admin@pestrust.edu.in', hashedPassword, 'System Administrator', 'super_admin']
      );
      console.log('✅ Default admin user created!');
      console.log('📝 Username: admin');
      console.log('📝 Password: admin123');
    } else {
      console.log('✅ Admin user already exists');
    }
    
    await dbClient.end();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('🚀 You can now start the server with: npm run dev');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  }
}

setupDatabase();
