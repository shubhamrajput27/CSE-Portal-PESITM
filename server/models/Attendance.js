import pool from '../config/database.js'

class Attendance {
  // Mark attendance for a student
  static async markAttendance(attendanceData) {
    const {
      student_id,
      subject_id,
      faculty_id,
      attendance_date,
      status,
      period_number,
      academic_year,
      semester,
      remarks = null
    } = attendanceData

    const query = `
      INSERT INTO attendance (
        student_id, subject_id, faculty_id, attendance_date, status,
        period_number, academic_year, semester, remarks, marked_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (student_id, subject_id, attendance_date, period_number)
      DO UPDATE SET 
        status = EXCLUDED.status,
        remarks = EXCLUDED.remarks,
        updated_at = CURRENT_TIMESTAMP,
        marked_by = EXCLUDED.marked_by
      RETURNING *
    `
    
    const values = [
      student_id, subject_id, faculty_id, attendance_date, status,
      period_number, academic_year, semester, remarks, faculty_id
    ]
    
    const result = await pool.query(query, values)
    return result.rows[0]
  }

  // Mark attendance for multiple students (bulk)
  static async markBulkAttendance(attendanceRecords) {
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      
      const results = []
      for (const record of attendanceRecords) {
        const query = `
          INSERT INTO attendance (
            student_id, subject_id, faculty_id, attendance_date, status,
            period_number, academic_year, semester, marked_by
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (student_id, subject_id, attendance_date, period_number)
          DO UPDATE SET status = EXCLUDED.status, updated_at = CURRENT_TIMESTAMP
          RETURNING *
        `
        
        const values = [
          record.student_id,
          record.subject_id,
          record.faculty_id,
          record.attendance_date,
          record.status,
          record.period_number,
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

  // Get attendance for a student
  static async getStudentAttendance(studentId, filters = {}) {
    let query = `
      SELECT a.*, s.subject_code, s.subject_name, f.name as faculty_name
      FROM attendance a
      JOIN subjects s ON a.subject_id = s.id
      LEFT JOIN faculty_users f ON a.faculty_id = f.id
      WHERE a.student_id = $1
    `
    const values = [studentId]
    let paramCount = 2

    if (filters.subject_id) {
      query += ` AND a.subject_id = $${paramCount++}`
      values.push(filters.subject_id)
    }

    if (filters.academic_year) {
      query += ` AND a.academic_year = $${paramCount++}`
      values.push(filters.academic_year)
    }

    if (filters.semester) {
      query += ` AND a.semester = $${paramCount++}`
      values.push(filters.semester)
    }

    if (filters.start_date) {
      query += ` AND a.attendance_date >= $${paramCount++}`
      values.push(filters.start_date)
    }

    if (filters.end_date) {
      query += ` AND a.attendance_date <= $${paramCount++}`
      values.push(filters.end_date)
    }

    query += ' ORDER BY a.attendance_date DESC, a.period_number'
    
    const result = await pool.query(query, values)
    return result.rows
  }

  // Get attendance summary for a student
  static async getStudentAttendanceSummary(studentId, academicYear, semester) {
    const query = `
      SELECT 
        s.id as subject_id,
        s.subject_code,
        s.subject_name,
        COUNT(*) as total_classes,
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as classes_attended,
        SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as classes_absent,
        SUM(CASE WHEN a.status = 'on_leave' THEN 1 ELSE 0 END) as classes_on_leave,
        ROUND((SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100, 2) as attendance_percentage
      FROM attendance a
      JOIN subjects s ON a.subject_id = s.id
      WHERE a.student_id = $1 AND a.academic_year = $2 AND a.semester = $3
      GROUP BY s.id, s.subject_code, s.subject_name
      ORDER BY s.subject_code
    `
    
    const result = await pool.query(query, [studentId, academicYear, semester])
    return result.rows
  }

  // Get attendance for a subject (all students)
  static async getSubjectAttendance(subjectId, date, academicYear) {
    const query = `
      SELECT 
        a.*,
        s.usn,
        s.name as student_name,
        s.semester,
        s.section
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      WHERE a.subject_id = $1 
        AND a.attendance_date = $2
        AND a.academic_year = $3
      ORDER BY s.usn
    `
    
    const result = await pool.query(query, [subjectId, date, academicYear])
    return result.rows
  }

  // Get attendance statistics for faculty
  static async getFacultyAttendanceStats(facultyId, academicYear) {
    const query = `
      SELECT 
        sub.subject_code,
        sub.subject_name,
        COUNT(DISTINCT a.student_id) as total_students,
        COUNT(DISTINCT a.attendance_date) as classes_conducted,
        ROUND(AVG(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) * 100, 2) as avg_attendance_percentage
      FROM attendance a
      JOIN subjects sub ON a.subject_id = sub.id
      WHERE a.faculty_id = $1 AND a.academic_year = $2
      GROUP BY sub.id, sub.subject_code, sub.subject_name
    `
    
    const result = await pool.query(query, [facultyId, academicYear])
    return result.rows
  }

  // Update attendance status
  static async updateStatus(id, status, remarks = null) {
    const query = `
      UPDATE attendance 
      SET status = $1, remarks = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `
    
    const result = await pool.query(query, [status, remarks, id])
    return result.rows[0]
  }

  // Delete attendance record
  static async delete(id) {
    const query = 'DELETE FROM attendance WHERE id = $1 RETURNING *'
    const result = await pool.query(query, [id])
    return result.rows[0]
  }

  // Get low attendance students
  static async getLowAttendanceStudents(threshold = 75, academicYear, semester) {
    const query = `
      SELECT 
        s.id,
        s.usn,
        s.name,
        s.email,
        sub.subject_code,
        sub.subject_name,
        COUNT(*) as total_classes,
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as attended,
        ROUND((SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100, 2) as percentage
      FROM students s
      JOIN attendance a ON s.id = a.student_id
      JOIN subjects sub ON a.subject_id = sub.id
      WHERE a.academic_year = $1 AND a.semester = $2
      GROUP BY s.id, s.usn, s.name, s.email, sub.id, sub.subject_code, sub.subject_name
      HAVING ROUND((SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100, 2) < $3
      ORDER BY percentage ASC
    `
    
    const result = await pool.query(query, [academicYear, semester, threshold])
    return result.rows
  }
}

export default Attendance
