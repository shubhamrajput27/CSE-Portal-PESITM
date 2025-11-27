# Attendance & Marks API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

---

## ADMIN ENDPOINTS

### Subject Management

#### Get All Subjects
```http
GET /admin/subjects
Query Parameters:
  - semester: number (optional)
  - branch: string (optional)
  - department: string (optional)
  - is_active: boolean (optional)

Response:
{
  "success": true,
  "count": 15,
  "data": [...]
}
```

#### Get Subject by ID
```http
GET /admin/subjects/:id

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "subject_code": "CS101",
    "subject_name": "Data Structures",
    "semester": 3,
    "credits": 4,
    "assigned_faculty": [...]
  }
}
```

#### Add New Subject
```http
POST /admin/subjects

Body:
{
  "subject_code": "CS101",
  "subject_name": "Data Structures",
  "semester": 3,
  "credits": 4,
  "subject_type": "theory",
  "branch": "CSE",
  "department": "Computer Science"
}

Response:
{
  "success": true,
  "message": "Subject created successfully",
  "data": {...}
}
```

#### Update Subject
```http
PUT /admin/subjects/:id

Body:
{
  "subject_name": "Advanced Data Structures",
  "credits": 5
}
```

#### Delete Subject
```http
DELETE /admin/subjects/:id
```

#### Assign Subject to Faculty
```http
POST /admin/subjects/assign

Body:
{
  "subject_id": 1,
  "faculty_id": 5,
  "section": "A",
  "academic_year": "2024-25"
}
```

#### Get Subjects by Semester
```http
GET /admin/subjects/semester/:semester
```

---

## FACULTY ENDPOINTS

### Attendance Management

#### Mark Single Attendance
```http
POST /faculty/attendance

Body:
{
  "student_id": 123,
  "subject_id": 5,
  "date": "2024-11-27",
  "status": "present",
  "period": 1,
  "remarks": "On time"
}

Status values: 'present', 'absent', 'late'
```

#### Mark Bulk Attendance
```http
POST /faculty/attendance/bulk

Body:
{
  "subject_id": 5,
  "date": "2024-11-27",
  "period": 1,
  "attendance_records": [
    { "student_id": 101, "status": "present" },
    { "student_id": 102, "status": "absent", "remarks": "Sick" },
    { "student_id": 103, "status": "present" }
  ]
}

Response:
{
  "success": true,
  "message": "Attendance marked for 3 students",
  "data": [...]
}
```

#### Get Subject Attendance (for specific date)
```http
GET /faculty/attendance/subject?subject_id=5&date=2024-11-27&period=1

Response: List of all students with attendance status for that date/period
```

#### Get Student Attendance
```http
GET /faculty/attendance/student/:student_id?subject_id=5&start_date=2024-10-01&end_date=2024-11-27
```

#### Get Student Attendance Summary
```http
GET /faculty/attendance/student/:student_id/summary?start_date=2024-10-01&end_date=2024-11-27

Response:
{
  "success": true,
  "data": [
    {
      "subject_id": 5,
      "subject_name": "Data Structures",
      "total_classes": 40,
      "present_count": 35,
      "absent_count": 5,
      "attendance_percentage": 87.5
    }
  ]
}
```

#### Get Faculty Attendance Stats
```http
GET /faculty/attendance/stats?subject_id=5&start_date=2024-10-01&end_date=2024-11-27

Response: Overall attendance statistics for faculty's subjects
```

#### Get Low Attendance Students
```http
GET /faculty/attendance/low?subject_id=5&threshold=75&start_date=2024-10-01&end_date=2024-11-27

Response: Students with attendance below threshold (default 75%)
```

### Marks Management

#### Add Single Marks
```http
POST /faculty/marks

Body:
{
  "student_id": 123,
  "subject_id": 5,
  "exam_type": "internal_1",
  "marks_obtained": 45,
  "max_marks": 50,
  "remarks": "Good performance"
}

Exam Types:
- internal_1, internal_2, internal_3
- assignment
- quiz
- practical
- seminar
```

#### Add Bulk Marks
```http
POST /faculty/marks/bulk

Body:
{
  "subject_id": 5,
  "exam_type": "internal_1",
  "max_marks": 50,
  "marks_records": [
    { "student_id": 101, "marks_obtained": 45 },
    { "student_id": 102, "marks_obtained": 38, "remarks": "Needs improvement" },
    { "student_id": 103, "marks_obtained": 48 }
  ]
}

Response:
{
  "success": true,
  "message": "Marks added for 3 students",
  "data": [...]
}
```

