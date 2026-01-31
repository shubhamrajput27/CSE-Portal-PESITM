# Quick Setup & Testing Guide

## 🚀 Quick Start

### 1. Database Setup (One-time)

```bash
cd server
node scripts/addSectionToTables.js
```

This adds the `section` column to students, attendance, and marks tables.

### 2. Start the Application

```bash
# From project root
npm run dev
```

This starts both:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

---

## 🧪 Testing Workflow

### Step 1: Create Test Data (Optional)

If you don't have test data, create some:

**Create a Faculty User:**
```sql
INSERT INTO faculty_users (faculty_id, email, password_hash, full_name, designation, department)
VALUES ('FAC001', 'faculty@test.com', '$2b$12$hashedpassword', 'Test Faculty', 'Assistant Professor', 'CSE');
```

**Create Students:**
```sql
INSERT INTO students (student_id, usn, email, password_hash, full_name, semester, section)
VALUES 
  ('STU001', '1PE21CS001', 'student1@test.com', '$2b$12$hashedpassword', 'Student One', 5, 'A'),
  ('STU002', '1PE21CS002', 'student2@test.com', '$2b$12$hashedpassword', 'Student Two', 5, 'A'),
  ('STU003', '1PE21CS003', 'student3@test.com', '$2b$12$hashedpassword', 'Student Three', 5, 'B');
```

**Create Subjects:**
```sql
INSERT INTO subjects (subject_code, subject_name, semester, credits, department)
VALUES 
  ('CS501', 'Machine Learning', 5, 4, 'CSE'),
  ('CS502', 'Cloud Computing', 5, 4, 'CSE'),
  ('CS503', 'Software Engineering', 5, 3, 'CSE');
```

**Assign Subjects to Faculty:**
```sql
INSERT INTO faculty_subjects (faculty_id, subject_id, academic_year, section)
SELECT 1, id, '2025-26', 'A' FROM subjects WHERE semester = 5;
```

### Step 2: Test Faculty Login

1. Go to: http://localhost:3000/faculty-login
2. Login with faculty credentials
3. Should redirect to Faculty Dashboard

### Step 3: Test Attendance Marking

1. Click **"Mark Attendance"** button
2. You should see:
   - Subject dropdown (populated with assigned subjects)
   - Date picker (default: today)
   - Period selector
   - Student list

3. **Mark Attendance:**
   - Select a subject
   - Select period (e.g., Period 1)
   - Toggle attendance status for students
   - Click **"Submit Attendance"**
   - ✅ Should show: "Attendance marked successfully!"

4. **Verify in Database:**
```sql
SELECT 
  s.usn, s.full_name, a.status, a.attendance_date, a.period_number
FROM attendance a
JOIN students s ON a.student_id = s.id
ORDER BY a.created_at DESC
LIMIT 10;
```

### Step 4: Test Marks Entry

1. Click **"Enter Marks"** button
2. You should see:
   - Subject dropdown
   - Exam Type dropdown
   - Max Marks input
   - Student list with marks input fields

3. **Enter Marks:**
   - Select subject: "Machine Learning"
   - Select exam type: "Internal Test 1"
   - Enter max marks: 50
   - Enter marks for each student (e.g., 45, 40, 48)
   - Click **"Submit Marks"**
   - ✅ Should show: "Marks added successfully!"

4. **Verify in Database:**
```sql
SELECT 
  s.usn, s.full_name, m.exam_type, m.marks_obtained, m.max_marks,
  ROUND((m.marks_obtained / m.max_marks) * 100, 2) as percentage
FROM marks m
JOIN students s ON m.student_id = s.id
ORDER BY m.created_at DESC
LIMIT 10;
```

### Step 5: Test Student Login

1. Logout from faculty account
2. Go to: http://localhost:3000/student-login
3. Login with student credentials
4. Should redirect to Student Dashboard

### Step 6: Test Student Attendance View

1. Click **"View My Attendance"** button
2. You should see:
   - Overall attendance percentage
   - Subject-wise breakdown
   - Line chart visualization
   - Detailed statistics

3. **Verify Data:**
   - ✅ Attendance percentage matches what was marked
   - ✅ Subject names are correct
   - ✅ Chart displays properly

### Step 7: Test Student Marks View

