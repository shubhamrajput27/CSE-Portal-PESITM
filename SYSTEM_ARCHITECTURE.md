# System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PES ITM CSE PORTAL                                  │
│                   Faculty-Student Attendance & Marks System                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER                                 │
│                         (React + Tailwind CSS)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────┐              ┌──────────────────────┐           │
│  │   FACULTY DASHBOARD  │              │  STUDENT DASHBOARD   │           │
│  ├──────────────────────┤              ├──────────────────────┤           │
│  │                      │              │                      │           │
│  │  [Mark Attendance]   │              │  [View Attendance]   │           │
│  │  ┌──────────────┐    │              │  ┌──────────────┐    │           │
│  │  │ - Select     │    │              │  │ - Subject    │    │           │
│  │  │   Subject    │    │              │  │   Wise %     │    │           │
│  │  │ - Select     │    │              │  │ - Charts     │    │           │
│  │  │   Section    │    │              │  │ - Date       │    │           │
│  │  │ - Select     │    │              │  │   Filter     │    │           │
│  │  │   Period     │    │              │  └──────────────┘    │           │
│  │  │ - Mark       │    │              │                      │           │
│  │  │   Students   │    │              │  [View Marks]        │           │
│  │  └──────────────┘    │              │  ┌──────────────┐    │           │
│  │                      │              │  │ - Subject    │    │           │
│  │  [Enter Marks]       │              │  │   Wise       │    │           │
│  │  ┌──────────────┐    │              │  │ - Grades     │    │           │
│  │  │ - Select     │    │              │  │ - Charts     │    │           │
│  │  │   Subject    │    │              │  │ - Overall %  │    │           │
│  │  │ - Exam Type  │    │              │  └──────────────┘    │           │
│  │  │ - Enter      │    │              │                      │           │
│  │  │   Marks      │    │              └──────────────────────┘           │
│  │  └──────────────┘    │                                                 │
│  │                      │                                                 │
│  └──────────────────────┘                                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/HTTPS (JWT Auth)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             MIDDLEWARE LAYER                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐         ┌──────────────────┐                        │
│  │  facultyAuth.js  │         │  studentAuth.js  │                        │
│  ├──────────────────┤         ├──────────────────┤                        │
│  │ - Verify JWT     │         │ - Verify JWT     │                        │
│  │ - Extract        │         │ - Extract        │                        │
│  │   Faculty ID     │         │   Student ID     │                        │
│  │ - Set req.user   │         │ - Set req.user   │                        │
│  └──────────────────┘         └──────────────────┘                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND LAYER                                  │
│                         (Node.js + Express.js)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────┐      │
│  │                        ROUTES                                    │      │
│  ├─────────────────────────────────────────────────────────────────┤      │
│  │                                                                  │      │
│  │  FACULTY ROUTES (/api/faculty/*)                                │      │
│  │  ┌────────────────────────┬────────────────────────┐            │      │
│  │  │ Attendance Routes      │  Marks Routes          │            │      │
│  │  ├────────────────────────┼────────────────────────┤            │      │
│  │  │ POST /attendance/bulk  │ POST /marks/bulk       │            │      │
│  │  │ GET  /attendance/...   │ GET  /marks/...        │            │      │
│  │  │ PUT  /attendance/:id   │ PUT  /marks/:id        │            │      │
│  │  └────────────────────────┴────────────────────────┘            │      │
│  │                                                                  │      │
│  │  STUDENT ROUTES (/api/student/*)                                │      │
│  │  ┌──────────────────────────────────────────────┐               │      │
│  │  │ GET /attendance/summary                      │               │      │
│  │  │ GET /marks/summary                           │               │      │
│  │  │ GET /dashboard                               │               │      │
│  │  └──────────────────────────────────────────────┘               │      │
│  │                                                                  │      │
│  └─────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────┐      │
│  │                      CONTROLLERS                                 │      │
│  ├─────────────────────────────────────────────────────────────────┤      │
│  │                                                                  │      │
│  │  attendanceController.js     │  marksController.js              │      │
│  │  ├─────────────────────────  │  ├─────────────────────────      │      │
│  │  │ - markAttendance()        │  │ - addMarks()                  │      │
│  │  │ - markBulkAttendance()    │  │ - addBulkMarks()              │      │
│  │  │ - getSubjectAttendance()  │  │ - getStudentMarks()           │      │
│  │  │ - updateAttendance()      │  │ - updateMarks()               │      │
│  │  └───────────────────────────┘  └───────────────────────────────┘      │
│  │                                                                  │      │
│  │  viewController.js (Student)                                     │      │
│  │  ├────────────────────────────────────────                       │      │
│  │  │ - getMyAttendance()                                           │      │
│  │  │ - getMyAttendanceSummary()                                    │      │
│  │  │ - getMyMarks()                                                │      │
│  │  │ - getMyMarksSummary()                                         │      │
│  │  └────────────────────────────────────────────────────────────  │      │
│  │                                                                  │      │
│  └─────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────┐      │
│  │                         MODELS                                   │      │
│  ├─────────────────────────────────────────────────────────────────┤      │
│  │                                                                  │      │
│  │  Attendance.js              │  Marks.js                          │      │
│  │  ├────────────────────────  │  ├───────────────────────────     │      │
│  │  │ - markAttendance()       │  │ - addMarks()                   │      │
│  │  │ - markBulkAttendance()   │  │ - addBulkMarks()               │      │
│  │  │ - getStudentAttendance() │  │ - getStudentMarks()            │      │
│  │  │ - getStudentAttend...    │  │ - getStudentMarks...           │      │
│  │  │   Summary()              │  │   Summary()                    │      │
│  │  │ - getSubjectAttendance() │  │ - getSubjectMarks()            │      │
│  │  │ - updateStatus()         │  │ - updateMarks()                │      │
│  │  └──────────────────────────┘  └────────────────────────────────┘      │
│  │                                                                  │      │
│  │  Student.js    │  Subject.js    │  FacultyUser.js               │      │
│  │  ├───────────  │  ├───────────  │  ├────────────────            │      │
│  │  │ CRUD Ops    │  │ CRUD Ops    │  │ CRUD Ops                   │      │
│  │  └─────────────┘  └─────────────┘  └────────────────────────────┘      │
│  │                                                                  │      │
│  └─────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ SQL Queries
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE LAYER                                    │
│                            (PostgreSQL)                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐               │
│  │   students     │  │  faculty_users │  │   subjects     │               │
│  ├────────────────┤  ├────────────────┤  ├────────────────┤               │
│  │ id             │  │ id             │  │ id             │               │
│  │ student_id     │  │ faculty_id     │  │ subject_code   │               │
│  │ usn            │  │ email          │  │ subject_name   │               │
│  │ full_name      │  │ full_name      │  │ semester       │               │
│  │ semester       │  │ designation    │  │ credits        │               │
│  │ section        │  │ department     │  │ department     │               │
│  │ email          │  │ is_active      │  │ is_active      │               │
│  └────────────────┘  └────────────────┘  └────────────────┘               │
│                                                                             │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐               │
│  │  attendance    │  │     marks      │  │ faculty_       │               │
│  │                │  │                │  │  subjects      │               │
│  ├────────────────┤  ├────────────────┤  ├────────────────┤               │
│  │ id             │  │ id             │  │ id             │               │
│  │ student_id  ───┼──│ student_id  ───┼──│ faculty_id     │               │
│  │ subject_id  ───┼──│ subject_id  ───┼──│ subject_id     │               │
│  │ faculty_id     │  │ faculty_id     │  │ academic_year  │               │
│  │ date           │  │ exam_type      │  │ section        │               │
│  │ status         │  │ marks_obtained │  └────────────────┘               │
│  │ period_number  │  │ max_marks      │                                    │
│  │ section        │  │ section        │                                    │
│  │ academic_year  │  │ academic_year  │                                    │
│  │ semester       │  │ semester       │                                    │
│  │ remarks        │  │ exam_date      │                                    │
│  │ marked_at      │  │ created_at     │                                    │
│  └────────────────┘  └────────────────┘                                    │
│                                                                             │
│  CONSTRAINTS:                                                               │
│  ✓ Foreign Keys (referential integrity)                                    │
│  ✓ UNIQUE (student_id, subject_id, date, period) - No duplicate attendance │
│  ✓ UNIQUE (student_id, subject_id, exam_type, year) - No duplicate marks   │
│  ✓ CHECK constraints on status and exam_type                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          DATA FLOW EXAMPLE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  FACULTY MARKS ATTENDANCE:                                                 │
│  ─────────────────────────                                                 │
│  1. Faculty selects: Subject=ML, Section=A, Date=2026-01-30, Period=3      │
│  2. Frontend shows student list                                            │
│  3. Faculty marks: Student1=Present, Student2=Absent, Student3=Present     │
│  4. POST /api/faculty/attendance/bulk                                      │
│  5. facultyAuth middleware validates JWT                                   │
│  6. attendanceController.markBulkAttendance() called                       │
│  7. Attendance.markBulkAttendance() inserts to DB                          │
│  8. Response: "Attendance marked for 3 students"                           │
│  9. ✅ Data saved in PostgreSQL                                            │
│                                                                             │
│  STUDENT VIEWS ATTENDANCE:                                                 │
│  ──────────────────────────                                                │
│  1. Student clicks "View My Attendance"                                    │
│  2. GET /api/student/attendance/summary                                    │
│  3. studentAuth middleware validates JWT, extracts student_id              │
│  4. viewController.getMyAttendanceSummary() called                         │
│  5. Attendance.getStudentAttendanceSummary(student_id) queries DB          │
│  6. Returns subject-wise percentages                                       │
│  7. Frontend displays charts and statistics                                │
│  8. ✅ Student sees their attendance!                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          SECURITY FEATURES                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ✓ JWT Authentication on all routes                                        │
│  ✓ Role-based middleware (Faculty vs Student)                              │
│  ✓ Students can ONLY access their own data (filtered by student_id)        │
│  ✓ Faculty can only access assigned subjects                               │
│  ✓ SQL injection prevention (parameterized queries)                        │
│  ✓ Password hashing with bcrypt                                            │
│  ✓ Input validation (client + server side)                                 │
│  ✓ CORS protection                                                          │
│  ✓ Rate limiting on API endpoints                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Interaction Flow

```
┌──────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│          │  HTTP   │          │  JWT    │          │  SQL    │          │
│ Frontend ├────────►│Middleware├────────►│Controller├────────►│  Model   │
│  (React) │ Request │  (Auth)  │ Verify  │ (Logic)  │ Query   │(Database)│
│          │         │          │         │          │         │          │
│          ◄────────┤          ◄────────┤          ◄────────┤          │
│          │Response │          │ User    │          │ Data    │          │
└──────────┘         └──────────┘         └──────────┘         └──────────┘
```

## Technology Stack Summary

```
┌────────────────────┐
│   FRONTEND         │
│ ─────────────────  │
│ React 18           │
│ Tailwind CSS       │
│ Chart.js           │
│ React Router       │
│ Axios              │
└────────────────────┘
         │
         ▼
┌────────────────────┐
│   BACKEND          │
│ ─────────────────  │
│ Node.js            │
│ Express.js         │
│ JWT                │
│ bcrypt             │
│ Express Validator  │
└────────────────────┘
         │
         ▼
┌────────────────────┐
│   DATABASE         │
│ ─────────────────  │
│ PostgreSQL 14+     │
│ pg (node-postgres) │
└────────────────────┘
```
