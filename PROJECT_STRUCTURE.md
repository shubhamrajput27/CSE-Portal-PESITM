# Project Structure - CSE Portal Authentication System

## 📁 Complete Folder Structure

```
CSE Portal PESITM/
│
├── client/                          # Frontend React Application
│   ├── src/
│   │   ├── utils/                   # 🔧 Utility Functions
│   │   │   └── authUtils.js         # Authentication helpers & constants
│   │   │
│   │   ├── context/                 # 🌍 Global State Management
│   │   │   └── AuthContext.jsx      # Authentication context provider
│   │   │
│   │   ├── components/              # 🎨 Reusable Components
│   │   │   ├── ProtectedRoute.jsx   # Route protection wrapper
│   │   │   ├── DashboardLayout.jsx  # Dashboard layout component
│   │   │   ├── StatCard.jsx         # Statistics card component
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   ├── Footer.jsx           # Footer component
│   │   │   ├── AnimatedSection.jsx  # Animation wrapper
│   │   │   ├── LoadingSpinner.jsx   # Loading indicator
│   │   │   ├── ScrollToTop.jsx      # Scroll restoration
│   │   │   │
│   │   │   └── [Management Components]/
│   │   │       ├── FacultyManagement.jsx
│   │   │       ├── EventsManagement.jsx
│   │   │       ├── NewsManagement.jsx
│   │   │       ├── NotificationManagement.jsx
│   │   │       ├── ResearchManagement.jsx
│   │   │       └── AchievementsManagement.jsx
│   │   │
│   │   ├── pages/                   # 📄 Page Components
│   │   │   ├── [Public Pages]/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── About.jsx
│   │   │   │   ├── Faculty.jsx
│   │   │   │   ├── Research.jsx
│   │   │   │   ├── Events.jsx
│   │   │   │   ├── Achievements.jsx
│   │   │   │   ├── Contact.jsx
│   │   │   │   └── Login.jsx
│   │   │   │
│   │   │   ├── [Admin Pages]/      # 🔐 Admin Role
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   └── AdminDashboard.jsx
│   │   │   │
│   │   │   ├── [Faculty Pages]/    # 👨‍🏫 Faculty Role
│   │   │   │   ├── FacultyLogin.jsx
│   │   │   │   └── FacultyDashboard.jsx
│   │   │   │
│   │   │   └── [Student Pages]/    # 🎓 Student Role
│   │   │       ├── StudentLogin.jsx
│   │   │       └── StudentDashboard.jsx
│   │   │
│   │   ├── App.jsx                  # Main app component with routes
│   │   ├── main.jsx                 # Application entry point
│   │   └── index.css                # Global styles
│   │
│   ├── public/                      # Static assets
│   ├── index.html                   # HTML template
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js              # Vite configuration
│   └── tailwind.config.js          # TailwindCSS configuration
│
├── server/                          # Backend Node.js Application
│   ├── controllers/                 # 🎮 Route Controllers
│   │   ├── adminAuthPostgresController.js
│   │   ├── facultyAuthController.js
│   │   ├── studentAuthController.js
│   │   ├── facultyPostgresController.js
│   │   ├── eventsPostgresController.js
│   │   ├── newsController.js
│   │   ├── notificationController.js
│   │   └── researchPostgresController.js
│   │
│   ├── models/                      # 📊 Data Models
│   │   ├── AdminUserPostgres.js
│   │   ├── FacultyUser.js
│   │   ├── Student.js
│   │   ├── News.js
│   │   └── Notification.js
│   │
│   ├── routes/                      # 🛣️ API Routes
│   │   ├── adminAuthPostgresRoutes.js
│   │   ├── facultyAuthRoutes.js
│   │   ├── studentAuthRoutes.js
│   │   ├── facultyPostgresRoutes.js
│   │   ├── eventsPostgresRoutes.js
│   │   ├── newsRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── researchPostgresRoutes.js
│   │   └── uploadRoutes.js
│   │
│   ├── middleware/                  # 🛡️ Middleware
│   │   └── adminAuth.js
│   │
│   ├── config/                      # ⚙️ Configuration
│   │   └── database.js
│   │
│   ├── database/                    # 💾 Database
│   │   └── postgresql_schema.sql
│   │
│   ├── scripts/                     # 🔨 Utility Scripts
│   ├── uploads/                     # 📁 File Uploads
│   ├── server.js                    # Server entry point
│   ├── seed.js                      # Database seeding
│   └── package.json                 # Backend dependencies
│
├── AUTH_SYSTEM.md                   # 📖 Full documentation
├── QUICK_REFERENCE.md               # 🚀 Quick reference guide
├── README.md                        # Project readme
└── package.json                     # Root package file
```

