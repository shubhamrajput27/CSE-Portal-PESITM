# Faculty-Student Attendance & Marks Management System

## 📋 Overview

This document describes the comprehensive **Attendance and Marks Management System** implemented for the CSE Department Portal at PES ITM. The system allows faculty to manage student attendance and marks, while students can view their academic performance.

---

## 🎯 Core Features

### Faculty Features
1. **Attendance Management**
   - Select Semester, Section (A/B), Subject, and Period
   - Mark attendance for multiple students in bulk
   - Update existing attendance records
   - View attendance statistics

2. **Marks Management**
   - Enter marks for various assessment types (Internal Tests, Assignments, Quizzes, Practicals)
   - Bulk marks entry for entire class
   - Update existing marks
   - View class performance analytics

### Student Features
1. **Attendance View**
   - Subject-wise attendance percentage
   - Total classes vs attended classes
   - Graphical visualization
   - Date range filtering

2. **Marks View**
   - Subject-wise marks with assessment breakup
   - Performance graphs
   - Grade calculation
   - Overall percentage display

---

## 🗄️ Database Schema

### 1. Students Table
```sql
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    usn VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    semester INTEGER,
    section VARCHAR(10) DEFAULT 'A',  -- Added for section management
    department VARCHAR(50) DEFAULT 'CSE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Subjects Table
```sql
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    subject_name VARCHAR(200) NOT NULL,
    semester INTEGER NOT NULL,
    credits INTEGER DEFAULT 4,
    department VARCHAR(100) DEFAULT 'CSE',
    is_lab BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);
```

### 3. Attendance Table
```sql
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    faculty_id INTEGER REFERENCES faculty_users(id) ON DELETE SET NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'on_leave', 'late')),
    period_number INTEGER,
    section VARCHAR(10),  -- Student's section
    academic_year VARCHAR(20) NOT NULL,
    semester INTEGER NOT NULL,
    remarks TEXT,
    marked_by INTEGER REFERENCES faculty_users(id),
    marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, subject_id, attendance_date, period_number)
);
```

### 4. Marks Table
```sql
CREATE TABLE marks (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    exam_type VARCHAR(50) NOT NULL CHECK (exam_type IN 
        ('internal_1', 'internal_2', 'internal_3', 'assignment', 'quiz', 'practical', 'seminar')),
    marks_obtained DECIMAL(5,2) NOT NULL,
    max_marks DECIMAL(5,2) NOT NULL,
    section VARCHAR(10),  -- Student's section
    academic_year VARCHAR(20) NOT NULL,
    semester INTEGER NOT NULL,
    exam_date DATE,
    faculty_id INTEGER REFERENCES faculty_users(id),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, subject_id, exam_type, academic_year, semester)
);
```

---

## 🔌 Backend API Endpoints

### Faculty APIs

#### Attendance Endpoints
```
POST   /api/faculty/attendance/bulk    - Mark bulk attendance
GET    /api/faculty/attendance/subject  - Get attendance for subject/date
GET    /api/faculty/attendance/student/:student_id  - Get student attendance
PUT    /api/faculty/attendance/:id      - Update attendance record
```

**Example: Mark Bulk Attendance**
```javascript
POST /api/faculty/attendance/bulk
Headers: { Authorization: "Bearer <faculty_token>" }
Body: {
  "subject_id": 5,
  "date": "2026-01-30",
  "period": 3,
  "attendance_records": [
    { "student_id": 1, "status": "present" },
    { "student_id": 2, "status": "absent" },
    { "student_id": 3, "status": "present" }
  ]
}
```

#### Marks Endpoints
```
POST   /api/faculty/marks/bulk          - Add bulk marks
GET    /api/faculty/marks/student/:student_id  - Get student marks
PUT    /api/faculty/marks/:id           - Update marks
DELETE /api/faculty/marks/:id           - Delete marks
```

**Example: Add Bulk Marks**
```javascript
POST /api/faculty/marks/bulk
Headers: { Authorization: "Bearer <faculty_token>" }
Body: {
  "subject_id": 5,
  "exam_type": "internal_1",
  "max_marks": 50,
  "marks_records": [
    { "student_id": 1, "marks_obtained": 45 },
    { "student_id": 2, "marks_obtained": 38 },
    { "student_id": 3, "marks_obtained": 42 }
  ]
}
```

#### Student & Subject Endpoints
```
GET    /api/faculty/students            - Get all students
GET    /api/faculty/students/by-subject/:subject_id  - Get students by subject
GET    /api/faculty/subjects            - Get assigned subjects
```

### Student APIs

#### View Endpoints
```
GET    /api/student/attendance/summary  - Get attendance summary
GET    /api/student/marks/summary       - Get marks summary
GET    /api/student/dashboard           - Get combined dashboard data
```

**Example: Get Attendance Summary**
```javascript
GET /api/student/attendance/summary?start_date=2025-01-01&end_date=2026-01-30
Headers: { Authorization: "Bearer <student_token>" }

