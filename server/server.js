import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import { testConnection } from './config/database.js'
import logger from './utils/logger.js'
import { apiLimiter } from './middleware/rateLimiter.js'

// Import routes
import adminAuthRoutes from './routes/adminAuthPostgresRoutes.js'
import studentAuthRoutes from './routes/studentAuthRoutes.js'
import facultyAuthRoutes from './routes/facultyAuthRoutes.js'
import newsRoutes from './routes/newsRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import facultyPostgresRoutes from './routes/facultyPostgresRoutes.js'
import eventsPostgresRoutes from './routes/eventsPostgresRoutes.js'
import researchPostgresRoutes from './routes/researchPostgresRoutes.js'
import passwordResetRoutes from './routes/passwordResetRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import achievementsRoutes from './routes/achievementsRoutes.js'

// Import new attendance & marks routes
import subjectRoutes from './routes/admin/subjectRoutes.js'
import adminFacultyRoutes from './routes/admin/facultyRoutes.js'
import adminStudentRoutes from './routes/admin/studentRoutes.js'
import facultyAttendanceRoutes from './routes/faculty/attendanceRoutes.js'
import facultyMarksRoutes from './routes/faculty/marksRoutes.js'
import facultyStudentsRoutes from './routes/faculty/studentsRoutes.js'
import studentViewRoutes from './routes/student/viewRoutes.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}))

// CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Apply rate limiting to all routes
app.use(apiLimiter)

// Serve static files from client/public folder (for uploads)
app.use('/uploads', express.static(path.join(__dirname, '../client/public/uploads')))

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.headers['user-agent']
  })
  next()
})

// Database connections
const connectDatabases = async () => {
  // PostgreSQL connection test
  await testConnection()
}

connectDatabases()

// Routes
app.use('/api/admin', adminAuthRoutes)
app.use('/api/student', studentAuthRoutes)
app.use('/api/faculty-auth', facultyAuthRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/upload', uploadRoutes)

// Faculty-specific routes (must come BEFORE facultyPostgresRoutes to avoid route collision)
app.use('/api/faculty', facultyStudentsRoutes)
app.use('/api/faculty', facultyAttendanceRoutes)
app.use('/api/faculty', facultyMarksRoutes)

// Faculty public routes (has /:id param, so must come after specific routes)
app.use('/api/faculty', facultyPostgresRoutes)

app.use('/api/events', eventsPostgresRoutes)
app.use('/api/research', researchPostgresRoutes)
app.use('/api/password-reset', passwordResetRoutes)
app.use('/api/achievements', achievementsRoutes)

// Admin routes
app.use('/api/admin', subjectRoutes)
app.use('/api/admin', adminFacultyRoutes)
app.use('/api/admin', adminStudentRoutes)

// Student routes
app.use('/api/student', studentViewRoutes)

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'PESITM CSE Department API',
    version: '1.0.0',
    status: 'running',
    database: 'PostgreSQL',
    activeEndpoints: {
      admin: '/api/admin',
      student: '/api/student',
      facultyAuth: '/api/faculty-auth',
      faculty: '/api/faculty',
      events: '/api/events',
      research: '/api/research',
      news: '/api/news',
      notifications: '/api/notifications',
      passwordReset: '/api/password-reset'
    }
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  })
  
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// Start server
const PORT = process.env.PORT || 5000
const HOST = '0.0.0.0' // Listen on all network interfaces
app.listen(PORT, HOST, () => {
  logger.info(`🚀 Server running on port ${PORT}`)
  logger.info(`📍 Local API URL: http://localhost:${PORT}`)
  logger.info(`📍 Network API URL: http://[YOUR-IP]:${PORT}`)
  logger.info(`💡 Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app
