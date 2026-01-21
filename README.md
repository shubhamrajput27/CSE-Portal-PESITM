# CSE Portal - PESITM Shivamogga 🎓

A comprehensive web portal for the Computer Science & Engineering Department at PES Institute of Technology and Management, Shivamogga. This modern full-stack application streamlines academic management and keeps students, faculty, and administrators connected with real-time access to academic information, attendance tracking, marks management, and department updates.

## What's Inside? ✨

This portal provides a complete academic management solution:

- **Secure Login System** - Role-based authentication for admins, faculty, and students with JWT tokens
- **Attendance Management** - Real-time attendance marking by faculty with section-wise filtering (Section A & B)
- **Marks Management** - Comprehensive marks entry and tracking for internals, assignments, and practicals
- **Section-Based Organization** - Students divided into Section A (1-64) and Section B (65-133) for better management
- **Faculty-Subject Assignment** - Dynamic subject allocation with academic year and section tracking
- **Mentor-Mentee System** - Faculty-student mentorship program for personalized guidance
- **News & Events** - Department announcements, upcoming events, and achievement showcases
- **Faculty Profiles** - Complete faculty directory with qualifications, research interests, and contact details
- **Research Publications** - Repository of department research papers and projects
- **Study Materials** - Centralized access to notes, assignments, and learning resources
- **Notifications System** - Real-time alerts for important updates and deadlines
- **Responsive Design** - Optimized for mobile, tablet, and desktop devices

## Technology Stack 🛠️

**Frontend:**
- React 18 with Vite - Lightning-fast development and optimized builds
- Tailwind CSS - Modern utility-first styling framework
- React Router v6 - Client-side routing and navigation
- Lucide React - Beautiful, consistent icon library
- Axios - HTTP client for API communication
- React Context API - Global state management

**Backend:**
- Node.js 18+ - JavaScript runtime environment
- Express.js 4 - Fast, minimalist web framework
- PostgreSQL 12+ - Robust relational database
- JWT (jsonwebtoken) - Secure token-based authentication
- bcrypt - Password hashing and encryption
- Multer - File upload handling
- Winston - Structured logging system
- Helmet - Security headers middleware
- express-validator - Input validation and sanitization
- express-rate-limit - API rate limiting protection
- CORS - Cross-origin resource sharing

**Database Schema:**
- Students, Faculty, and Admin user tables
- Subjects with semester and credit management
- Attendance tracking with section support
- Marks management for all exam types
- Faculty-subject assignments
- Mentor-mentee relationships
- Study materials and resources
- News, events, and notifications
- Activity logs for audit trail

## Quick Start Guide 🚀

### Prerequisites

Ensure these are installed on your system:
- Node.js (v18.0.0 or higher)
- PostgreSQL (v12.0 or higher)
- npm (v9.0.0 or higher)
- Git

### Installation Steps

1. **Clone the repository:**
```bash
git clone https://github.com/shubhamrajput27/CSE-Portal-PESITM.git
cd "CSE Portal PESITM"
```

2. **Set up the database:**

Create a PostgreSQL database:
```sql
CREATE DATABASE pesitm_cse_portal;
```

3. **Configure the backend:**
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pesitm_cse_portal
DB_USER=postgres
DB_PASSWORD=your_postgresql_password

# Server Configuration
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your_super_secure_random_string_here_min_32_chars
JWT_EXPIRES_IN=7d

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

4. **Initialize the database schema:**
```bash
# Create all tables and initial data
node scripts/initPostgres.js

# Set up enhanced schema (subjects, attendance, marks)
node scripts/setupEnhancedSchema.js

# Create sample subjects and assignments
node scripts/seedSubjectsAndAssignments.js

# Set up student sections (A & B)
node scripts/setupSections.js
```

5. **Configure the frontend:**
```bash
cd ../client
npm install
```

Create a `.env` file in the `client` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

**Option 1: Run both servers simultaneously (Recommended)**
```bash
# From the root directory
npm install
npm run dev
```

**Option 2: Run servers separately**