## 🎯 Key Directories Explained

### `/client/src/utils/`
**Purpose**: Utility functions and helper methods
- **authUtils.js**: Core authentication functions
  - Token management
  - Session validation
  - Role constants
  - Auth headers generation

### `/client/src/context/`
**Purpose**: Global state management using React Context
- **AuthContext.jsx**: 
  - Provides auth state to entire app
  - Manages login/logout
  - Stores user data for all roles

### `/client/src/components/`
**Purpose**: Reusable UI components
- **ProtectedRoute.jsx**: Guards routes based on role
- **DashboardLayout.jsx**: Consistent dashboard layout
- **StatCard.jsx**: Statistics display card
- **Management Components**: CRUD interfaces for admin

### `/client/src/pages/`
**Purpose**: Full page components
- **Public Pages**: Accessible to everyone
- **Admin Pages**: Admin-only access
- **Faculty Pages**: Faculty-only access
- **Student Pages**: Student-only access

### `/server/controllers/`
**Purpose**: Business logic for API endpoints
- Handle authentication
- Process requests
- Return responses

### `/server/routes/`
**Purpose**: API endpoint definitions
- Define URL paths
- Map to controllers
- Apply middleware

### `/server/middleware/`
**Purpose**: Request processing middleware
- Authentication verification
- Role validation
- Error handling

## 🔐 Authentication Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. User enters credentials
       ↓
┌─────────────┐
│ Login Page  │ (AdminLogin/FacultyLogin/StudentLogin)
└──────┬──────┘
       │ 2. Submit form
       ↓
┌─────────────┐
│  API Call   │ → POST /api/[role]/login
└──────┬──────┘
       │ 3. Authenticate
       ↓
┌─────────────┐
│   Backend   │ → Verify credentials, generate JWT
└──────┬──────┘
       │ 4. Return token + user data
       ↓
┌─────────────┐
│AuthContext  │ → Store in localStorage + context
└──────┬──────┘
       │ 5. Redirect to dashboard
       ↓
┌─────────────┐
│Protected    │ → Verify authentication
│   Route     │
└──────┬──────┘
       │ 6. Allow access
       ↓
┌─────────────┐
│  Dashboard  │ → Display user-specific content
└─────────────┘
```

## 🚦 Route Protection Flow

```
User requests /admin/dashboard
        ↓
Is user authenticated? (Check localStorage)
        ↓
   ┌────┴────┐
   NO       YES
   │         │
   ↓         ↓
Redirect  Allow Access
to login  to Dashboard
```

## 📦 Module Dependencies

### Frontend Core
- **React** - UI library
- **React Router** - Routing
- **Framer Motion** - Animations
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client

### Backend Core
- **Express** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin requests

## 🎨 Component Hierarchy

```
App
├── AuthProvider (Context)
│   ├── Navbar
│   ├── Routes
│   │   ├── Public Routes
│   │   │   ├── Home
│   │   │   ├── About
│   │   │   ├── Faculty
│   │   │   └── ...
│   │   │
│   │   └── Protected Routes
│   │       ├── ProtectedRoute (Admin)
│   │       │   └── AdminDashboard
│   │       │       ├── DashboardLayout
│   │       │       ├── StatCard
│   │       │       └── Management Components
│   │       │
│   │       ├── ProtectedRoute (Faculty)
│   │       │   └── FacultyDashboard
│   │       │       └── DashboardLayout
│   │       │
│   │       └── ProtectedRoute (Student)
│   │           └── StudentDashboard
│   │               └── DashboardLayout
│   │
│   └── Footer
```

## 💾 Data Storage

### LocalStorage Structure
```javascript
// Admin
localStorage.adminToken = "eyJhbGciOiJIUzI1NiIs..."
localStorage.adminUser = '{"id":1,"full_name":"Admin","role":"admin"}'

// Faculty
localStorage.facultyToken = "eyJhbGciOiJIUzI1NiIs..."
localStorage.facultyData = '{"id":1,"full_name":"Dr. John","role":"faculty"}'

// Student
localStorage.studentToken = "eyJhbGciOiJIUzI1NiIs..."
localStorage.studentData = '{"id":1,"full_name":"Jane Doe","role":"student"}'
```

## 🔄 State Management

```
AuthContext (Global State)
├── adminUser (object | null)
├── facultyUser (object | null)
├── studentUser (object | null)
├── loading (boolean)
└── methods
    ├── login(role, token, user)
    ├── logout(role)
    └── hasRole(role)
```

---

**Structure Version**: 1.0.0  
**Last Updated**: November 27, 2025
