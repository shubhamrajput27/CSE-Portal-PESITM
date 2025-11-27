import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { ROLES } from './utils/authUtils'

// Public Pages
import Home from './pages/Home'
import About from './pages/About'
import Faculty from './pages/Faculty'
import Research from './pages/Research'
import Events from './pages/Events'
import Achievements from './pages/Achievements'
import Contact from './pages/Contact'
import Login from './pages/Login'

// Admin Pages
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

// Student Pages
import StudentLogin from './pages/StudentLogin'
import StudentDashboard from './pages/StudentDashboard'

// Faculty Pages
import FacultyLogin from './pages/FacultyLogin'
import FacultyDashboard from './pages/FacultyDashboard'

// Password Reset
import ForgotPassword from './pages/ForgotPassword'

// Profile Pages
import AdminProfile from './pages/AdminProfile'
import FacultyProfile from './pages/FacultyProfile'
import StudentProfile from './pages/StudentProfile'

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/faculty" element={<Faculty />} />
              <Route path="/research" element={<Research />} />
              <Route path="/events" element={<Events />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              
              {/* Password Reset */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute role={ROLES.ADMIN} redirectTo="/admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/profile" 
                element={
                  <ProtectedRoute role={ROLES.ADMIN} redirectTo="/admin">
                    <AdminProfile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Student Routes */}
              <Route path="/student/login" element={<StudentLogin />} />
              <Route 
                path="/student/dashboard" 
                element={
                  <ProtectedRoute role={ROLES.STUDENT} redirectTo="/student/login">
                    <StudentDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student/profile" 
                element={
                  <ProtectedRoute role={ROLES.STUDENT} redirectTo="/student/login">
                    <StudentProfile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Faculty Routes */}
              <Route path="/faculty/login" element={<FacultyLogin />} />
              <Route 
                path="/faculty/dashboard" 
                element={
                  <ProtectedRoute role={ROLES.FACULTY} redirectTo="/faculty/login">
                    <FacultyDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/faculty/profile" 
                element={
                  <ProtectedRoute role={ROLES.FACULTY} redirectTo="/faculty/login">
                    <FacultyProfile />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
