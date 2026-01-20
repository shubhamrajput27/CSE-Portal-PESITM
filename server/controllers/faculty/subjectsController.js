import pool from '../../config/database.js'
import SystemSettings from '../../models/SystemSettings.js'

const subjectsController = {
  getAssignedSubjects: async (req, res) => {
    try {
      const faculty_id = req.user?.id

      if (!faculty_id) {
        return res.status(401).json({
          success: false,
          message: 'Faculty authentication required'
        })
      }

      const academicYear =
        req.query.academic_year ||
        (await SystemSettings.getCurrentAcademicYear()) ||
        '2025-26'

      const query = `
        SELECT
          sub.id,
          sub.subject_code,
          sub.subject_name,
          sub.semester,
          sub.credits,
          sub.department,
          sub.is_lab,
          sub.description,
          fs.section,
          fs.academic_year
        FROM faculty_subjects fs
        JOIN subjects sub ON fs.subject_id = sub.id
        WHERE fs.faculty_id = $1
          AND fs.academic_year = $2
          AND sub.is_active = TRUE
        ORDER BY sub.semester, sub.subject_code
      `

      const result = await pool.query(query, [faculty_id, academicYear])

      res.status(200).json({
        success: true,
        message: 'Subjects retrieved successfully',
        academic_year: academicYear,
        count: result.rows.length,
        data: result.rows
      })
    } catch (error) {
      console.error('Get faculty subjects error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch subjects',
        error: error.message
      })
    }
  }
}

export default subjectsController