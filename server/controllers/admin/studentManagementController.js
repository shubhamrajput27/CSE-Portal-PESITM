import Student from '../../models/Student.js'
import MentorMentee from '../../models/MentorMentee.js'

// Get all students with filters
export const getAllStudents = async (req, res) => {
  try {
    const { semester, section, search, is_active } = req.query

    const filters = {}
    if (semester) filters.semester = parseInt(semester)
    if (section) filters.section = section
    if (is_active !== undefined) filters.is_active = is_active === 'true'

    let students = await Student.getAll(filters)

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      students = students.filter(s => 
        s.full_name?.toLowerCase().includes(searchLower) ||
        s.usn?.toLowerCase().includes(searchLower) ||
        s.email?.toLowerCase().includes(searchLower)
      )
    }

    res.status(200).json({
      success: true,
      data: { students },
      count: students.length
    })
  } catch (error) {
    console.error('Get All Students Error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students list'
    })
  }
}

// Get student by ID
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params

    const student = await Student.findById(id)

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      })
    }

    // Get mentor info
    const mentorInfo = await MentorMentee.getStudentMentor(id)

    res.status(200).json({
      success: true,
      data: { 
        student,
        mentor: mentorInfo
      }
    })
  } catch (error) {
    console.error('Get Student Error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student details'
    })
  }
}

// Add new student
export const addStudent = async (req, res) => {
  try {
    const {
      usn,
      full_name,
      email,
      password,
      phone,
      semester,
      section,
      date_of_birth,
      address
    } = req.body

    // Validation
    if (!usn || !full_name || !email || !password || !semester) {
      return res.status(400).json({
        success: false,
        message: 'USN, name, email, password, and semester are required'
      })
    }

    // Check if student already exists
    const existingStudent = await Student.findByIdentifier(usn)
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this USN already exists'
      })
    }

    // Create student
    const newStudent = await Student.create({
      usn,
      full_name,
      email,
      password,
      phone,
      semester: parseInt(semester),
      section,
      date_of_birth,
      address
    })

    // Remove password from response
    const { password_hash, ...studentData } = newStudent

    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      data: { student: studentData }
    })
  } catch (error) {
    console.error('Add Student Error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add student'
    })
  }
}

// Update student information
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Remove sensitive fields
    delete updateData.password
    delete updateData.password_hash
    delete updateData.usn

    // Convert semester to number if provided
    if (updateData.semester) {
      updateData.semester = parseInt(updateData.semester)
    }

    const updatedStudent = await Student.update(id, updateData)

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: { student: updatedStudent }
    })
  } catch (error) {
    console.error('Update Student Error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update student'
    })
  }
}

// Toggle student active status
export const toggleStudentStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { is_active } = req.body

    if (is_active === undefined) {
      return res.status(400).json({
        success: false,
        message: 'is_active field is required'
      })
    }

    const updatedStudent = await Student.update(id, { is_active })

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      })
    }

    res.status(200).json({
      success: true,
      message: `Student ${is_active ? 'activated' : 'deactivated'} successfully`,
      data: { student: updatedStudent }
    })
  } catch (error) {
    console.error('Toggle Student Status Error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update student status'
    })
  }
}

// Bulk update students (e.g., promote to next semester)
export const bulkUpdateStudents = async (req, res) => {
  try {
    const { student_ids, update_data } = req.body

    if (!student_ids || !Array.isArray(student_ids) || !update_data) {
      return res.status(400).json({
        success: false,
        message: 'Student IDs array and update data are required'
      })
    }

    // Remove sensitive fields
    delete update_data.password
    delete update_data.password_hash
    delete update_data.usn

    const results = []
    for (const id of student_ids) {
      try {
        const updated = await Student.update(id, update_data)
        if (updated) results.push(updated)
      } catch (err) {
        console.error(`Failed to update student ${id}:`, err)
      }
    }

    res.status(200).json({
      success: true,
      message: `Successfully updated ${results.length} students`,
      data: { students: results }
    })
  } catch (error) {
    console.error('Bulk Update Students Error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to bulk update students'
    })
  }
}

// Reset student password
export const resetStudentPassword = async (req, res) => {
  try {
    const { id } = req.params
    const { new_password } = req.body

    if (!new_password || new_password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password is required and must be at least 8 characters'
      })
    }

    await Student.changePassword(id, new_password)

    res.status(200).json({
      success: true,
      message: 'Student password reset successfully'
    })
  } catch (error) {
    console.error('Reset Student Password Error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to reset student password'
    })
  }
}

// Delete student (deactivate)
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params

    // Deactivate instead of delete
    const updatedStudent = await Student.update(id, { is_active: false })

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Student deactivated successfully',
      data: { student: updatedStudent }
    })
  } catch (error) {
    console.error('Delete Student Error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete student'
    })
  }
}
