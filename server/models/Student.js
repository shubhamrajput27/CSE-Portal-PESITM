import pool from '../config/database.js'
import bcrypt from 'bcrypt'

class Student {
  // Create a new student
  static async create(userData) {
    const {
      studentId,
      usn,
      email,
      password,
      fullName,
      semester,
      year,
      phone = null,
      dateOfBirth = null
    } = userData

    try {
      // Hash password
      const saltRounds = 12
      const passwordHash = await bcrypt.hash(password, saltRounds)

      const query = `
        INSERT INTO students (student_id, usn, email, password_hash, full_name, semester, year, phone, date_of_birth)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, student_id, usn, email, full_name, semester, year, is_active, created_at
      `
      
      const values = [studentId, usn, email, passwordHash, fullName, semester, year, phone, dateOfBirth]
      const result = await pool.query(query, values)
      
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error creating student: ${error.message}`)
    }
  }

  // Find student by USN, student ID, or email
  static async findByIdentifier(identifier) {
    try {
      const query = `
        SELECT * FROM students 
        WHERE (usn = $1 OR student_id = $1 OR email = $1) AND is_active = TRUE
      `
      
      const result = await pool.query(query, [identifier])
      return result.rows[0] || null
    } catch (error) {
      throw new Error(`Error finding student: ${error.message}`)
    }
  }

  // Find student by ID
  static async findById(id) {
    try {
      const query = `
        SELECT id, student_id, usn, email, full_name, department, semester, year, 
               phone, date_of_birth, address, profile_image, is_active, 
               last_login_at, created_at, updated_at
        FROM students 
        WHERE id = $1 AND is_active = TRUE
      `
      
      const result = await pool.query(query, [id])
      return result.rows[0] || null
    } catch (error) {
      throw new Error(`Error finding student by ID: ${error.message}`)
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
  static isAccountLocked(student) {
    return student.locked_until && new Date(student.locked_until) > new Date()
  }

  // Update last login
  static async updateLastLogin(studentId) {
    try {
      const query = `
        UPDATE students 
        SET last_login_at = CURRENT_TIMESTAMP, 
            failed_login_attempts = 0,
            locked_until = NULL
        WHERE id = $1
      `
      
      await pool.query(query, [studentId])
    } catch (error) {
      throw new Error(`Error updating last login: ${error.message}`)
    }
  }

  // Increment failed login attempts
  static async incrementLoginAttempts(studentId) {
    try {
      const MAX_LOGIN_ATTEMPTS = 5
      const LOCK_TIME_MINUTES = 30

      const query = `
        UPDATE students 
        SET failed_login_attempts = failed_login_attempts + 1,
            locked_until = CASE 
              WHEN failed_login_attempts + 1 >= $2 
              THEN CURRENT_TIMESTAMP + INTERVAL '${LOCK_TIME_MINUTES} minutes'
              ELSE locked_until
            END
        WHERE id = $1
      `
      
      await pool.query(query, [studentId, MAX_LOGIN_ATTEMPTS])
    } catch (error) {
      throw new Error(`Error incrementing login attempts: ${error.message}`)
    }
  }

  // Change password
  static async changePassword(studentId, newPassword) {
    try {
      const saltRounds = 12
      const passwordHash = await bcrypt.hash(newPassword, saltRounds)

      const query = `
        UPDATE students 
        SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `
      
      await pool.query(query, [passwordHash, studentId])
    } catch (error) {
      throw new Error(`Error changing password: ${error.message}`)
    }
  }

  // Get all students
  static async getAll() {
    try {
      const query = `
        SELECT id, student_id, usn, email, full_name, semester, year, 
               department, is_active, last_login_at, created_at
        FROM students 
        ORDER BY semester DESC, full_name ASC
      `
      
      const result = await pool.query(query)
      return result.rows
    } catch (error) {
      throw new Error(`Error getting all students: ${error.message}`)
    }
  }

  // Log student activity
  static async logActivity(studentId, action, resource = null, resourceId = null, details = null, ipAddress = null, userAgent = null) {
    try {
      const query = `
        INSERT INTO student_activity_log (student_id, action, resource, resource_id, details, ip_address, user_agent)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `
      
      const values = [studentId, action, resource, resourceId, JSON.stringify(details), ipAddress, userAgent]
      await pool.query(query, values)
    } catch (error) {
      console.error('Error logging student activity:', error.message)
    }
  }

  // Update profile
  static async updateProfile(studentId, updates) {
    try {
      const { phone, address, profileImage } = updates
      
      const query = `
        UPDATE students 
        SET phone = COALESCE($2, phone),
            address = COALESCE($3, address),
            profile_image = COALESCE($4, profile_image),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id, student_id, usn, email, full_name, semester, year, phone, address, profile_image
      `
      
      const result = await pool.query(query, [studentId, phone, address, profileImage])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error updating profile: ${error.message}`)
    }
  }
}

export default Student
