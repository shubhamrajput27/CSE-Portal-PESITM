import pkg from 'pg'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import logger from '../utils/logger.js'

const { Pool } = pkg

// Get the current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from the server directory
dotenv.config({ path: join(__dirname, '..', '.env') })

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pesitm_cse_portal',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
}

// Create connection pool
const pool = new Pool(dbConfig)

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect()
    logger.info('✅ PostgreSQL connected successfully')
    
    // Test query
    const result = await client.query('SELECT NOW()')
    logger.info(`🕐 Database time: ${result.rows[0].now}`)
    
    client.release()
  } catch (error) {
    logger.error('❌ PostgreSQL connection error', {
      error: error.message,
      stack: error.stack
    })
  }
}

export { pool, testConnection }
export default pool