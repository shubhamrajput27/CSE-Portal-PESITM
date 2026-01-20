import pool from '../config/database.js'

class MentorMentee {
  // Assign mentor to student
  static async assignMentor(studentId, facultyId, academicYear) {
    const query = `
      INSERT INTO mentor_mentee (student_id, faculty_id, academic_year)
      VALUES ($1, $2, $3)
      ON CONFLICT (student_id, academic_year)
      DO UPDATE SET 
        faculty_id = EXCLUDED.faculty_id,
        assigned_date = CURRENT_DATE,
        is_active = TRUE
      RETURNING *
    `
    
    const result = await pool.query(query, [studentId, facultyId, academicYear])
    
    // Also update student's current_mentor_id
    await pool.query(
      'UPDATE students SET current_mentor_id = $1 WHERE id = $2',
      [facultyId, studentId]
    )
    
    return result.rows[0]
  }

  // Get all mentees for a faculty member
  static async getMentees(facultyId, academicYear = null) {
    let query = `
      SELECT 
        mm.*,
        s.id as student_id,
        s.usn,
        s.full_name as name,
        s.email,
        s.phone,
        s.semester,
        s.section,
        s.department as branch,
        s.profile_image
      FROM mentor_mentee mm
      JOIN students s ON mm.student_id = s.id
      WHERE mm.faculty_id = $1 AND mm.is_active = TRUE
    `
    
    const values = [facultyId]
    
    if (academicYear) {
      query += ' AND mm.academic_year = $2'
      values.push(academicYear)
    }
    
    query += ' ORDER BY s.full_name'
    
    const result = await pool.query(query, values)
    return result.rows
  }

  // Get mentor for a student
  static async getMentor(studentId, academicYear = null) {
    let query = `
      SELECT 
        mm.*,
        f.id as faculty_id,
        f.name as mentor_name,
        f.email as mentor_email,
        f.phone as mentor_phone,
        f.designation,
        f.department,
        f.profile_image as mentor_image,
        f.office_hours
      FROM mentor_mentee mm
      JOIN faculty_users f ON mm.faculty_id = f.id
      WHERE mm.student_id = $1 AND mm.is_active = TRUE
    `
    
    const values = [studentId]
    
    if (academicYear) {
      query += ' AND mm.academic_year = $2'
      values.push(academicYear)
    }
    
    query += ' ORDER BY mm.assigned_date DESC LIMIT 1'
    
    const result = await pool.query(query, values)
    return result.rows[0]
  }

  // Update mentor remarks
  static async updateRemarks(id, remarks) {
    const query = `
      UPDATE mentor_mentee 
      SET remarks = $1
      WHERE id = $2
      RETURNING *
    `
    
    const result = await pool.query(query, [remarks, id])
    return result.rows[0]
  }

  // Deactivate mentorship
  static async deactivate(id) {
    const query = `
      UPDATE mentor_mentee 
      SET is_active = FALSE
      WHERE id = $1
      RETURNING *
    `
    
    const result = await pool.query(query, [id])
    return result.rows[0]
  }

  // Get mentorship statistics
  static async getFacultyMenteeStats(facultyId, academicYear) {
    const query = `
      SELECT 
        COUNT(*) as total_mentees,
        COUNT(CASE WHEN s.is_active = TRUE THEN 1 END) as active_mentees,
        COUNT(DISTINCT s.semester) as semesters_count,
        json_agg(DISTINCT s.semester ORDER BY s.semester) as semesters
      FROM mentor_mentee mm
      JOIN students s ON mm.student_id = s.id
      WHERE mm.faculty_id = $1 
        AND mm.academic_year = $2 
        AND mm.is_active = TRUE
    `
    
    const result = await pool.query(query, [facultyId, academicYear])
    return result.rows[0]
  }

  // Bulk assign mentors
  static async bulkAssign(assignments, academicYear) {
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      
      const results = []
      for (const assignment of assignments) {
        const query = `
          INSERT INTO mentor_mentee (student_id, faculty_id, academic_year)
          VALUES ($1, $2, $3)
          ON CONFLICT (student_id, academic_year)
          DO UPDATE SET faculty_id = EXCLUDED.faculty_id
          RETURNING *
        `
        
        const result = await client.query(query, [
          assignment.student_id,
          assignment.faculty_id,
          academicYear
        ])
        
        // Update student record
        await client.query(
          'UPDATE students SET current_mentor_id = $1 WHERE id = $2',
          [assignment.faculty_id, assignment.student_id]
        )
        
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
}

export default MentorMentee
