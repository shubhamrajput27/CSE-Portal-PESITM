import AdminUser from '../models/AdminUserPostgres.js'
import Student from '../models/Student.js'
import FacultyUser from '../models/FacultyUser.js'
import pool from '../config/database.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize PostgreSQL database with schema and default data
const initializeDatabase = async () => {
  try {
    console.log('🌱 Starting PostgreSQL Database Initialization...')

    // Read and execute schema SQL file
    const schemaPath = path.join(__dirname, '../database/postgresql_schema.sql')
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8')
    
    // Split SQL commands by semicolon and execute them
    const commands = schemaSQL.split(';').filter(cmd => cmd.trim().length > 0)
    
    for (const command of commands) {
      if (command.trim()) {
        try {
          await pool.query(command)
        } catch (error) {
          // Skip errors for commands that might already exist
          if (!error.message.includes('already exists')) {
            console.warn('SQL Warning:', error.message)
          }
        }
      }
    }

    console.log('✅ Database schema created successfully')

    // Create default admin users with hashed passwords
    const defaultAdmins = [
      {
        username: 'admin',
        email: 'admin@pesitm.edu.in',
        password: 'admin123',
        fullName: 'System Administrator',
        role: 'super_admin'
      },
      {
        username: 'hod',
        email: 'hod.cse@pesitm.edu.in',
        password: 'hod123',
        fullName: 'Dr. Prasanna Kumar H R (HOD)',
        role: 'admin'
      },
      {
        username: 'faculty',
        email: 'faculty@pesitm.edu.in',
        password: 'faculty123',
        fullName: 'Prof. Priya Sharma',
        role: 'moderator'
      },
      {
        username: 'coordinator',
        email: 'coordinator@pesitm.edu.in',
        password: 'coord123',
        fullName: 'Dr. Amit Verma (Coordinator)',
        role: 'admin'
      },
      {
        username: 'assistant',
        email: 'assistant@pesitm.edu.in',
        password: 'assist123',
        fullName: 'Ms. Kavya Reddy (Assistant)',
        role: 'moderator'
      }
    ]

    // Create admin users
    for (const adminData of defaultAdmins) {
      try {
        // Check if user already exists
        const existingUser = await AdminUser.findByUsernameOrEmail(adminData.username)
        
        if (!existingUser) {
          await AdminUser.create(adminData)
          console.log(`✅ Created admin user: ${adminData.username}`)
        } else {
          console.log(`🟡 Admin user already exists: ${adminData.username}`)
        }
      } catch (error) {
        console.error(`❌ Error creating admin user ${adminData.username}:`, error.message)
      }
    }

    // Create default students with hashed passwords
    const defaultStudents = [
      {
        studentId: '2021CSE001',
        usn: '1PE21CS001',
        email: 'student1@pestrust.edu.in',
        password: 'student123',
        fullName: 'Rahul Kumar',
        semester: 7,
        year: '4th Year'
      },
      {
        studentId: '2021CSE002',
        usn: '1PE21CS002',
        email: 'student2@pestrust.edu.in',
        password: 'student123',
        fullName: 'Priya Singh',
        semester: 7,
        year: '4th Year'
      },
      {
        studentId: '2022CSE001',
        usn: '1PE22CS001',
        email: 'student3@pestrust.edu.in',
        password: 'student123',
        fullName: 'Amit Sharma',
        semester: 5,
        year: '3rd Year'
      }
    ]

    // Create students
    for (const studentData of defaultStudents) {
      try {
        const existingStudent = await Student.findByIdentifier(studentData.usn)
        
        if (!existingStudent) {
          await Student.create(studentData)
          console.log(`✅ Created student: ${studentData.usn}`)
        } else {
          console.log(`🟡 Student already exists: ${studentData.usn}`)
        }
      } catch (error) {
        console.error(`❌ Error creating student ${studentData.usn}:`, error.message)
      }
    }

    // Create default faculty users with hashed passwords
    const defaultFacultyUsers = [
      {
        facultyId: 'FAC001',
        email: 'hodcse@pestrust.edu.in',
        password: 'faculty123',
        fullName: 'Dr. Prasanna Kumar H R',
        designation: 'Professor and Head'
      },
      {
        facultyId: 'FAC002',
        email: 'manu.ap@pestrust.edu.in',
        password: 'faculty123',
        fullName: 'Dr. Manu A P',
        designation: 'Professor'
      },
      {
        facultyId: 'FAC003',
        email: 'chethan.ls@pestrust.edu.in',
        password: 'faculty123',
        fullName: 'Dr. Chethan L S',
        designation: 'Professor'
      }
    ]

    // Create faculty users
    for (const facultyData of defaultFacultyUsers) {
      try {
        const existingFaculty = await FacultyUser.findByIdentifier(facultyData.facultyId)
        
        if (!existingFaculty) {
          await FacultyUser.create(facultyData)
          console.log(`✅ Created faculty user: ${facultyData.facultyId}`)
        } else {
          console.log(`🟡 Faculty user already exists: ${facultyData.facultyId}`)
        }
      } catch (error) {
        console.error(`❌ Error creating faculty user ${facultyData.facultyId}:`, error.message)
      }
    }

    // Display all users
    const allAdmins = await AdminUser.getAll()
    console.log('\n📋 Current Admin Users:')
    console.table(allAdmins.map(admin => ({
      ID: admin.id,
      Username: admin.username,
      Email: admin.email,
      'Full Name': admin.full_name,
      Role: admin.role,
      Active: admin.is_active,
      'Last Login': admin.last_login_at || 'Never'
    })))

    const allStudents = await Student.getAll()
    console.log('\n👨‍🎓 Current Students:')
    console.table(allStudents.map(student => ({
      ID: student.id,
      USN: student.usn,
      'Student ID': student.student_id,
      'Full Name': student.full_name,
      Semester: student.semester,
      Year: student.year
    })))

    const allFacultyUsers = await FacultyUser.getAll()
    console.log('\n👩‍🏫 Current Faculty Users:')
    console.table(allFacultyUsers.map(faculty => ({
      ID: faculty.id,
      'Faculty ID': faculty.faculty_id,
      'Full Name': faculty.full_name,
      Designation: faculty.designation,
      Email: faculty.email
    })))

    console.log('\n🎉 PostgreSQL Database Initialization Completed!')
    console.log('\n🔐 Login Credentials:')
    console.log('\n👨‍💼 Admin:')
    defaultAdmins.forEach(admin => {
      console.log(`   ${admin.username} / ${admin.password} (${admin.role})`)
    })
    console.log('\n👨‍🎓 Students:')
    defaultStudents.forEach(student => {
      console.log(`   ${student.usn} / ${student.password}`)
    })
    console.log('\n👩‍🏫 Faculty:')
    defaultFacultyUsers.forEach(faculty => {
      console.log(`   ${faculty.facultyId} / ${faculty.password}`)
    })

  } catch (error) {
    console.error('❌ Database Initialization Error:', error.message)
    throw error
  }
}

// Run initialization
const runInit = async () => {
  try {
    await initializeDatabase()
    process.exit(0)
  } catch (error) {
    console.error('❌ Initialization failed:', error.message)
    process.exit(1)
  }
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Promise Rejection:', error)
  process.exit(1)
})

// Run the initialization
runInit()