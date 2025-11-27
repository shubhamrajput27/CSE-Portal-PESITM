import pool from '../config/database.js'

class UserNotification {
  // Create user notification
  static async create(notificationData) {
    const {
      user_id,
      user_type,
      notification_type,
      title,
      message,
      link = null
    } = notificationData

    const query = `
      INSERT INTO user_notifications (
        user_id, user_type, notification_type, title, message, link
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `
    
    const values = [user_id, user_type, notification_type, title, message, link]
    const result = await pool.query(query, values)
    return result.rows[0]
  }

  // Create bulk notifications
  static async createBulk(notifications) {
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      
      const results = []
      for (const notification of notifications) {
        const query = `
          INSERT INTO user_notifications (
            user_id, user_type, notification_type, title, message, link
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `
        
        const values = [
          notification.user_id,
          notification.user_type,
          notification.notification_type,
          notification.title,
          notification.message,
          notification.link || null
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

  // Get notifications for user
  static async getForUser(userId, userType, limit = 50) {
    const query = `
      SELECT *
      FROM user_notifications
      WHERE user_id = $1 AND user_type = $2
      ORDER BY created_at DESC
      LIMIT $3
    `
    
    const result = await pool.query(query, [userId, userType, limit])
    return result.rows
  }

  // Get unread count
  static async getUnreadCount(userId, userType) {
    const query = `
      SELECT COUNT(*) as unread_count
      FROM user_notifications
      WHERE user_id = $1 AND user_type = $2 AND is_read = FALSE
    `
    
    const result = await pool.query(query, [userId, userType])
    return parseInt(result.rows[0].unread_count)
  }

  // Mark as read
  static async markAsRead(id) {
    const query = `
      UPDATE user_notifications
      SET is_read = TRUE
      WHERE id = $1
      RETURNING *
    `
    
    const result = await pool.query(query, [id])
    return result.rows[0]
  }

  // Mark all as read for user
  static async markAllAsRead(userId, userType) {
    const query = `
      UPDATE user_notifications
      SET is_read = TRUE
      WHERE user_id = $1 AND user_type = $2 AND is_read = FALSE
      RETURNING *
    `
    
    const result = await pool.query(query, [userId, userType])
    return result.rows
  }

  // Delete notification
  static async delete(id) {
    const query = 'DELETE FROM user_notifications WHERE id = $1 RETURNING *'
    const result = await pool.query(query, [id])
    return result.rows[0]
  }

  // Delete old notifications (cleanup)
  static async deleteOld(daysOld = 30) {
    const query = `
      DELETE FROM user_notifications
      WHERE created_at < NOW() - INTERVAL '${daysOld} days'
      RETURNING *
    `
    
    const result = await pool.query(query)
    return result.rows
  }
}

export default UserNotification
