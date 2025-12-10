import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, Eye, EyeOff, Shield, GraduationCap, UserCircle } from 'lucide-react'
import axios from 'axios'

const Login = () => {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState('student')
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loginOptions = [
    {
      role: 'admin',
      title: 'Admin',
      icon: Shield,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      bgColor: 'from-red-500 to-red-700',
      placeholder: 'Admin Username'
    },
    {
      role: 'faculty',
      title: 'Faculty',
      icon: UserCircle,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      bgColor: 'from-purple-500 to-purple-700',
      placeholder: 'Faculty ID or Email'
    },
    {
      role: 'student',
      title: 'Student',
      icon: GraduationCap,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      bgColor: 'from-blue-500 to-blue-700',
      placeholder: 'USN or Student ID'
    }
  ]

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setFormData({ identifier: '', password: '' })
    setError('')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      let endpoint = ''
      let tokenKey = ''
      let userKey = ''
      let dashboardPath = ''
      let requestBody = {}

      // Determine endpoint and storage keys based on selected role
      if (selectedRole === 'admin') {
        endpoint = `${API_URL}/api/admin/login`
        tokenKey = 'adminToken'
        userKey = 'adminUser'
        dashboardPath = '/admin/dashboard'
        requestBody = {
          username: formData.identifier,
          password: formData.password
        }
      } else if (selectedRole === 'faculty') {
        endpoint = `${API_URL}/api/faculty-auth/login`
        tokenKey = 'facultyToken'
        userKey = 'facultyData'
        dashboardPath = '/faculty/dashboard'
        requestBody = formData
      } else if (selectedRole === 'student') {
        endpoint = `${API_URL}/api/student/login`
        tokenKey = 'studentToken'
        userKey = 'studentData'
        dashboardPath = '/student/dashboard'
        requestBody = formData
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const userData = selectedRole === 'admin' ? data.data.admin : 
                        selectedRole === 'faculty' ? data.data.faculty : 
                        data.data.student
        
        localStorage.setItem(tokenKey, data.data.token)
        localStorage.setItem(userKey, JSON.stringify(userData))
        
        // Force reload after navigation to ensure AuthContext picks up the data
        window.location.href = dashboardPath
      } else {
        console.error('Login failed:', data.message)
        setError(data.message || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      console.error('Login error:', err)
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Unable to connect to server. Please ensure the server is running.')
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const getSelectedOption = () => {
    return loginOptions.find(option => option.role === selectedRole)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-20 left-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"
        />
        <div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"
        />
        <div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"
        />
      </div>

      {/* Login Card */}
      <div 
        className="relative z-10 w-full max-w-md"
      >
        {/* Glassmorphism Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div 
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Lock className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Login</h1>
            <p className="text-gray-600 text-sm">PESITM CSE Department</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div
                className="p-3 bg-red-50 border border-red-200 rounded-2xl"
              >
                <p className="text-red-700 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Email/Username Field */}
            <div>
              <label htmlFor="identifier" className="block text-gray-700 text-sm font-medium mb-2">
                {loginOptions.find(opt => opt.role === selectedRole)?.placeholder || 'Username'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="identifier"
                  name="identifier"
                  required
                  value={formData.identifier}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-gray-700 text-sm font-medium">
                  Password
                </label>
                <button
                  type="button"
                  className="text-blue-600 text-xs hover:text-blue-800 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-600 text-sm">or continue with</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Role Selection Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {loginOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.role}
                  type="button"
                  onClick={() => handleRoleSelect(option.role)}
                  className={`flex flex-col items-center justify-center py-4 rounded-2xl transition-all duration-300 ${
                    selectedRole === option.role
                      ? `${option.color} text-white shadow-lg scale-105`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={24} className="mb-1" />
                  <span className="text-xs font-medium">{option.title}</span>
                </button>
              )
            })}
          </div>

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <button className="text-blue-600 font-semibold hover:underline">
                Register for free
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-xs">
            © 2024 PESITM CSE Department. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
