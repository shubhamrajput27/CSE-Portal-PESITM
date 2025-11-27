import pool from '../config/database.js'

class StudyMaterial {
  // Upload study material
  static async create(materialData) {
    const {
      subject_id,
      faculty_id,
      title,
      description,
      file_path,
      file_type,
      material_type,
      file_size,
      semester,
      is_public = true
    } = materialData

    const query = `
      INSERT INTO study_materials (
        subject_id, faculty_id, title, description, file_path,
        file_type, material_type, file_size, semester, is_public
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `
    
    const values = [
      subject_id, faculty_id, title, description, file_path,
      file_type, material_type, file_size, semester, is_public
    ]
    
    const result = await pool.query(query, values)
    return result.rows[0]
  }

  // Get all materials with filters
  static async getAll(filters = {}) {
    let query = `
      SELECT 
        sm.*,
        s.subject_code,
        s.subject_name,
        f.name as faculty_name
      FROM study_materials sm
      JOIN subjects s ON sm.subject_id = s.id
      LEFT JOIN faculty_users f ON sm.faculty_id = f.id
      WHERE 1=1
    `
    
    const values = []
    let paramCount = 1

    if (filters.subject_id) {
      query += ` AND sm.subject_id = $${paramCount++}`
      values.push(filters.subject_id)
    }

    if (filters.faculty_id) {
      query += ` AND sm.faculty_id = $${paramCount++}`
      values.push(filters.faculty_id)
    }

    if (filters.semester) {
      query += ` AND sm.semester = $${paramCount++}`
      values.push(filters.semester)
    }

    if (filters.material_type) {
      query += ` AND sm.material_type = $${paramCount++}`
      values.push(filters.material_type)
    }

    if (filters.is_public !== undefined) {
      query += ` AND sm.is_public = $${paramCount++}`
      values.push(filters.is_public)
    }

    query += ' ORDER BY sm.upload_date DESC'
    
    const result = await pool.query(query, values)
    return result.rows
  }

  // Get material by ID
  static async findById(id) {
    const query = `
      SELECT 
        sm.*,
        s.subject_code,
        s.subject_name,
        f.name as faculty_name
      FROM study_materials sm
      JOIN subjects s ON sm.subject_id = s.id
      LEFT JOIN faculty_users f ON sm.faculty_id = f.id
      WHERE sm.id = $1
    `
    
    const result = await pool.query(query, [id])
    return result.rows[0]
  }

  // Update material
  static async update(id, updateData) {
    const fields = []
    const values = []
    let paramCount = 1

    const allowedFields = ['title', 'description', 'is_public', 'material_type']
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        fields.push(`${field} = $${paramCount++}`)
        values.push(updateData[field])
      }
    })

    if (fields.length === 0) return null

    values.push(id)
    const query = `
      UPDATE study_materials 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `
    
    const result = await pool.query(query, values)
    return result.rows[0]
  }

  // Delete material
  static async delete(id) {
    const query = 'DELETE FROM study_materials WHERE id = $1 RETURNING *'
    const result = await pool.query(query, [id])
    return result.rows[0]
  }

  // Get materials for student (by semester)
  static async getForStudent(semester, subjectId = null) {
    let query = `
      SELECT 
        sm.*,
        s.subject_code,
        s.subject_name,
        f.name as faculty_name
      FROM study_materials sm
      JOIN subjects s ON sm.subject_id = s.id
      LEFT JOIN faculty_users f ON sm.faculty_id = f.id
      WHERE sm.semester = $1 AND sm.is_public = TRUE
    `
    
    const values = [semester]
    
    if (subjectId) {
      query += ' AND sm.subject_id = $2'
      values.push(subjectId)
    }
    
    query += ' ORDER BY sm.upload_date DESC'
    
    const result = await pool.query(query, values)
    return result.rows
  }

  // Get upload statistics for faculty
  static async getFacultyStats(facultyId) {
    const query = `
      SELECT 
        COUNT(*) as total_uploads,
        COUNT(DISTINCT subject_id) as subjects_count,
        SUM(file_size) as total_size,
        json_agg(DISTINCT material_type) as material_types
      FROM study_materials
      WHERE faculty_id = $1
    `
    
    const result = await pool.query(query, [facultyId])
    return result.rows[0]
  }
}

export default StudyMaterial
