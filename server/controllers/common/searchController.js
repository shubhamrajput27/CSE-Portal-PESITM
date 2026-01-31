import pool from '../../config/database.js';
import logger from '../../utils/logger.js';

const searchController = {
  // Search students with filters
  async searchStudents(req, res) {
    try {
      const { search, semester, section, limit = 20 } = req.query;

      if (!search || search.length < 2) {
        return res.json({
          success: true,
          data: []
        });
      }

      let query = `
        SELECT 
          id, usn, name, email, phone, semester, section, 
          branch, admission_year, is_active
        FROM students
        WHERE (
          usn ILIKE $1 OR 
          name ILIKE $1 OR 
          email ILIKE $1 OR
          phone ILIKE $1
        )
      `;

      const params = [`%${search}%`];
      let paramIndex = 2;

      if (semester && semester !== 'all') {
        query += ` AND semester = $${paramIndex}`;
        params.push(semester);
        paramIndex++;
      }

      if (section && section !== 'all') {
        query += ` AND section = $${paramIndex}`;
        params.push(section);
        paramIndex++;
      }

      query += ` ORDER BY semester, section, name LIMIT $${paramIndex}`;
      params.push(parseInt(limit));

      const result = await pool.query(query, params);

      res.json({
        success: true,
        count: result.rows.length,
        data: result.rows
      });

    } catch (error) {
      logger.error('Error searching students:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search students',
        error: error.message
      });
    }
  }
};

export default searchController;
