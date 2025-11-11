import { useState } from 'react'
import { Lock, User, Eye, EyeOff, Shield } from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import { motion } from 'framer-motion'

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Frontend-only dummy credentials validation
      const dummyCredentials = [
        { username: 'admin', password: 'admin123', fullName: 'System Administrator', role: 'super_admin' },
        { username: 'hod', password: 'hod123', fullName: 'Dr. Rajesh Kumar (HOD)', role: 'admin' },
        { username: 'faculty', password: 'faculty123', fullName: 'Prof. Priya Sharma', role: 'moderator' },
        { username: 'coordinator', password: 'coord123', fullName: 'Dr. Amit Verma', role: 'admin' },
        { username: 'assistant', password: 'assist123', fullName: 'Ms. Kavya Reddy', role: 'moderator' }
      ]
      
      const validUser = dummyCredentials.find(
        cred => cred.username === formData.username && cred.password === formData.password
      )
      
      if (validUser) {
        // Store dummy token and user data
        const dummyToken = `dummy_jwt_${validUser.username}_${Date.now()}`
        const dummyUser = {
          id: `dummy_${validUser.username}`,
          username: validUser.username,
          email: `${validUser.username}@pesitm.edu.in`,
          fullName: validUser.fullName,
          role: validUser.role,
          lastLoginAt: new Date().toISOString()
        }
        
        localStorage.setItem('adminToken', dummyToken)
        localStorage.setItem('adminUser', JSON.stringify(dummyUser))
        
        alert(`✅ Login successful! Welcome ${validUser.fullName}\n\n🎭 Role: ${validUser.role}\n📧 Email: ${dummyUser.email}`)
        console.log('Admin logged in:', dummyUser)
        
        // Clear form
        setFormData({ username: '', password: '' })
      } else {
        setError('Invalid username or password. Please check your credentials.')
      }
      
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-pesitm-blue to-blue-900 text-white py-16">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white/10 rounded-full">
                  <Shield size={48} className="text-pesitm-gold" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Admin Panel</h1>
              <p className="text-xl text-gray-200">PESITM CSE Department Administration</p>
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
                    <div className="p-3 bg-pesitm-blue rounded-full">
                      <Lock size={32} className="text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-pesitm-blue mb-2">Administrator Login</h2>
                  <p className="text-gray-600">Please sign in to access the admin panel</p>
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
                        <Lock size={16} className="mr-2" />
                        {error}
                      </p>
                    </motion.div>
                  )}

                  {/* Username Field */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={20} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue transition-colors duration-300"
                        placeholder="Enter your username"
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
                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue transition-colors duration-300"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
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
                    className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

                  {/* Demo Credentials */}
                  <div className="text-center text-sm text-gray-500 border-t pt-6">
                    <p className="mb-2 font-semibold">Available Test Credentials:</p>
                    <div className="space-y-2 text-xs">
                      <div className="bg-gray-100 p-3 rounded grid grid-cols-2 gap-2">
                        <div>
                          <p className="font-mono"><strong>admin</strong> / admin123</p>
                          <p className="text-gray-600">System Administrator</p>
                        </div>
                        <div>
                          <p className="font-mono"><strong>hod</strong> / hod123</p>
                          <p className="text-gray-600">HOD Computer Science</p>
                        </div>
                      </div>
                      <div className="bg-gray-100 p-3 rounded grid grid-cols-2 gap-2">
                        <div>
                          <p className="font-mono"><strong>faculty</strong> / faculty123</p>
                          <p className="text-gray-600">Faculty Member</p>
                        </div>
                        <div>
                          <p className="font-mono"><strong>coordinator</strong> / coord123</p>
                          <p className="text-gray-600">Program Coordinator</p>
                        </div>
                      </div>
                      <div className="bg-gray-100 p-2 rounded">
                        <p className="font-mono"><strong>assistant</strong> / assist123</p>
                        <p className="text-gray-600">Administrative Assistant</p>
                      </div>
                    </div>
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

export default AdminLogin