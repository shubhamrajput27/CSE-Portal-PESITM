import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, User, AlertCircle, Eye, EyeOff, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import AnimatedSection from '../components/AnimatedSection'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../utils/authUtils'

const StudentLogin = () => {
  const navigate = useNavigate()
  const { login, hasRole } = useAuth()
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (hasRole(ROLES.STUDENT)) {
      navigate('/student/dashboard')
    }
  }, [hasRole, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/student/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const { token, student } = data.data
        
        // Use auth context to login
        login(ROLES.STUDENT, token, student)
      } else {
        setError(data.message || 'Login failed. Please try again.')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Unable to connect to server. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white/10 rounded-full">
                  <BookOpen size={48} className="text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Student Portal</h1>
              <p className="text-xl text-blue-100">PESITM CSE Department</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Login Form Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-md mx-auto">
            <AnimatedSection>
              <motion.div 
                className="card bg-white shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-600 rounded-full">
                      <User size={32} className="text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-blue-600 mb-2">Student Login</h2>
                  <p className="text-gray-600">Access your student portal</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Message */}
                  {error && (
                    <motion.div 
                      className="p-4 bg-red-50 border border-red-200 rounded-lg"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-red-700 text-sm flex items-center">
                        <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                        {error}
                      </p>
                    </motion.div>
                  )}

                  {/* USN/Student ID Field */}
                  <div>
                    <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                      USN / Student ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={20} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="identifier"
                        name="identifier"
                        required
                        value={formData.identifier}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors duration-300"
                        placeholder="Enter USN or Student ID"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={20} className="text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors duration-300"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Login Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={20} />
                        <span>Sign In</span>
                      </>
                    )}
                  </motion.button>

                  {/* Forgot Password Link */}
                  <div className="text-center">
                    <Link 
                      to="/forgot-password?role=student" 
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </form>
              </motion.div>
            </AnimatedSection>

            {/* Additional Info */}
            <AnimatedSection delay={0.4}>
              <motion.div 
                className="text-center mt-8 text-sm text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <p>© 2024 PESITM CSE Department. All rights reserved.</p>
                <p className="mt-1">For technical support, contact the IT department.</p>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}

export default StudentLogin
