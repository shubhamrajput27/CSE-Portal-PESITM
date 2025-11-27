import pool from '../config/database.js'

class Marks {
  // Add marks for a student
  static async addMarks(marksData) {
    const {
      student_id,
      subject_id,
      exam_type,
      marks_obtained,
      max_marks,
      academic_year,
      semester,
      exam_date = null,
      faculty_id,
      remarks = null
    } = marksData

    const query = `
      INSERT INTO marks (
        student_id, subject_id, exam_type, marks_obtained, max_marks,
        academic_year, semester, exam_date, faculty_id, remarks
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (student_id, subject_id, exam_type, academic_year, semester)
      DO UPDATE SET 
        marks_obtained = EXCLUDED.marks_obtained,
        max_marks = EXCLUDED.max_marks,
        exam_date = EXCLUDED.exam_date,
        remarks = EXCLUDED.remarks,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `
    
    const values = [
      student_id, subject_id, exam_type, marks_obtained, max_marks,
      academic_year, semester, exam_date, faculty_id, remarks
    ]
    
    const result = await pool.query(query, values)
    return result.rows[0]
  }

  // Add marks in bulk (from CSV)
  static async addBulkMarks(marksRecords) {
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      
      const results = []
      for (const record of marksRecords) {
        const query = `
          INSERT INTO marks (
            student_id, subject_id, exam_type, marks_obtained, max_marks,
            academic_year, semester, faculty_id
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (student_id, subject_id, exam_type, academic_year, semester)
          DO UPDATE SET 
            marks_obtained = EXCLUDED.marks_obtained,
            max_marks = EXCLUDED.max_marks,
            updated_at = CURRENT_TIMESTAMP
          RETURNING *
        `
        
        const values = [
          record.student_id,
          record.subject_id,
          record.exam_type,
          record.marks_obtained,
          record.max_marks,
          record.academic_year,
          record.semester,
          record.faculty_id
        ]
        
        const result = await client.query(query, values)
        results.push(result.rows[0])
      }
      
      await client.query('COMMIT')
      return results
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  // Get marks for a student
  static async getStudentMarks(studentId, filters = {}) {
    let query = `
      SELECT m.*, s.subject_code, s.subject_name, f.name as faculty_name
      FROM marks m
      JOIN subjects s ON m.subject_id = s.id
      LEFT JOIN faculty_users f ON m.faculty_id = f.id
      WHERE m.student_id = $1
    `
    const values = [studentId]
    let paramCount = 2

    if (filters.subject_id) {
      query += ` AND m.subject_id = $${paramCount++}`
      values.push(filters.subject_id)
    }

    if (filters.academic_year) {
      query += ` AND m.academic_year = $${paramCount++}`
      values.push(filters.academic_year)
    }

    if (filters.semester) {
      query += ` AND m.semester = $${paramCount++}`
      values.push(filters.semester)
    }

    if (filters.exam_type) {
      query += ` AND m.exam_type = $${paramCount++}`
      values.push(filters.exam_type)
    }

    query += ' ORDER BY m.created_at DESC'
    
    const result = await pool.query(query, values)
    return result.rows
  }

  // Get marks summary for a student
  static async getStudentMarksSummary(studentId, academicYear, semester) {
    const query = `
      SELECT 
        s.id as subject_id,
        s.subject_code,
        s.subject_name,
        s.credits,
        json_agg(
          json_build_object(
            'exam_type', m.exam_type,
            'marks_obtained', m.marks_obtained,
            'max_marks', m.max_marks,
            'percentage', ROUND((m.marks_obtained / m.max_marks) * 100, 2)
          ) ORDER BY m.exam_type
        ) as exams,
        ROUND(AVG((m.marks_obtained / m.max_marks) * 100), 2) as average_percentage
      FROM marks m
      JOIN subjects s ON m.subject_id = s.id
      WHERE m.student_id = $1 AND m.academic_year = $2 AND m.semester = $3
      GROUP BY s.id, s.subject_code, s.subject_name, s.credits
      ORDER BY s.subject_code
    `
    
    const result = await pool.query(query, [studentId, academicYear, semester])
    return result.rows
  }

  // Get marks for a subject (all students)
  static async getSubjectMarks(subjectId, examType, academicYear, semester) {
    const query = `
      SELECT 
        m.*,
        s.usn,
        s.name as student_name,
        s.section,
        ROUND((m.marks_obtained / m.max_marks) * 100, 2) as percentage
      FROM marks m
      JOIN students s ON m.student_id = s.id
      WHERE m.subject_id = $1 
        AND m.exam_type = $2
        AND m.academic_year = $3
        AND m.semester = $4
      ORDER BY s.usn
    `
    
    const result = await pool.query(query, [subjectId, examType, academicYear, semester])
    return result.rows
  }

  // Get marks statistics for faculty
  static async getFacultyMarksStats(facultyId, academicYear) {
    const query = `
      SELECT 
        sub.subject_code,
        sub.subject_name,
        m.exam_type,
        COUNT(DISTINCT m.student_id) as students_evaluated,
        ROUND(AVG(m.marks_obtained), 2) as average_marks,
        ROUND(AVG((m.marks_obtained / m.max_marks) * 100), 2) as average_percentage,
        MAX(m.marks_obtained) as highest_marks,
        MIN(m.marks_obtained) as lowest_marks
      FROM marks m
      JOIN subjects sub ON m.subject_id = sub.id
      WHERE m.faculty_id = $1 AND m.academic_year = $2
      GROUP BY sub.id, sub.subject_code, sub.subject_name, m.exam_type
      ORDER BY sub.subject_code, m.exam_type
    `
    
    const result = await pool.query(query, [facultyId, academicYear])
    return result.rows
  }

  // Get top performers
  static async getTopPerformers(subjectId, examType, academicYear, semester, limit = 10) {
    const query = `
      SELECT 
        s.usn,
        s.name,
        m.marks_obtained,
        m.max_marks,
        ROUND((m.marks_obtained / m.max_marks) * 100, 2) as percentage
      FROM marks m
      JOIN students s ON m.student_id = s.id
      WHERE m.subject_id = $1 
        AND m.exam_type = $2
        AND m.academic_year = $3
        AND m.semester = $4
      ORDER BY percentage DESC
      LIMIT $5
    `
    
    const result = await pool.query(query, [subjectId, examType, academicYear, semester, limit])
    return result.rows
  }

  // Update marks
  static async update(id, updateData) {
    const fields = []
    const values = []
    let paramCount = 1

    const allowedFields = ['marks_obtained', 'max_marks', 'exam_date', 'remarks']
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        fields.push(`${field} = $${paramCount++}`)
        values.push(updateData[field])
      }
    })

    if (fields.length === 0) return null

    values.push(id)
    const query = `
      UPDATE marks 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `
    
    const result = await pool.query(query, values)
    return result.rows[0]
  }

  // Delete marks record
  static async delete(id) {
    const query = 'DELETE FROM marks WHERE id = $1 RETURNING *'
    const result = await pool.query(query, [id])
    return result.rows[0]
  }

  // Get class analytics
  static async getClassAnalytics(semester, section, academicYear) {
    const query = `
      SELECT 
        sub.subject_code,
        sub.subject_name,
        m.exam_type,
        COUNT(m.id) as total_students,
        ROUND(AVG((m.marks_obtained / m.max_marks) * 100), 2) as class_average,
        COUNT(CASE WHEN (m.marks_obtained / m.max_marks) * 100 >= 40 THEN 1 END) as pass_count,
        COUNT(CASE WHEN (m.marks_obtained / m.max_marks) * 100 < 40 THEN 1 END) as fail_count
      FROM marks m
      JOIN students s ON m.student_id = s.id
      JOIN subjects sub ON m.subject_id = sub.id
      WHERE s.semester = $1 
        AND s.section = $2 
        AND m.academic_year = $3
      GROUP BY sub.id, sub.subject_code, sub.subject_name, m.exam_type
      ORDER BY sub.subject_code, m.exam_type
    `
    
    const result = await pool.query(query, [semester, section, academicYear])
    return result.rows
  }
}

export default Marks
