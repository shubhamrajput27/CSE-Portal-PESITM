import pool from '../config/database.js'

class SystemSettings {
  // Get setting by key
  static async get(key) {
    const query = 'SELECT * FROM system_settings WHERE setting_key = $1'
    const result = await pool.query(query, [key])
    return result.rows[0]
  }

  // Get setting value only
  static async getValue(key) {
    const setting = await this.get(key)
    return setting ? setting.setting_value : null
  }

  // Get all settings
  static async getAll() {
    const query = 'SELECT * FROM system_settings ORDER BY setting_key'
    const result = await pool.query(query)
    return result.rows
  }

  // Update setting
  static async update(key, value, updatedBy = null) {
    const query = `
      UPDATE system_settings
      SET setting_value = $1, updated_by = $2, updated_at = CURRENT_TIMESTAMP
      WHERE setting_key = $3
      RETURNING *
    `
    
    const result = await pool.query(query, [value, updatedBy, key])
    return result.rows[0]
  }

  // Create new setting
  static async create(key, value, description = null, updatedBy = null) {
    const query = `
      INSERT INTO system_settings (setting_key, setting_value, description, updated_by)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (setting_key) DO UPDATE
      SET setting_value = EXCLUDED.setting_value,
          description = EXCLUDED.description,
          updated_by = EXCLUDED.updated_by,
          updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `
    
    const result = await pool.query(query, [key, value, description, updatedBy])
    return result.rows[0]
  }

  // Batch update settings
  static async batchUpdate(settings, updatedBy = null) {
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      
      const results = []
      for (const setting of settings) {
        const query = `
          UPDATE system_settings
          SET setting_value = $1, updated_by = $2, updated_at = CURRENT_TIMESTAMP
          WHERE setting_key = $3
          RETURNING *
        `
        
        const result = await client.query(query, [
          setting.value,
          updatedBy,
          setting.key
        ])
        
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

  // Get current academic year
  static async getCurrentAcademicYear() {
    return await this.getValue('current_academic_year')
  }

  // Get attendance threshold
  static async getAttendanceThreshold() {
    const value = await this.getValue('attendance_percentage_required')
    return value ? parseInt(value) : 75
  }

  // Get department name
  static async getDepartmentName() {
    return await this.getValue('department_name') || 'Computer Science & Engineering'
  }

  // Get department logo
  static async getDepartmentLogo() {
    return await this.getValue('department_logo') || '/uploads/logo/default-logo.png'
  }

  // Update department logo
  static async updateDepartmentLogo(logoPath, updatedBy) {
    return await this.update('department_logo', logoPath, updatedBy)
  }

  // Update academic year
  static async updateAcademicYear(year, updatedBy) {
    return await this.update('current_academic_year', year, updatedBy)
  }
}

export default SystemSettings
