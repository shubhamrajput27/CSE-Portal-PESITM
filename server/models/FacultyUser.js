import pool from '../config/database.js'
import bcrypt from 'bcrypt'

class FacultyUser {
  // Create a new faculty user
  static async create(userData) {
    const {
      facultyId,
      email,
      password,
      fullName,
      designation,
      department = 'CSE',
      phone = null
    } = userData

    try {
      // Hash password
      const saltRounds = 12
      const passwordHash = await bcrypt.hash(password, saltRounds)

      const query = `
        INSERT INTO faculty_users (faculty_id, email, password_hash, full_name, designation, department, phone)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, faculty_id, email, full_name, designation, department, is_active, created_at
      `
      
      const values = [facultyId, email, passwordHash, fullName, designation, department, phone]
      const result = await pool.query(query, values)
      
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error creating faculty user: ${error.message}`)
    }
  }

  // Find faculty user by faculty ID or email
  static async findByIdentifier(identifier) {
    try {
      const query = `
        SELECT * FROM faculty_users 
        WHERE (faculty_id = $1 OR email = $1) AND is_active = TRUE
      `
      
      const result = await pool.query(query, [identifier])
      return result.rows[0] || null
    } catch (error) {
      throw new Error(`Error finding faculty user: ${error.message}`)
    }
  }

  // Find faculty user by ID
  static async findById(id) {
    try {
      const query = `
        SELECT id, faculty_id, email, full_name, designation, department, 
               phone, profile_image, is_active, last_login_at, created_at, updated_at
        FROM faculty_users 
        WHERE id = $1 AND is_active = TRUE
      `
      
      const result = await pool.query(query, [id])
      return result.rows[0] || null
    } catch (error) {
      throw new Error(`Error finding faculty user by ID: ${error.message}`)
    }
  }

  // Verify password
  static async comparePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword)
    } catch (error) {
      throw new Error(`Error comparing password: ${error.message}`)
    }
  }

  // Check if account is locked
  static isAccountLocked(faculty) {
    return faculty.locked_until && new Date(faculty.locked_until) > new Date()
  }

  // Update last login
  static async updateLastLogin(facultyUserId) {
    try {
      const query = `
        UPDATE faculty_users 
        SET last_login_at = CURRENT_TIMESTAMP, 
            failed_login_attempts = 0,
            locked_until = NULL
        WHERE id = $1
      `
      
      await pool.query(query, [facultyUserId])
    } catch (error) {
      throw new Error(`Error updating last login: ${error.message}`)
    }
  }

  // Increment failed login attempts
  static async incrementLoginAttempts(facultyUserId) {
    try {
      const MAX_LOGIN_ATTEMPTS = 5
      const LOCK_TIME_MINUTES = 30

      const query = `
        UPDATE faculty_users 
        SET failed_login_attempts = failed_login_attempts + 1,
            locked_until = CASE 
              WHEN failed_login_attempts + 1 >= $2 
              THEN CURRENT_TIMESTAMP + INTERVAL '${LOCK_TIME_MINUTES} minutes'
              ELSE locked_until
            END
        WHERE id = $1
      `
      
      await pool.query(query, [facultyUserId, MAX_LOGIN_ATTEMPTS])
    } catch (error) {
      throw new Error(`Error incrementing login attempts: ${error.message}`)
    }
  }

  // Change password
  static async changePassword(facultyUserId, newPassword) {
    try {
      const saltRounds = 12
      const passwordHash = await bcrypt.hash(newPassword, saltRounds)

      const query = `
        UPDATE faculty_users 
        SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `
      
      await pool.query(query, [passwordHash, facultyUserId])
    } catch (error) {
      throw new Error(`Error changing password: ${error.message}`)
    }
  }

  // Get all faculty users
  static async getAll() {
    try {
      const query = `
        SELECT id, faculty_id, email, full_name, designation, department, 
               is_active, last_login_at, created_at
        FROM faculty_users 
        ORDER BY designation, full_name ASC
      `
      
      const result = await pool.query(query)
      return result.rows
    } catch (error) {
      throw new Error(`Error getting all faculty users: ${error.message}`)
    }
  }

  // Log faculty activity
  static async logActivity(facultyUserId, action, resource = null, resourceId = null, details = null, ipAddress = null, userAgent = null) {
    try {
      const query = `
        INSERT INTO faculty_activity_log (faculty_user_id, action, resource, resource_id, details, ip_address, user_agent)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `
      
      const values = [facultyUserId, action, resource, resourceId, JSON.stringify(details), ipAddress, userAgent]
      await pool.query(query, values)
    } catch (error) {
      console.error('Error logging faculty activity:', error.message)
    }
  }

  // Update profile
  static async updateProfile(facultyUserId, updates) {
    try {
      const { phone, profileImage } = updates
      
      const query = `
        UPDATE faculty_users 
        SET phone = COALESCE($2, phone),
            profile_image = COALESCE($3, profile_image),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id, faculty_id, email, full_name, designation, department, phone, profile_image
      `
      
      const result = await pool.query(query, [facultyUserId, phone, profileImage])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error updating profile: ${error.message}`)
    }
  }
}

export default FacultyUser