Terminal 1 - Backend:
```bash
cd server
npm run dev  # Uses nodemon for auto-restart
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Network Access:** http://[your-ip]:3000

## Default Login Credentials 🔑

After running the initialization scripts, use these credentials to access different portals:

**Admin Portal:**
- Username: `admin`
- Password: `admin123`
- Dashboard: Manage faculty, students, events, and system settings

**Faculty Portal:**
- Email: `prasannakumar.hr@pestrust.edu.in`
- Password: `faculty123`
- Alternative IDs: `FAC001`, `FAC002`, `FAC003`, etc.
- Dashboard: Mark attendance, enter marks, view assigned subjects

**Student Portal:**
- USN: `4PM23CS001` (or any from 001-126)
- Password: `student123`
- Alternative IDs: `2023CSE23CS001`, etc.
- Dashboard: View attendance, check marks, access study materials

> **⚠️ Security Warning:** Change all default passwords immediately after first login in production environments!

## Features by Role 👥

### Admin Dashboard 🔐
- **User Management:** Create and manage faculty and student accounts
- **Content Management:** Publish news, events, and announcements
- **Faculty Oversight:** Add/edit faculty profiles, qualifications, and assignments
- **Research Management:** Upload and categorize research publications
- **Analytics:** View system-wide statistics and activity logs
- **Settings:** Configure academic years, semesters, and system preferences
- **Bulk Operations:** Import/export student and faculty data

### Faculty Dashboard 👨‍🏫
- **Subject Management:** View assigned subjects with section details
- **Attendance System:**
  - Mark attendance for individual students or bulk
  - Filter by section (A or B) for easier management
  - View attendance statistics and low-attendance alerts
  - Generate attendance reports by date range
- **Marks Entry:**
  - Enter marks for internals, assignments, quizzes, and practicals
  - Support for multiple exam types (Internal 1, 2, 3, etc.)
  - Automatic section assignment based on student records
  - View class performance statistics
- **Student Management:**
  - View complete student list for assigned subjects
  - Access mentee information (if assigned as mentor)
  - Track individual student progress
- **Resources:** Upload study materials, notes, and assignments
- **Profile:** Update personal information and contact details

### Student Dashboard 🎓
- **Attendance Tracking:**
  - View subject-wise attendance with percentage
  - Real-time updates as faculty marks attendance
  - Filter by semester and date range
  - Low attendance alerts
- **Academic Performance:**
  - View marks for all exam types
  - Subject-wise performance analysis
  - Overall CGPA/SGPA calculations
- **Study Resources:**
  - Access lecture notes and study materials
  - Download assignments and question papers
  - View submission deadlines
- **Department Updates:**
  - Latest news and announcements
  - Upcoming events and workshops
  - Placement opportunities
  - Research opportunities
- **Profile Management:** Update contact information and view academic details

## Section System 📚

The portal implements a section-based student organization system:

**Section A:** Students with IDs 1-64 (74 students)
- USN Range: 4PM23CS001 to 4PM23CS064
- Plus lateral entry students (400-411 series)

**Section B:** Students with IDs 65-133 (59 students)
- USN Range: 4PM23CS065 to 4PM23CS126

**Benefits:**
- Faculty can mark attendance for specific sections
- Better classroom management and tracking
- Section-wise performance analytics
- Separate reports for each section
- Automatic section assignment based on student ID

**Database Scripts:**
```bash
# Set up sections
node server/scripts/setupSections.js

# Update section assignments
node server/scripts/updateSectionsByStudentId.js