Response: {
  "success": true,
  "data": [
    {
      "subject_id": 5,
      "subject_code": "CS301",
      "subject_name": "Data Structures",
      "total_classes": 45,
      "present_count": 40,
      "absent_count": 5,
      "attendance_percentage": 88.89
    }
  ]
}
```

---

## 🎨 Frontend Components

### Faculty Components

#### 1. AttendanceMarking Component
**Location:** `client/src/components/AttendanceMarking.jsx`

**Features:**
- Subject selection dropdown
- Date picker for attendance date
- Period/Lecture number selection
- Student list with attendance status toggles
- Bulk operations (Mark All Present/Absent)
- Submit & Update functionality

**Usage:**
```jsx
import AttendanceMarking from '../components/AttendanceMarking';

<AttendanceMarking onBack={() => setView('dashboard')} />
```

#### 2. MarksEntry Component
**Location:** `client/src/components/MarksEntry.jsx`

**Features:**
- Subject selection
- Exam type selection (Internal 1/2/3, Assignment, Quiz, Practical, Seminar)
- Max marks input
- Student-wise marks entry
- Validation (marks ≤ max marks)
- Bulk submit functionality

**Usage:**
```jsx
import MarksEntry from '../components/MarksEntry';

<MarksEntry onBack={() => setView('dashboard')} />
```

### Student Components

#### 1. StudentAttendanceView Component
**Location:** `client/src/components/StudentAttendanceView.jsx`

**Features:**
- Overall attendance percentage display
- Subject-wise attendance breakdown
- Interactive line chart visualization
- Date range filtering
- Detailed statistics (Classes Attended, Classes Missed)

**Usage:**
```jsx
import StudentAttendanceView from '../components/StudentAttendanceView';

<StudentAttendanceView onBack={() => setView('dashboard')} />
```

#### 2. StudentMarksView Component
**Location:** `client/src/components/StudentMarksView.jsx`

**Features:**
- Overall percentage and grade display
- Subject-wise performance breakdown
- Interactive bar chart
- Assessment-wise marks display
- Grade calculation and color coding

**Usage:**
```jsx
import StudentMarksView from '../components/StudentMarksView';

