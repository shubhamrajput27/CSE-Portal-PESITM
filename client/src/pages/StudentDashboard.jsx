import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, BookOpen, GraduationCap, LogOut, Key, Calendar, Award, FileText, ClipboardList } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../utils/authUtils'
import StudentAttendanceView from '../components/StudentAttendanceView'
import StudentMarksView from '../components/StudentMarksView'

const StudentDashboard = () => {
  const navigate = useNavigate()
  const { studentUser, logout } = useAuth()
  const [loading, setLoading] = useState(!studentUser)
  const [activeView, setActiveView] = useState('dashboard')

  useEffect(() => {
    if (studentUser) {
      setLoading(false)
    }
  }, [studentUser])

  const handleViewChange = (view) => {
    setActiveView(view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogout = () => {
    logout(ROLES.STUDENT)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!studentUser) {
    return null
  }

  // Render different views based on activeView state
  if (activeView === 'attendance') {
    return <StudentAttendanceView onBack={() => handleViewChange('dashboard')} />
  }

  if (activeView === 'marks') {
    return <StudentMarksView onBack={() => handleViewChange('dashboard')} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container-custom py-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
                {studentUser.full_name?.charAt(0) || 'S'}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome, {studentUser.full_name}</h1>
                <p className="text-blue-200 text-lg">{studentUser.usn}</p>
                <p className="text-blue-200 text-sm mt-1">
                  {studentUser.semester ? `${studentUser.semester}th Semester` : ''} | {studentUser.year || ''}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Information Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User size={24} className="text-blue-600" />
                Student Profile
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* USN */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <FileText className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">University Seat Number</p>
                    <p className="font-semibold text-gray-800">{studentUser.usn}</p>
                  </div>
                </div>

                {/* Student ID */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <FileText className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Student ID</p>
                    <p className="font-semibold text-gray-800">{studentUser.student_id}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email Address</p>
                    <p className="font-semibold text-gray-800 break-all">{studentUser.email}</p>
                  </div>
                </div>

                {/* Phone */}
                {studentUser.phone && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Phone className="text-blue-600 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                      <p className="font-semibold text-gray-800">{studentUser.phone}</p>
                    </div>
                  </div>
                )}

                {/* Department */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <BookOpen className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Department</p>
                    <p className="font-semibold text-gray-800">{studentUser.department || 'Computer Science & Engineering'}</p>
                  </div>
                </div>

                {/* Semester */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <GraduationCap className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Current Semester</p>
                    <p className="font-semibold text-gray-800">{studentUser.semester ? `${studentUser.semester}th Semester` : 'N/A'}</p>
                  </div>
                </div>

                {/* Year */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Academic Year</p>
                    <p className="font-semibold text-gray-800">{studentUser.year || 'N/A'}</p>
                  </div>
                </div>

                {/* Last Login */}
                {studentUser.last_login_at && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="text-blue-600 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Last Login</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(studentUser.last_login_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Change Password Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                  <Key size={18} />
                  Change Password
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <button 
                  onClick={() => handleViewChange('attendance')}
                  className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition text-center"
                >
                  <ClipboardList className="mx-auto mb-2 text-blue-600" size={24} />
                  <p className="font-medium text-gray-800">My Attendance</p>
                </button>
                <button 
                  onClick={() => handleViewChange('marks')}
                  className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition text-center"
                >
                  <FileText className="mx-auto mb-2 text-blue-600" size={24} />
                  <p className="font-medium text-gray-800">My Marks</p>
                </button>
                <button className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition text-center">
                  <Award className="mx-auto mb-2 text-blue-600" size={24} />
                  <p className="font-medium text-gray-800">Results</p>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Account Type</span>
                  <span className="font-medium text-gray-800">Student</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Section</span>
                  <span className="font-medium text-gray-800">{studentUser.section || 'A'}</span>
                </div>
              </div>
            </div>

            {/* Announcements */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Announcements</h3>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800 mb-1">Exam Schedule</p>
                  <p className="text-xs text-gray-600">Mid-term exam schedule has been released</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800 mb-1">Workshop Alert</p>
                  <p className="text-xs text-gray-600">AI/ML workshop registration is now open</p>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Calendar className="text-blue-600 mt-1" size={16} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Hackathon 2024</p>
                    <p className="text-xs text-gray-500">Dec 15, 2024</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="text-blue-600 mt-1" size={16} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Tech Talk</p>
                    <p className="text-xs text-gray-500">Dec 20, 2024</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Help & Support</h3>
              <div className="space-y-3">
                <a href="/contact" className="block text-blue-600 hover:text-blue-700 text-sm">
                  Contact Support
                </a>
                <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">
                  Student Handbook
                </a>
                <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">
                  Portal Guide
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