# Verify sections
node server/scripts/verifySections.js
```

## Project Structure 📁

```
CSE Portal PESITM/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── AdminNavbar.jsx
│   │   │   ├── FacultyNavbar.jsx
│   │   │   ├── AttendanceMarking.jsx
│   │   │   ├── MarksEntry.jsx
│   │   │   └── ... (more components)
│   │   ├── pages/                  # Page components
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── FacultyLogin.jsx
│   │   │   ├── StudentLogin.jsx
│   │   │   └── ... (more pages)
│   │   ├── context/                # React Context for state
│   │   ├── config/                 # Configuration files
│   │   ├── utils/                  # Helper functions
│   │   └── App.jsx                 # Main app component
│   ├── public/                     # Static assets
│   └── package.json
│
├── server/                          # Backend Node.js application
│   ├── controllers/                # Request handlers
│   │   ├── admin/                 # Admin controllers
│   │   ├── faculty/               # Faculty controllers
│   │   └── student/               # Student controllers
│   ├── models/                     # Database models
│   │   ├── Attendance.js
│   │   ├── Marks.js
│   │   ├── Student.js
│   │   └── ... (more models)
│   ├── routes/                     # API route definitions
│   │   ├── admin/
│   │   ├── faculty/
│   │   └── student/
│   ├── middleware/                 # Custom middleware
│   ├── scripts/                    # Database & utility scripts
│   ├── database/                   # Database schemas
│   ├── config/                     # Configuration
│   ├── server.js                   # Main server file
│   └── package.json
│
├── package.json                     # Root package.json
└── README.md                        # This file
```

## API Endpoints 🌐

### Authentication Endpoints
```
POST   /api/admin-auth/login         # Admin login
POST   /api/faculty-auth/login       # Faculty login
POST   /api/student-auth/login       # Student login
POST   /api/admin-auth/logout        # Admin logout
POST   /api/faculty-auth/logout      # Faculty logout
POST   /api/student-auth/logout      # Student logout
```

### Faculty Endpoints
```
GET    /api/faculty/profile          # Get faculty profile
GET    /api/faculty/subjects         # Get assigned subjects
GET    /api/faculty/students/by-subject/:subjectId  # Get students for subject
POST   /api/faculty/attendance/mark  # Mark attendance
POST   /api/faculty/attendance/bulk  # Bulk attendance marking
GET    /api/faculty/attendance/subject  # Get attendance by subject
POST   /api/faculty/marks            # Add marks
GET    /api/faculty/marks            # Get marks
```

### Student Endpoints
```
GET    /api/student/profile          # Get student profile
GET    /api/student/attendance       # Get attendance records
GET    /api/student/marks            # Get marks
GET    /api/student/subjects         # Get enrolled subjects
```

### Admin Endpoints
```
GET    /api/admin/students           # Get all students
POST   /api/admin/students           # Create student
GET    /api/admin/faculty            # Get all faculty
POST   /api/admin/faculty            # Create faculty
GET    /api/admin/statistics         # System statistics
```

### Public Endpoints
```
GET    /api/events                   # Get department events
GET    /api/news                     # Get news articles
GET    /api/notifications            # Get notifications
```

## Common Issues & Solutions 🔧

**Database Connection Failed:**
```bash
# Check PostgreSQL is running
sudo service postgresql status  # Linux
# Or check Windows Services

# Verify credentials in server/.env
# Test connection
psql -U postgres -d pesitm_cse_portal
```

**Port Already in Use:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000     # Windows
lsof -i :5000                    # Linux/Mac

# Kill the process or change PORT in .env
```

**Module Not Found Errors:**
```bash
# Reinstall dependencies
cd server && npm install
cd ../client && npm install

# Clear npm cache if needed
npm cache clean --force
```

**JWT Authentication Errors:**
- Ensure JWT_SECRET is set in server/.env (minimum 32 characters)
- Check token expiry settings
- Clear browser localStorage and login again

**Database Schema Issues:**
```bash
# Drop and recreate database
psql -U postgres
DROP DATABASE pesitm_cse_portal;
CREATE DATABASE pesitm_cse_portal;
\q

# Re-run initialization scripts
node server/scripts/initPostgres.js
node server/scripts/setupEnhancedSchema.js
```

**CORS Errors:**
- Verify VITE_API_URL in client/.env matches backend URL
- Check CORS configuration in server/server.js
- Ensure both servers are running

**File Upload Issues:**
- Check `server/uploads` directory exists and has write permissions
- Verify multer configuration in uploadRoutes.js
- Check file size limits in multer settings

## Database Scripts 📜

The project includes several utility scripts for database management:

```bash
# Initial Setup
node server/scripts/initPostgres.js              # Create basic schema
node server/scripts/setupEnhancedSchema.js       # Add all tables
node server/scripts/seedSubjectsAndAssignments.js # Add sample data

# Section Management
node server/scripts/setupSections.js             # Initialize sections A & B
node server/scripts/updateSectionsByStudentId.js # Reassign students to sections
node server/scripts/verifySections.js            # Verify section setup

# Maintenance
node server/scripts/checkAndCreateTables.js      # Verify table existence
node server/scripts/checkStudentsTable.js        # Inspect students table
node server/scripts/addMissingColumns.js         # Add missing columns
node server/scripts/updateAcademicYear.js        # Update academic year
node server/scripts/viewAssignmentReport.js      # View faculty assignments
```

## Security Best Practices 🔒

**Development:**
- Never commit `.env` files to version control
- Use `.gitignore` to exclude sensitive files
- Keep dependencies updated with `npm audit fix`
- Use strong, random JWT_SECRET (min 32 characters)

**Production:**
- Change all default passwords immediately
- Use HTTPS for all communications
- Enable rate limiting on API endpoints
- Implement proper input validation
- Set up database backups (daily recommended)
- Use environment-specific configurations
- Enable helmet middleware for security headers
- Implement CSRF protection
- Set secure cookie flags (httpOnly, secure)
- Regular security audits and updates

**Password Policy:**
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers
- Passwords hashed with bcrypt (12 rounds)
- Account lockout after 5 failed attempts
- 30-minute lockout duration

