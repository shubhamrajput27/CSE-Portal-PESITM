import FacultyUser from '../../models/FacultyUser.js'
import MentorMentee from '../../models/MentorMentee.js'
import Subject from '../../models/Subject.js'
import SystemSettings from '../../models/SystemSettings.js'

// Get all faculty with filters
export const getAllFaculty = async (req, res) => {
  try {
    const { department, is_active, search } = req.query

    const filters = {}
    if (department) filters.department = department
    if (is_active !== undefined) filters.is_active = is_active === 'true'

    let faculty = await FacultyUser.getAll(filters)

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      faculty = faculty.filter(f => 
        f.name?.toLowerCase().includes(searchLower) ||
        f.email?.toLowerCase().includes(searchLower) ||
        f.employee_id?.toLowerCase().includes(searchLower)
      )
    }

    res.status(200).json({
      success: true,
      data: { faculty },
      count: faculty.length
    })
  } catch (error) {
    console.error('Get All Faculty Error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch faculty list'
    })
  }
}

// Add new faculty
export const addFaculty = async (req, res) => {
  try {
    const {
      employee_id,
      name,
      email,
      password,
      phone,
      department = 'CSE',
      designation,
      specialization,
      qualification,
      experience,
      date_of_joining
    } = req.body

    // Validation
    if (!employee_id || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID, name, email, and password are required'
      })
    }

    // Check if faculty already exists
    const existingFaculty = await FacultyUser.findByIdentifier(email)
    if (existingFaculty) {
      return res.status(400).json({
        success: false,
        message: 'Faculty with this email already exists'
      })
    }

    // Create faculty
    const newFaculty = await FacultyUser.create({
      employee_id,
      name,
      email,
      password, // Will be hashed in the model
      phone,
      department,
      designation,
      specialization,
      qualification,
      experience,
      date_of_joining
    })

    // Remove password from response
    const { password_hash, ...facultyData } = newFaculty

    res.status(201).json({
      success: true,
      message: 'Faculty added successfully',
      data: { faculty: facultyData }
    })
  } catch (error) {
    console.error('Add Faculty Error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add faculty'
    })
  }
}

// Update faculty information
export const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.password
    delete updateData.password_hash
    delete updateData.employee_id

    const updatedFaculty = await FacultyUser.update(id, updateData)

    if (!updatedFaculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Faculty updated successfully',
      data: { faculty: updatedFaculty }
    })
  } catch (error) {
    console.error('Update Faculty Error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update faculty'
    })
  }
}

// Activate/Deactivate faculty
export const toggleFacultyStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { is_active } = req.body

    if (is_active === undefined) {
      return res.status(400).json({
        success: false,
        message: 'is_active field is required'
      })
    }

    const updatedFaculty = await FacultyUser.update(id, { is_active })

    if (!updatedFaculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      })
    }

    res.status(200).json({
      success: true,
      message: `Faculty ${is_active ? 'activated' : 'deactivated'} successfully`,
      data: { faculty: updatedFaculty }
    })
  } catch (error) {
    console.error('Toggle Faculty Status Error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update faculty status'
    })
  }
}

// Assign faculty as mentor to students
export const assignMentor = async (req, res) => {
  try {
    const { faculty_id, student_ids } = req.body
    const academicYear = await SystemSettings.getCurrentAcademicYear()

    if (!faculty_id || !student_ids || !Array.isArray(student_ids)) {
      return res.status(400).json({
        success: false,
        message: 'Faculty ID and array of student IDs are required'
      })
    }

    // Check if faculty exists
    const faculty = await FacultyUser.findById(faculty_id)
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      })
    }

    // Prepare assignments
    const assignments = student_ids.map(student_id => ({
      student_id,
      faculty_id
    }))

    // Bulk assign
    const results = await MentorMentee.bulkAssign(assignments, academicYear)

    res.status(200).json({
      success: true,
      message: `Successfully assigned ${results.length} students to ${faculty.name}`,
      data: { assignments: results }
    })
  } catch (error) {
    console.error('Assign Mentor Error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to assign mentor'
    })
  }
}

// Get faculty workload (subjects and mentees count)
export const getFacultyWorkload = async (req, res) => {
  try {
    const { id } = req.params
    const academicYear = await SystemSettings.getCurrentAcademicYear()

    // Get assigned subjects
    const subjects = await Subject.getAssignedFaculty(id, academicYear)
    
    // Get mentees
    const mentees = await MentorMentee.getMentees(id, academicYear)
    
    // Get mentee stats
    const menteeStats = await MentorMentee.getFacultyMenteeStats(id, academicYear)

    res.status(200).json({
      success: true,
      data: {
        subjects_count: subjects.length,
        subjects,
        mentees_count: mentees.length,
        mentee_stats: menteeStats
      }
    })
  } catch (error) {
    console.error('Get Faculty Workload Error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch faculty workload'
    })
  }
}

// Delete faculty (only if no dependencies)
export const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params

    // Check if faculty has active assignments
    const academicYear = await SystemSettings.getCurrentAcademicYear()
    const mentees = await MentorMentee.getMentees(id, academicYear)

    if (mentees.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete faculty with active mentees. Please reassign mentees first.'
      })
    }

    // Instead of deleting, deactivate
    const updatedFaculty = await FacultyUser.update(id, { is_active: false })

    res.status(200).json({
      success: true,
      message: 'Faculty deactivated successfully',
      data: { faculty: updatedFaculty }
    })
  } catch (error) {
    console.error('Delete Faculty Error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete faculty'
    })
  }
}