1. Click **"View My Marks"** button
2. You should see:
   - Overall percentage and grade
   - Subject-wise marks table
   - Bar chart visualization
   - Assessment breakup

3. **Verify Data:**
   - ✅ Marks match what was entered by faculty
   - ✅ Percentage calculations are correct
   - ✅ Grade is assigned properly (A+, A, B+, etc.)

---

## 🔍 Verification Checklist

### Backend API Tests

Test using Postman or curl:

**1. Faculty Get Subjects:**
```bash
curl -H "Authorization: Bearer <faculty_token>" \
  http://localhost:5000/api/faculty/subjects
```

**2. Faculty Get Students:**
```bash
curl -H "Authorization: Bearer <faculty_token>" \
  http://localhost:5000/api/faculty/students
```

**3. Mark Attendance:**
```bash
curl -X POST \
  -H "Authorization: Bearer <faculty_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "subject_id": 1,
    "date": "2026-01-30",
    "period": 1,
    "attendance_records": [
      {"student_id": 1, "status": "present"},
      {"student_id": 2, "status": "absent"}
    ]
  }' \
  http://localhost:5000/api/faculty/attendance/bulk
```

**4. Student Get Attendance:**
```bash
curl -H "Authorization: Bearer <student_token>" \
  http://localhost:5000/api/student/attendance/summary
```

---

## 📊 Expected Results

### Faculty Dashboard
- ✅ Can see assigned subjects
- ✅ Can mark attendance for students
- ✅ Can enter marks for students
- ✅ Sees success messages on submission
- ✅ Can update existing records

### Student Dashboard
- ✅ Can see only their own data
- ✅ Attendance shows correct percentages
- ✅ Marks display with proper grades
- ✅ Charts render properly
- ✅ Cannot access other students' data

---

## 🐛 Common Issues & Solutions

### Issue 1: "No subjects assigned"
**Cause:** Faculty not assigned to any subjects
**Solution:** Run this SQL:
```sql
INSERT INTO faculty_subjects (faculty_id, subject_id, academic_year, section)
SELECT <faculty_id>, id, '2025-26', 'A' FROM subjects WHERE semester = 5;
```

### Issue 2: "Failed to fetch students"
**Cause:** No students in database or wrong section
**Solution:** Add students with appropriate semester and section

### Issue 3: "Attendance not showing for student"
**Cause:** Mismatched student_id or no attendance records
**Solution:** Verify:
```sql
SELECT * FROM attendance WHERE student_id = <student_id>;
```

### Issue 4: "Cannot mark duplicate attendance"
**Cause:** Attendance already exists for same date/period/subject
**Solution:** This is EXPECTED behavior. Use UPDATE instead of INSERT.

### Issue 5: Token errors
**Cause:** Expired or invalid JWT
**Solution:** Re-login to get fresh token

---

## 📈 Performance Tips

1. **Index Usage:** Ensure indexes exist on frequently queried columns
2. **Bulk Operations:** Always use bulk APIs for multiple records
3. **Caching:** Consider caching subject lists (they rarely change)
4. **Pagination:** For large classes, implement pagination

---

## 🔒 Security Reminders

- ✅ Never share JWT tokens
- ✅ Use HTTPS in production
- ✅ Validate all inputs server-side
- ✅ Students can only see their own data
- ✅ Faculty can only edit assigned subjects

---

## 📝 Manual Testing Checklist

- [ ] Faculty can login
- [ ] Faculty can see assigned subjects
- [ ] Faculty can mark attendance
- [ ] Faculty can enter marks
- [ ] Attendance saves to database
- [ ] Marks save to database
- [ ] Student can login
- [ ] Student sees attendance summary
- [ ] Student sees marks summary
- [ ] Attendance percentages are correct
- [ ] Marks percentages are correct
- [ ] Charts display properly
- [ ] Date filters work
- [ ] Bulk operations work
- [ ] Update operations work
- [ ] Error messages display properly
- [ ] Success messages display properly

---

## 🎯 Next Steps

After successful testing:

1. **Add Real Data:** Import actual students and faculty
2. **Configure Academic Year:** Update system settings
3. **Train Users:** Conduct training sessions
4. **Monitor Logs:** Check for errors in production
5. **Backup Data:** Setup regular database backups

---

**Happy Testing! 🚀**