## Production Deployment 🚀

**Recommended Stack:**
- **Frontend:** Vercel, Netlify, or AWS S3 + CloudFront
- **Backend:** Heroku, AWS EC2, DigitalOcean, or Railway
- **Database:** AWS RDS PostgreSQL, Heroku Postgres, or Supabase

**Environment Variables (Production):**
```env
NODE_ENV=production
DB_SSL=true
CORS_ORIGIN=https://your-frontend-domain.com
JWT_SECRET=your-production-secret-key-64-chars-minimum
```

**Build Commands:**
```bash
# Frontend
cd client
npm run build

# Backend (if needed)
cd server
npm run build
```

## Contributing 🤝

We welcome contributions from the community! Here's how you can help:

**Getting Started:**
1. Fork the repository on GitHub
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/CSE-Portal-PESITM.git`
3. Create a feature branch: `git checkout -b feature/AmazingFeature`
4. Set up your development environment (see Quick Start Guide)

**Development Guidelines:**
- Follow existing code style and conventions
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

**Making Changes:**
1. Make your changes in your feature branch
2. Test locally with both frontend and backend
3. Commit with descriptive messages: `git commit -m 'Add section-wise report generation'`
4. Push to your fork: `git push origin feature/AmazingFeature`
5. Open a Pull Request with clear description

**Pull Request Checklist:**
- [ ] Code follows project style guidelines
- [ ] All tests pass locally
- [ ] New features include appropriate tests
- [ ] Documentation updated (if applicable)
- [ ] No breaking changes (or clearly documented)
- [ ] Commit messages are clear and descriptive

**Areas for Contribution:**
- Bug fixes and performance improvements
- New features and enhancements
- Documentation improvements
- UI/UX improvements
- Test coverage
- Code refactoring
- Accessibility improvements

## Testing 🧪

```bash
# Run frontend tests (when available)
cd client
npm test

# Run backend tests (when available)
cd server
npm test

# Run linting
npm run lint
```

## Current Statistics 📊

**System Overview:**
- Total Students: 133 (Section A: 74, Section B: 59)
- Total Faculty: 8+
- Subjects: Multiple across 8 semesters
- Attendance Records: 1,064+
- Active Features: 15+

## Future Roadmap 🗺️

**Planned Features:**
- [ ] Mobile app (React Native)
- [ ] Real-time notifications (WebSocket)
- [ ] Student forum and discussion boards
- [ ] Online assignment submission
- [ ] Video lecture integration
- [ ] Parent portal for progress tracking
- [ ] Automated timetable generation
- [ ] Library management system
- [ ] Hostel management module
- [ ] Fee payment integration
- [ ] Alumni portal
- [ ] Placement cell module
- [ ] Advanced analytics dashboard
- [ ] Email/SMS notifications
- [ ] Two-factor authentication

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- **PESITM Administration** for supporting this project
- **CSE Faculty** for their valuable feedback and testing
- **Students** who participated in beta testing
- **Open Source Community** for the amazing tools and libraries

## Support & Contact 📬

**CSE Department, PESITM Shivamogga**
- 📧 Email: cse@pestrust.edu.in
- 📞 Phone: +91-8182-235555
- 🌐 Website: https://pestrust.edu.in/pesitm/
- 📍 Address: NH-206, Sagar Road, Shivamogga, Karnataka 577204

**Technical Support:**
- For bugs and issues: Open an issue on GitHub
- For feature requests: Submit via GitHub Issues
- For general queries: Contact the CSE Department

**Developer:**
- GitHub: [@shubhamrajput27](https://github.com/shubhamrajput27)
- Repository: [CSE-Portal-PESITM](https://github.com/shubhamrajput27/CSE-Portal-PESITM)

## Version History 📝

**v1.0.0** (Current)
- Initial release with complete portal functionality
- Section-based student organization (A & B)
- Attendance and marks management
- Faculty-subject assignments
- Admin, faculty, and student dashboards
- News, events, and notifications system

---

**Built with ❤️ by the PESITM CSE Community**

*Empowering education through technology* 🚀

---

## Quick Links 🔗

- [Report a Bug](https://github.com/shubhamrajput27/CSE-Portal-PESITM/issues/new?labels=bug)
- [Request a Feature](https://github.com/shubhamrajput27/CSE-Portal-PESITM/issues/new?labels=enhancement)
- [View Documentation](https://github.com/shubhamrajput27/CSE-Portal-PESITM/wiki)
- [PESITM Official Website](https://pestrust.edu.in/pesitm/)

---

**Star ⭐ this repository if you find it helpful!**
