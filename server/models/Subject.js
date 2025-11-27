import pool from '../config/database.js'

class Subject {
  // Create new subject
  static async create(subjectData) {
    const { 
      subject_code, 
      subject_name, 
      semester, 
      credits = 4,
      department = 'CSE',
      is_lab = false,
      description 
    } = subjectData

    const query = `
      INSERT INTO subjects (subject_code, subject_name, semester, credits, department, is_lab, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `
    const values = [subject_code, subject_name, semester, credits, department, is_lab, description]
    const result = await pool.query(query, values)
    return result.rows[0]
  }

  // Get all subjects with optional filters
  static async getAll(filters = {}) {
    let query = 'SELECT * FROM subjects WHERE is_active = TRUE'
    const values = []
    let paramCount = 1

    if (filters.semester) {
      query += ` AND semester = $${paramCount++}`
      values.push(filters.semester)
    }

    if (filters.department) {
      query += ` AND department = $${paramCount++}`
      values.push(filters.department)
    }

    query += ' ORDER BY semester, subject_code'
    
    const result = await pool.query(query, values)
    return result.rows
  }

  // Get subject by ID
  static async findById(id) {
    const query = 'SELECT * FROM subjects WHERE id = $1'
    const result = await pool.query(query, [id])
    return result.rows[0]
  }

  // Get subject by code
  static async findByCode(code) {
    const query = 'SELECT * FROM subjects WHERE subject_code = $1'
    const result = await pool.query(query, [code])
    return result.rows[0]
  }

  // Update subject
  static async update(id, updateData) {
    const fields = []
    const values = []
    let paramCount = 1

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = $${paramCount++}`)
        values.push(updateData[key])
      }
    })

    if (fields.length === 0) return null

    values.push(id)
    const query = `
      UPDATE subjects 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `
    
    const result = await pool.query(query, values)
    return result.rows[0]
  }

  // Delete (soft delete)
  static async delete(id) {
    const query = 'UPDATE subjects SET is_active = FALSE WHERE id = $1 RETURNING *'
    const result = await pool.query(query, [id])
    return result.rows[0]
  }

  // Assign subject to faculty
  static async assignToFaculty(subjectId, facultyId, academicYear, section = null) {
    const query = `
      INSERT INTO faculty_subjects (subject_id, faculty_id, academic_year, section)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (faculty_id, subject_id, academic_year, section) 
      DO UPDATE SET assigned_at = CURRENT_TIMESTAMP
      RETURNING *
    `
    const result = await pool.query(query, [subjectId, facultyId, academicYear, section])
    return result.rows[0]
  }

  // Get faculty assigned to subject
  static async getAssignedFaculty(subjectId, academicYear) {
    const query = `
      SELECT f.*, fs.section, fs.assigned_at
      FROM faculty_users f
      JOIN faculty_subjects fs ON f.id = fs.faculty_id
      WHERE fs.subject_id = $1 AND fs.academic_year = $2
    `
    const result = await pool.query(query, [subjectId, academicYear])
    return result.rows
  }

  // Upload syllabus
  static async uploadSyllabus(id, filePath) {
    const query = 'UPDATE subjects SET syllabus_file = $1 WHERE id = $2 RETURNING *'
    const result = await pool.query(query, [filePath, id])
    return result.rows[0]
  }
}

export default Subject
