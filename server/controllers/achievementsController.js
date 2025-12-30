import pool from '../config/database.js'

// Get all achievements
export const getAllAchievements = async (req, res) => {
  try {
    const { category, year } = req.query
    
    let query = 'SELECT * FROM achievements WHERE 1=1'
    const params = []
    
    if (category) {
      params.push(category)
      query += ` AND category = $${params.length}`
    }
    
    if (year) {
      params.push(year)
      query += ` AND EXTRACT(YEAR FROM achievement_date) = $${params.length}`
    }
    
    query += ' ORDER BY achievement_date DESC'
    
    const result = await pool.query(query, params)
    
    res.status(200).json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('Error fetching achievements:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching achievements',
      error: error.message
    })
  }
}

// Get achievement by ID
export const getAchievementById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM achievements WHERE id = $1', [id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      })
    }
    
    res.status(200).json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error fetching achievement:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching achievement',
      error: error.message
    })
  }
}

// Create new achievement
export const createAchievement = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      achiever_name,
      achievement_date,
      award_type,
      organization,
      details
    } = req.body
    
    const result = await pool.query(
      `INSERT INTO achievements 
       (title, description, category, achiever_name, achievement_date, award_type, organization, details) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [title, description, category, achiever_name, achievement_date, award_type, organization, details]
    )
    
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Achievement created successfully'
    })
  } catch (error) {
    console.error('Error creating achievement:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating achievement',
      error: error.message
    })
  }
}

// Update achievement
export const updateAchievement = async (req, res) => {
  try {
    const { id } = req.params
    const {
      title,
      description,
      category,
      achiever_name,
      achievement_date,
      award_type,
      organization,
      details
    } = req.body
    
    const result = await pool.query(
      `UPDATE achievements 
       SET title = $1, description = $2, category = $3, achiever_name = $4, 
           achievement_date = $5, award_type = $6, organization = $7, details = $8, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $9 
       RETURNING *`,
      [title, description, category, achiever_name, achievement_date, award_type, organization, details, id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      })
    }
    
    res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'Achievement updated successfully'
    })
  } catch (error) {
    console.error('Error updating achievement:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating achievement',
      error: error.message
    })
  }
}

// Delete achievement
export const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params
    
    const result = await pool.query('DELETE FROM achievements WHERE id = $1 RETURNING *', [id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      })
    }
    
    res.status(200).json({
      success: true,
      message: 'Achievement deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting achievement:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting achievement',
      error: error.message
    })
  }
}
