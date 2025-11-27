import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Briefcase, GraduationCap, LogOut, Key, Calendar, BookOpen, Award, ClipboardList, FileText } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../utils/authUtils'
import AttendanceMarking from '../components/AttendanceMarking'
import MarksEntry from '../components/MarksEntry'

const FacultyDashboard = () => {
  const navigate = useNavigate()
  const { facultyUser, logout } = useAuth()
  const [loading, setLoading] = useState(!facultyUser)
  const [activeView, setActiveView] = useState('dashboard')

  useEffect(() => {
    if (facultyUser) {
      setLoading(false)
    }
  }, [facultyUser])

  const handleLogout = () => {
    logout(ROLES.FACULTY)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!facultyUser) {
    return null
  }

  // Render different views based on activeView state
  if (activeView === 'attendance') {
    return <AttendanceMarking onBack={() => setActiveView('dashboard')} />
  }

  if (activeView === 'marks') {
    return <MarksEntry onBack={() => setActiveView('dashboard')} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="container-custom py-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold">
                {facultyUser.full_name?.charAt(0) || 'F'}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome, {facultyUser.full_name}</h1>
                <p className="text-indigo-200 text-lg">{facultyUser.designation}</p>
                <p className="text-indigo-200 text-sm mt-1">{facultyUser.department || 'Computer Science & Engineering'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition font-medium"
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
                <User size={24} className="text-indigo-600" />
                Profile Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Faculty ID */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Briefcase className="text-indigo-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Faculty ID</p>
                    <p className="font-semibold text-gray-800">{facultyUser.faculty_id}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="text-indigo-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email Address</p>
                    <p className="font-semibold text-gray-800 break-all">{facultyUser.email}</p>
                  </div>
                </div>

                {/* Phone */}
                {facultyUser.phone && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Phone className="text-indigo-600 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                      <p className="font-semibold text-gray-800">{facultyUser.phone}</p>
                    </div>
                  </div>
                )}

                {/* Designation */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <GraduationCap className="text-indigo-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Designation</p>
                    <p className="font-semibold text-gray-800">{facultyUser.designation}</p>
                  </div>
                </div>

                {/* Department */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <BookOpen className="text-indigo-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Department</p>
                    <p className="font-semibold text-gray-800">{facultyUser.department || 'CSE'}</p>
                  </div>
                </div>

                {/* Last Login */}
                {facultyUser.last_login_at && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="text-indigo-600 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Last Login</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(facultyUser.last_login_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Change Password Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium">
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
                  onClick={() => setActiveView('attendance')}
                  className="p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition text-center"
                >
                  <ClipboardList className="mx-auto mb-2 text-indigo-600" size={24} />
                  <p className="font-medium text-gray-800">Mark Attendance</p>
                </button>
                <button 
                  onClick={() => setActiveView('marks')}
                  className="p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition text-center"
                >
                  <FileText className="mx-auto mb-2 text-indigo-600" size={24} />
                  <p className="font-medium text-gray-800">Enter Marks</p>
                </button>
                <button className="p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition text-center">
                  <BookOpen className="mx-auto mb-2 text-indigo-600" size={24} />
                  <p className="font-medium text-gray-800">My Courses</p>
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
                  <span className="font-medium text-gray-800">Faculty</span>
                </div>
              </div>
            </div>

            {/* Announcements */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Announcements</h3>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800 mb-1">Faculty Meeting</p>
                  <p className="text-xs text-gray-600">Department meeting scheduled for tomorrow at 10 AM</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800 mb-1">Exam Schedule</p>
                  <p className="text-xs text-gray-600">Mid-term exam schedule has been released</p>
                </div>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Help & Support</h3>
              <div className="space-y-3">
                <a href="/contact" className="block text-indigo-600 hover:text-indigo-700 text-sm">
                  Contact IT Support
                </a>
                <a href="#" className="block text-indigo-600 hover:text-indigo-700 text-sm">
                  Faculty Handbook
                </a>
                <a href="#" className="block text-indigo-600 hover:text-indigo-700 text-sm">
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

export default FacultyDashboard
