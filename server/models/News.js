import pool from '../config/database.js'

class News {
  // Create a new news article
  static async create(newsData) {
    const {
      title,
      content,
      excerpt,
      category = 'general',
      image_url,
      published_at,
      is_featured = false,
      is_published = true,
      author_id
    } = newsData

    try {
      const query = `
        INSERT INTO news (title, content, excerpt, category, image_url, published_at, is_featured, is_published, author_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `
      
      const values = [title, content, excerpt, category, image_url, published_at || new Date().toISOString(), is_featured, is_published, author_id]
      const result = await pool.query(query, values)
      
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error creating news: ${error.message}`)
    }
  }

  // Get all published news
  static async getAll(limit = null, offset = 0) {
    try {
      let query = `
        SELECT n.*, au.full_name as author_name
        FROM news n
        LEFT JOIN admin_users au ON n.author_id = au.id
        WHERE n.is_published = TRUE
        ORDER BY n.published_at DESC
      `
      
      if (limit) {
        query += ` LIMIT $1 OFFSET $2`
        const result = await pool.query(query, [limit, offset])
        return result.rows
      } else {
        const result = await pool.query(query)
        return result.rows
      }
    } catch (error) {
      throw new Error(`Error getting news: ${error.message}`)
    }
  }

  // Get all news for admin (published and unpublished drafts)
  static async getAllForAdmin(limit = null, offset = 0) {
    try {
      let query = `
        SELECT n.*, au.full_name as author_name
        FROM news n
        LEFT JOIN admin_users au ON n.author_id = au.id
        ORDER BY n.created_at DESC
      `
      
      if (limit) {
        query += ` LIMIT $1 OFFSET $2`
        const result = await pool.query(query, [limit, offset])
        return result.rows
      } else {
        const result = await pool.query(query)
        return result.rows
      }
    } catch (error) {
      throw new Error(`Error getting news: ${error.message}`)
    }
  }

  // Get featured news
  static async getFeatured() {
    try {
      const query = `
        SELECT n.*, au.full_name as author_name
        FROM news n
        LEFT JOIN admin_users au ON n.author_id = au.id
        WHERE n.is_published = TRUE AND n.is_featured = TRUE
        ORDER BY n.published_at DESC
        LIMIT 5
      `
      
      const result = await pool.query(query)
      return result.rows
    } catch (error) {
      throw new Error(`Error getting featured news: ${error.message}`)
    }
  }

  // Get news by ID
  static async getById(id) {
    try {
      const query = `
        SELECT n.*, au.full_name as author_name
        FROM news n
        LEFT JOIN admin_users au ON n.author_id = au.id
        WHERE n.id = $1
      `
      
      const result = await pool.query(query, [id])
      return result.rows[0] || null
    } catch (error) {
      throw new Error(`Error getting news by ID: ${error.message}`)
    }
  }

  // Get news by category
  static async getByCategory(category) {
    try {
      const query = `
        SELECT n.*, au.full_name as author_name
        FROM news n
        LEFT JOIN admin_users au ON n.author_id = au.id
        WHERE n.is_published = TRUE AND n.category = $1
        ORDER BY n.published_at DESC
      `
      
      const result = await pool.query(query, [category])
      return result.rows
    } catch (error) {
      throw new Error(`Error getting news by category: ${error.message}`)
    }
  }

  // Update news
  static async update(id, newsData) {
    const {
      title,
      content,
      excerpt,
      category,
      image_url,
      published_at,
      is_featured,
      is_published
    } = newsData

    try {
      const query = `
        UPDATE news 
        SET title = $1, content = $2, excerpt = $3, category = $4, 
            image_url = $5, published_at = $6, is_featured = $7, is_published = $8,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
        RETURNING *
      `
      
      const values = [title, content, excerpt, category, image_url, published_at, is_featured, is_published, id]
      const result = await pool.query(query, values)
      
      return result.rows[0] || null
    } catch (error) {
      throw new Error(`Error updating news: ${error.message}`)
    }
  }

  // Delete news (soft delete by setting is_published to false)
  static async delete(id) {
    try {
      const query = `
        UPDATE news 
        SET is_published = FALSE, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `
      
      const result = await pool.query(query, [id])
      return result.rows[0] || null
    } catch (error) {
      throw new Error(`Error deleting news: ${error.message}`)
    }
  }

  // Get all categories
  static async getCategories() {
    try {
      const query = `
        SELECT DISTINCT category
        FROM news
        WHERE is_published = TRUE
        ORDER BY category
      `
      
      const result = await pool.query(query)
      return result.rows.map(row => row.category)
    } catch (error) {
      throw new Error(`Error getting categories: ${error.message}`)
    }
  }

  // Search news
  static async search(searchTerm) {
    try {
      const query = `
        SELECT n.*, au.full_name as author_name
        FROM news n
        LEFT JOIN admin_users au ON n.author_id = au.id
        WHERE n.is_published = TRUE 
        AND (n.title ILIKE $1 OR n.content ILIKE $1 OR n.excerpt ILIKE $1)
        ORDER BY n.published_at DESC
      `
      
      const searchPattern = `%${searchTerm}%`
      const result = await pool.query(query, [searchPattern])
      return result.rows
    } catch (error) {
      throw new Error(`Error searching news: ${error.message}`)
    }
  }
}

export default News