<StudentMarksView onBack={() => setView('dashboard')} />
```

---

## 🔐 Security & Authentication

### Role-Based Access Control

**Faculty Middleware** (`server/middleware/facultyAuth.js`)
- Validates JWT token from `Authorization` header
- Extracts faculty details from token
- Attaches `req.user` with faculty information
- Blocks unauthorized access

**Student Middleware** (`server/middleware/studentAuth.js`)
- Validates JWT token from `Authorization` header
- Extracts student details from token
- Attaches `req.user` with student information
- Ensures students access only their own data

### Data Isolation
- Students can ONLY view their own attendance and marks
- Faculty can view/edit data for students in their assigned subjects
- All queries filter by `student_id` from authenticated token

---

## 🚀 How to Use the System

### For Faculty:

1. **Login** to faculty dashboard
2. **Navigate** to "Mark Attendance" or "Enter Marks"
3. **Select** Subject, Section, Date, Period (for attendance)
4. **Mark/Enter** data for all students
5. **Submit** - data is saved to database
6. Students can immediately view updated data

### For Students:

1. **Login** to student dashboard
2. **Click** "View Attendance" or "View Marks"
3. **View** subject-wise breakdown with charts
4. **Filter** by date range (for attendance)
5. All data is real-time from database

---

## 📊 Data Flow

```
Faculty Login → JWT Token → Select Subject/Section → Fetch Students
→ Enter Attendance/Marks → Submit to API → Save to PostgreSQL
→ Student Login → JWT Token → Fetch My Data → Display in Charts
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Tailwind CSS, Chart.js, React Router |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **Authentication** | JWT (JSON Web Tokens) |
| **Validation** | Express Validator |
| **Charts** | Chart.js + React-Chartjs-2 |

---

## 📝 Best Practices Implemented

1. ✅ **Parameterized Queries** - SQL injection prevention
2. ✅ **JWT Authentication** - Secure token-based auth
3. ✅ **Role-Based Access** - Faculty/Student separation
4. ✅ **Input Validation** - Server-side validation
5. ✅ **Error Handling** - Proper error messages
6. ✅ **Responsive Design** - Mobile-friendly UI
7. ✅ **Data Integrity** - UNIQUE constraints prevent duplicates
8. ✅ **Audit Trail** - created_at, updated_at, marked_by fields

---

## 🧪 Testing the System

### Test Scenario 1: Faculty Marks Attendance
1. Login as faculty
2. Go to "Mark Attendance"
3. Select subject, date, period
4. Mark some students present, some absent
5. Click Submit
6. ✅ Verify success message

### Test Scenario 2: Student Views Attendance
1. Login as student (whose attendance was marked)
2. Go to "View Attendance"
3. ✅ Verify attendance percentage shows correctly
4. ✅ Verify subject-wise breakdown is accurate

### Test Scenario 3: Faculty Enters Marks
1. Login as faculty
2. Go to "Enter Marks"
3. Select subject, exam type (e.g., Internal 1)
4. Enter marks for all students
5. Click Submit
6. ✅ Verify success message

### Test Scenario 4: Student Views Marks
1. Login as same student
2. Go to "View Marks"
3. ✅ Verify marks appear correctly
4. ✅ Verify percentage calculation is correct

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch students"
**Solution:** Ensure faculty has subjects assigned in `faculty_subjects` table

### Issue: "Attendance not showing for student"
**Solution:** Verify `student_id` matches between attendance and students tables

### Issue: "Cannot mark duplicate attendance"
**Solution:** This is expected! UNIQUE constraint prevents duplicates. Use UPDATE instead.

### Issue: "Invalid token" error
**Solution:** Re-login to get fresh JWT token

---

## 🔄 Future Enhancements

- [ ] CSV import/export for attendance and marks
- [ ] Email notifications for low attendance
- [ ] Parent portal integration
- [ ] Mobile app (React Native)
- [ ] Biometric attendance integration
- [ ] Advanced analytics and reports
- [ ] Attendance defaulters list auto-generation
- [ ] Integration with exam management system

---

## 📞 Support

For any issues or questions, contact:
- **Developer:** CSE Department Dev Team
- **Email:** cse@pesitm.edu.in
- **GitHub:** PES ITM CSE Portal Repository

---

## 📄 License

This system is proprietary to PES Institute of Technology & Management, Shivamogga.
All rights reserved © 2026 PESITM CSE Department.

---

**Last Updated:** January 30, 2026
**Version:** 1.0.0
**Status:** ✅ Production Ready
