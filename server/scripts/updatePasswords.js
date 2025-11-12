import Student from '../models/Student.js'
import FacultyUser from '../models/FacultyUser.js'
import pool from '../config/database.js'
import bcrypt from 'bcrypt'

const updatePasswords = async () => {
  try {
    console.log('🔐 Updating Student and Faculty Passwords...\n')

    // Hash the password
    const saltRounds = 12
    const studentPassword = await bcrypt.hash('student123', saltRounds)
    const facultyPassword = await bcrypt.hash('faculty123', saltRounds)

    // Update students
    const studentUpdates = [
      { usn: '1PE21CS001', password: studentPassword },
      { usn: '1PE21CS002', password: studentPassword },
      { usn: '1PE22CS001', password: studentPassword }
    ]

    for (const student of studentUpdates) {
      await pool.query('UPDATE students SET password_hash = $1 WHERE usn = $2', [student.password, student.usn])
      console.log(`✅ Updated password for student: ${student.usn}`)
    }

    // Update faculty
    const facultyUpdates = [
      { facultyId: 'FAC001', password: facultyPassword },
      { facultyId: 'FAC002', password: facultyPassword },
      { facultyId: 'FAC003', password: facultyPassword }
    ]

    for (const faculty of facultyUpdates) {
      await pool.query('UPDATE faculty_users SET password_hash = $1 WHERE faculty_id = $2', [faculty.password, faculty.facultyId])
      console.log(`✅ Updated password for faculty: ${faculty.facultyId}`)
    }

    console.log('\n🎉 All passwords updated successfully!')
    console.log('\n🔐 Updated Login Credentials:')
    console.log('\n👨‍🎓 Students:')
    console.log('   1PE21CS001 / student123')
    console.log('   1PE21CS002 / student123')
    console.log('   1PE22CS001 / student123')
    console.log('\n👩‍🏫 Faculty:')
    console.log('   FAC001 / faculty123')
    console.log('   FAC002 / faculty123')
    console.log('   FAC003 / faculty123')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error updating passwords:', error.message)
    process.exit(1)
  }
}

updatePasswords()
