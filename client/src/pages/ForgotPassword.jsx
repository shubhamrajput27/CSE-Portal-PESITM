import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock, AlertCircle, CheckCircle, ArrowLeft, Key } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from '../components/AnimatedSection'
import axios from 'axios'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const roleParam = searchParams.get('role') || 'student'
  
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
    role: roleParam
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resetToken, setResetToken] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('http://localhost:5000/api/password-reset/request-reset', {
        email: formData.email,
        role: formData.role
      })

      if (response.data.success) {
        setSuccess('OTP has been sent to your email')
        setStep(2)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('http://localhost:5000/api/password-reset/verify-otp', {
        email: formData.email,
        otp: formData.otp,
        role: formData.role
      })

      if (response.data.success) {
        setResetToken(response.data.data.resetToken)
        setSuccess('OTP verified successfully')
        setStep(3)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const response = await axios.post('http://localhost:5000/api/password-reset/reset-password', {
        email: formData.email,
        resetToken,
        newPassword: formData.newPassword,
        role: formData.role
      })

      if (response.data.success) {
        setSuccess('Password reset successful! Redirecting to login...')
        setTimeout(() => {
          const loginRoutes = {
            admin: '/admin',
            faculty: '/faculty/login',
            student: '/student/login'
          }
          navigate(loginRoutes[formData.role] || '/login')
        }, 2000)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = () => {
    switch (formData.role) {
      case 'admin': return 'from-blue-600 to-blue-800'
      case 'faculty': return 'from-indigo-600 to-indigo-800'
      case 'student': return 'from-blue-600 to-blue-800'
      default: return 'from-blue-600 to-blue-800'
    }
  }

  const getRoleTitle = () => {
    return formData.role.charAt(0).toUpperCase() + formData.role.slice(1)
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className={`bg-gradient-to-r ${getRoleColor()} text-white py-16`}>
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white/10 rounded-full">
                  <Key size={48} className="text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Reset Password</h1>
              <p className="text-xl text-blue-100">{getRoleTitle()} Portal</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-md mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Login
            </button>

            <AnimatedSection>
              <motion.div 
                className="card bg-white shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Progress Indicator */}
                <div className="mb-8">
                  <div className="flex justify-between items-center">
                    {[1, 2, 3].map((s) => (
                      <div key={s} className="flex items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {step > s ? <CheckCircle size={20} /> : s}
                        </div>
                        {s < 3 && (
                          <div className={`flex-1 h-1 mx-2 ${
                            step > s ? 'bg-blue-600' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Email</span>
                    <span>Verify OTP</span>
                    <span>New Password</span>
                  </div>
                </div>

                {/* Success/Error Messages */}
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6"
                    >
                      <p className="text-red-700 text-sm flex items-center">
                        <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                        {error}
                      </p>
                    </motion.div>
                  )}

                  {success && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6"
                    >
                      <p className="text-green-700 text-sm flex items-center">
                        <CheckCircle size={16} className="mr-2 flex-shrink-0" />
                        {success}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step 1: Email Input */}
                {step === 1 && (
                  <form onSubmit={handleRequestOTP} className="space-y-6">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter Your Email</h2>
                      <p className="text-gray-600 text-sm">We'll send you an OTP to reset your password</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={20} className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                    >
                      {loading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                  </form>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                  <form onSubmit={handleVerifyOTP} className="space-y-6">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter OTP</h2>
                      <p className="text-gray-600 text-sm">Enter the 6-digit code sent to {formData.email}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OTP Code
                      </label>
                      <input
                        type="text"
                        name="otp"
                        required
                        maxLength={6}
                        value={formData.otp}
                        onChange={handleChange}
                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-center text-2xl tracking-widest font-mono"
                        placeholder="000000"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                    >
                      {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setStep(1)
                        setFormData({ ...formData, otp: '' })
                        setError('')
                      }}
                      className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Resend OTP
                    </button>
                  </form>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                  <form onSubmit={handleResetPassword} className="space-y-6">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">Create New Password</h2>
                      <p className="text-gray-600 text-sm">Enter your new password below</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={20} className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="newPassword"
                          required
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                          placeholder="Enter new password"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={20} className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="confirmPassword"
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                    >
                      {loading ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                  </form>
                )}
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ForgotPassword