#### Get Student Marks
```http
GET /faculty/marks/student/:student_id?subject_id=5&exam_type=internal_1
```

#### Get Student Marks Summary
```http
GET /faculty/marks/student/:student_id/summary

Response:
{
  "success": true,
  "data": [
    {
      "subject_id": 5,
      "subject_name": "Data Structures",
      "internal_1": 45,
      "internal_2": 48,
      "total_marks": 93,
      "max_marks": 100,
      "percentage": 93.0
    }
  ]
}
```

#### Get Subject Marks (all students)
```http
GET /faculty/marks/subject?subject_id=5&exam_type=internal_1

Response: All students' marks for that subject & exam type
```

#### Get Faculty Marks Stats
```http
GET /faculty/marks/stats?subject_id=5&exam_type=internal_1
```

#### Get Top Performers
```http
GET /faculty/marks/top-performers?subject_id=5&exam_type=internal_1&limit=10

Response: Top 10 students based on percentage
```

#### Get Class Analytics
```http
GET /faculty/marks/analytics?subject_id=5&exam_type=internal_1

Response:
{
  "success": true,
  "data": {
    "total_students": 60,
    "average_marks": 42.5,
    "average_percentage": 85.0,
    "highest_marks": 50,
    "lowest_marks": 25,
    "passed_count": 58,
    "failed_count": 2,
    "pass_percentage": 96.67
  }
}
```

---

## STUDENT ENDPOINTS

### View Attendance & Marks

#### Get My Attendance
```http
GET /student/attendance?subject_id=5&start_date=2024-10-01&end_date=2024-11-27

Response: Student's own attendance records
```

#### Get My Attendance Summary
```http
GET /student/attendance/summary?start_date=2024-10-01&end_date=2024-11-27

Response:
{
  "success": true,
  "data": [
    {
      "subject_id": 5,
      "subject_name": "Data Structures",
      "subject_code": "CS301",
      "total_classes": 40,
      "present_count": 35,
      "absent_count": 5,
      "attendance_percentage": 87.5
    },
    ...
  ]
}
```

#### Get My Marks
```http
GET /student/marks?subject_id=5&exam_type=internal_1

Response: Student's own marks
```

#### Get My Marks Summary
```http
GET /student/marks/summary

Response:
{
  "success": true,
  "data": [
    {
      "subject_id": 5,
      "subject_name": "Data Structures",
      "subject_code": "CS301",
      "exam_type": "internal_1",
      "marks_obtained": 45,
      "max_marks": 50,
      "percentage": 90.0
    },
    ...
  ]
}
```

#### Get Dashboard Data
```http
GET /student/dashboard

Response:
{
  "success": true,
  "data": {
    "attendance": [...],
    "marks": [...]
  }
}
```

---

## Example Usage

### Example 1: Faculty marks attendance for entire class

```javascript
// Login as faculty
const loginResponse = await fetch('http://localhost:5000/api/faculty-auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'faculty@example.com',
    password: 'password123'
  })
});

const { token } = await loginResponse.json();

// Mark attendance for all students
const attendanceResponse = await fetch('http://localhost:5000/api/faculty/attendance/bulk', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    subject_id: 5,
    date: '2024-11-27',
    period: 1,
    attendance_records: [
      { student_id: 101, status: 'present' },
      { student_id: 102, status: 'absent' },
      { student_id: 103, status: 'present' }
    ]
  })
});
```

### Example 2: Faculty adds marks from CSV

```javascript
// After parsing CSV, bulk add marks
const marksResponse = await fetch('http://localhost:5000/api/faculty/marks/bulk', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    subject_id: 5,
    exam_type: 'internal_1',
    max_marks: 50,
    marks_records: [
      { student_id: 101, marks_obtained: 45 },
      { student_id: 102, marks_obtained: 38 },
      { student_id: 103, marks_obtained: 48 }
    ]
  })
});
```

### Example 3: Student views attendance summary

```javascript
// Login as student
const studentLogin = await fetch('http://localhost:5000/api/student/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    usn: 'CSE21001',
    password: 'password123'
  })
});

const { token } = await studentLogin.json();

// Get attendance summary
const summaryResponse = await fetch('http://localhost:5000/api/student/attendance/summary', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { data } = await summaryResponse.json();
// Shows attendance percentage for all subjects
```

---

## Database Setup Required

Before using these APIs, run the database migration:

```bash
cd server
psql -U postgres -d pesitm_cse_portal -f database/enhanced_schema.sql
```

This will create tables:
- subjects
- faculty_subjects
- attendance
- marks
- And related indexes/triggers
