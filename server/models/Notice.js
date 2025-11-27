import pool from '../config/database.js'

class Notice {
  // Create notice
  static async create(noticeData) {
    const {
      title,
      content,
      notice_type,
      target_audience,
      semester = null,
      section = null,
      file_path = null,
      posted_by,
      expiry_date = null
    } = noticeData

    const query = `
      INSERT INTO notices (
        title, content, notice_type, target_audience,
        semester, section, file_path, posted_by, expiry_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `
    
    const values = [
      title, content, notice_type, target_audience,
      semester, section, file_path, posted_by, expiry_date
    ]
    
    const result = await pool.query(query, values)
    return result.rows[0]
  }

  // Get all notices with filters
  static async getAll(filters = {}) {
    let query = `
      SELECT 
        n.*,
        a.username as posted_by_username
      FROM notices n
      LEFT JOIN admin_users a ON n.posted_by = a.id
      WHERE n.is_active = TRUE
    `
    
    const values = []
    let paramCount = 1

    if (filters.target_audience) {
      query += ` AND (n.target_audience = $${paramCount++} OR n.target_audience = 'all')`
      values.push(filters.target_audience)
    }

    if (filters.semester) {
      query += ` AND (n.semester = $${paramCount++} OR n.semester IS NULL)`
      values.push(filters.semester)
    }

    if (filters.section) {
      query += ` AND (n.section = $${paramCount++} OR n.section IS NULL)`
      values.push(filters.section)
    }

    if (filters.notice_type) {
      query += ` AND n.notice_type = $${paramCount++}`
      values.push(filters.notice_type)
    }

    // Only show non-expired notices
    query += ` AND (n.expiry_date IS NULL OR n.expiry_date >= CURRENT_DATE)`

    query += ' ORDER BY n.created_at DESC'
    
    const result = await pool.query(query, values)
    return result.rows
  }

  // Get notice by ID
  static async findById(id) {
    const query = `
      SELECT 
        n.*,
        a.username as posted_by_username
      FROM notices n
      LEFT JOIN admin_users a ON n.posted_by = a.id
      WHERE n.id = $1
    `
    
    const result = await pool.query(query, [id])
    return result.rows[0]
  }

  // Update notice
  static async update(id, updateData) {
    const fields = []
    const values = []
    let paramCount = 1

    const allowedFields = ['title', 'content', 'notice_type', 'expiry_date', 'is_active']
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        fields.push(`${field} = $${paramCount++}`)
        values.push(updateData[field])
      }
    })

    if (fields.length === 0) return null

    values.push(id)
    const query = `
      UPDATE notices 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `
    
    const result = await pool.query(query, values)
    return result.rows[0]
  }

  // Delete (soft delete)
  static async delete(id) {
    const query = `
      UPDATE notices 
      SET is_active = FALSE
      WHERE id = $1
      RETURNING *
    `
    
    const result = await pool.query(query, [id])
    return result.rows[0]
  }

  // Get notices for student
  static async getForStudent(semester, section) {
    const query = `
      SELECT n.*, a.username as posted_by_username
      FROM notices n
      LEFT JOIN admin_users a ON n.posted_by = a.id
      WHERE n.is_active = TRUE
        AND (n.target_audience = 'all' 
          OR n.target_audience = 'students'
          OR (n.target_audience = 'specific_semester' AND n.semester = $1)
          OR (n.target_audience = 'specific_section' AND n.semester = $1 AND n.section = $2))
        AND (n.expiry_date IS NULL OR n.expiry_date >= CURRENT_DATE)
      ORDER BY n.created_at DESC
    `
    
    const result = await pool.query(query, [semester, section])
    return result.rows
  }

  // Get notices for faculty
  static async getForFaculty() {
    const query = `
      SELECT n.*, a.username as posted_by_username
      FROM notices n
      LEFT JOIN admin_users a ON n.posted_by = a.id
      WHERE n.is_active = TRUE
        AND (n.target_audience = 'all' OR n.target_audience = 'faculty')
        AND (n.expiry_date IS NULL OR n.expiry_date >= CURRENT_DATE)
      ORDER BY n.created_at DESC
    `
    
    const result = await pool.query(query)
    return result.rows
  }
}

export default Notice
