import pkg from 'pg';
const { Pool } = pkg;

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pesitm_cse_portal',
  password: process.env.DB_PASSWORD || 'admin123',
  port: process.env.DB_PORT || 5432,
});

// Get all faculty with ordering
export const getAllFaculty = async (req, res) => {
  try {
    const query = `
      SELECT * FROM faculty 
      ORDER BY display_order ASC, created_at ASC
    `;
    const result = await pool.query(query);
    res.status(200).json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching faculty', 
      error: error.message 
    });
  }
};

// Get faculty by designation
export const getFacultyByDesignation = async (req, res) => {
  try {
    const { designation } = req.params;
    
    const query = `
      SELECT * FROM faculty 
      WHERE designation ILIKE $1
      ORDER BY display_order ASC, created_at ASC
    `;
    
    const result = await pool.query(query, [`%${designation}%`]);
    
    res.status(200).json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching faculty by designation', 
      error: error.message 
    });
  }
};

// Get single faculty by ID
export const getFacultyById = async (req, res) => {
  try {
    const query = 'SELECT * FROM faculty WHERE id = $1';
    const result = await pool.query(query, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Faculty member not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching faculty member', 
      error: error.message 
    });
  }
};

// Create new faculty member
export const createFaculty = async (req, res) => {
  try {
    const {
      name,
      designation,
      specialization,
      email,
      qualification,
      experience,
      image_url,
      bio,
      research_interests,
      publications,
      display_order
    } = req.body;

    // Get the maximum display_order and increment it
    const maxOrderQuery = 'SELECT COALESCE(MAX(display_order), 0) as max_order FROM faculty WHERE is_active = true';
    const maxOrderResult = await pool.query(maxOrderQuery);
    const nextOrder = display_order || (maxOrderResult.rows[0].max_order + 1);

    const query = `
      INSERT INTO faculty (
        name, designation, specialization, email, qualification, 
        experience, image_url, bio, research_interests, publications, 
        display_order, author_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    
    const values = [
      name,
      designation,
      specialization || null,
      email || null,
      qualification || null,
      experience || null,
      image_url || null,
      bio || null,
      research_interests || null,
      publications || null,
      nextOrder,
      req.user?.id || 1  // Admin user ID from auth middleware
    ];

    const result = await pool.query(query, values);
    
    res.status(201).json({
      success: true,
      message: 'Faculty member created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error creating faculty member', 
      error: error.message 
    });
  }
};

// Update faculty member
export const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      designation,
      specialization,
      email,
      qualification,
      experience,
      image_url,
      bio,
      research_interests,
      publications,
      display_order
    } = req.body;

    const query = `
      UPDATE faculty 
      SET name = $1, designation = $2, specialization = $3, email = $4, 
          qualification = $5, experience = $6, image_url = $7, bio = $8,
          research_interests = $9, publications = $10, display_order = $11, 
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $12 AND is_active = true
      RETURNING *
    `;

    const values = [
      name,
      designation,
      specialization,
      email,
      qualification,
      experience,
      image_url,
      bio,
      research_interests,
      publications,
      display_order,
      id
    ];

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Faculty member not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Faculty member updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error updating faculty member', 
      error: error.message 
    });
  }
};

// Delete faculty member (soft delete)
export const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      UPDATE faculty 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND is_active = true
      RETURNING id
    `;

    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Faculty member not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Faculty member deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting faculty member', 
      error: error.message 
    });
  }
};

// Update faculty order
export const updateFacultyOrder = async (req, res) => {
  try {
    const { facultyId, newOrder } = req.body;
    
    const query = `
      UPDATE faculty 
      SET display_order = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND is_active = true
      RETURNING *
    `;

    const result = await pool.query(query, [newOrder, facultyId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Faculty member not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Faculty order updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error updating faculty order', 
      error: error.message 
    });
  }
};

// Bulk update faculty orders
export const bulkUpdateFacultyOrder = async (req, res) => {
  try {
    const { faculty } = req.body; // Array of {id, display_order}
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      for (const member of faculty) {
        await client.query(
          'UPDATE faculty SET display_order = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [member.display_order, member.id]
        );
      }
      
      await client.query('COMMIT');
      
      res.status(200).json({
        success: true,
        message: 'Faculty orders updated successfully'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error updating faculty orders', 
      error: error.message 
    });
  }
};

// Search faculty
export const searchFaculty = async (req, res) => {
  try {
    const { q } = req.query;
    
    const query = `
      SELECT * FROM faculty 
      WHERE (name ILIKE $1 OR designation ILIKE $1 OR specialization ILIKE $1)
      ORDER BY display_order ASC, created_at ASC
    `;
    
    const result = await pool.query(query, [`%${q}%`]);
    
    res.status(200).json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error searching faculty', 
      error: error.message 
    });
  }
};