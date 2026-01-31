# 🎓 Mentor-Mentee Assignment System

## Overview

The Mentor-Mentee system allows automatic and manual assignment of faculty members as mentors to students. Each student gets one mentor per academic year, and faculty can manage their mentees through the dashboard.

---

## 🚀 Quick Start - Assign Mentors to All Students

### Step 1: Check Current Assignments

```bash
cd server
node scripts/checkMentorAssignments.js
```

This will show:
- How many students have mentors
- How many students need mentors
- Faculty-wise distribution
- Unassigned students list

### Step 2: Assign Mentors Automatically

```bash
node scripts/assignMentorsToStudents.js
```

This script will:
- ✅ Get all active faculty members
- ✅ Get all students who need mentors
- ✅ Distribute students evenly among faculty
- ✅ Create mentor-mentee relationships
- ✅ Update student records

### Step 3: Verify Assignments

```bash
node scripts/checkMentorAssignments.js
```

Confirm all students now have mentors assigned!

---

## 📊 How Mentor Assignment Works

### Automatic Distribution Algorithm

The script uses a **round-robin distribution** approach:

1. Gets all active faculty (e.g., 10 faculty members)
2. Gets all students needing mentors (e.g., 100 students)
3. Calculates: ~10 students per faculty
4. Distributes evenly: Faculty 1 → Student 1, Faculty 2 → Student 2, ... Faculty 1 → Student 11, etc.

**Example Distribution:**
```
Faculty A: 10 students (Sem 1-8, mixed sections)
Faculty B: 10 students (Sem 1-8, mixed sections)
Faculty C: 10 students (Sem 1-8, mixed sections)
...
```

### Database Tables

**mentor_mentee table:**
```sql
- id (Primary Key)
- faculty_id (References faculty_users)
- student_id (References students)
- academic_year (e.g., '2025-26')
- assigned_date
- is_active (TRUE/FALSE)
- remarks
```

**students table (updated):**
```sql
- current_mentor_id (References faculty_users)
  Quick access to current mentor
```

---

## 🎯 Features

### For Faculty:
- ✅ View all their mentees
- ✅ See mentee details (USN, semester, section, contact)
- ✅ Track mentee attendance and marks
- ✅ Add remarks/notes about mentees
- ✅ Communication with mentees

### For Students:
- ✅ View assigned mentor details
- ✅ See mentor's contact information
- ✅ Office hours and availability
- ✅ Request meetings/consultations

### For Admin:
- ✅ Assign/reassign mentors manually
- ✅ Bulk mentor assignment
- ✅ View mentor-mentee reports
- ✅ Track mentorship effectiveness

---

## 🔧 Manual Assignment (Admin Panel)

### API Endpoint:
```
POST /api/admin/faculty/assign-mentor
```

### Request Body:
```json
{
  "faculty_id": 5,
  "student_ids": [10, 11, 12, 13, 14]
}
```

### Response:
```json
{
  "success": true,
  "message": "Successfully assigned 5 students to Dr. John Doe",
  "data": {
    "assignments": [...]
  }
}
```

---

## 📝 Script Details

### assignMentorsToStudents.js

**What it does:**
1. Fetches current academic year from system settings
2. Gets all active faculty members
3. Gets all students without mentors for current year
4. Distributes students evenly using round-robin
5. Creates mentor_mentee records
6. Updates students table with current_mentor_id
7. Prints detailed summary report

**Features:**
- ✅ Skips already assigned students
- ✅ Handles conflicts gracefully
- ✅ Transaction-based (all or nothing)
- ✅ Detailed progress logging
- ✅ Summary report with statistics

### checkMentorAssignments.js

**What it does:**
1. Shows total students and faculty count
2. Lists students without mentors
3. Shows faculty-wise distribution
4. Calculates distribution statistics
5. Provides actionable insights

**Statistics shown:**
- Total students vs assigned students
- Students per faculty
- Distribution balance (max - min)
- Unassigned students list

---

## 🎨 Frontend Integration (Coming Soon)

### Admin Dashboard - Mentor Management
- View all mentor-mentee pairs
- Reassign mentors
- Bulk assignment interface
- Distribution charts

### Faculty Dashboard - My Mentees
- List of all mentees
- Student details and contact
- Performance tracking
- Add remarks/notes

### Student Dashboard - My Mentor
- Mentor details card
- Contact information
- Office hours
- Request meeting button

---

## 📊 Reports and Analytics

### Available Reports:

1. **Faculty Mentee List**
   - All mentees for a faculty member
   - Grouped by semester/section
   - Export to PDF/Excel

2. **Student Mentor History**
   - All past mentors for a student
   - Year-wise assignments
   - Remarks history

3. **Distribution Report**
   - Faculty-wise mentee count
   - Department-wise distribution
   - Semester-wise breakdown

4. **Mentorship Effectiveness**
   - Mentee attendance correlation
   - Mentee performance tracking
   - Engagement metrics

---

## 🔄 Reassignment Process

### When to Reassign:

1. **Faculty becomes inactive** - System auto-reassigns
2. **Mentor overloaded** - Admin redistributes
3. **Student request** - Admin approval required
4. **New academic year** - Fresh assignments

### How to Reassign:

**Option 1: Script (Bulk)**
```bash
node scripts/assignMentorsToStudents.js
# Will update existing assignments for current year
```

**Option 2: API (Individual)**
```bash
POST /api/admin/faculty/assign-mentor
{
  "faculty_id": 7,
  "student_ids": [25]
}
```

---

## 🐛 Troubleshooting

### Issue: "No active faculty found"
**Solution:** Ensure faculty members are marked as `is_active = TRUE`
```sql
UPDATE faculty_users SET is_active = TRUE WHERE id = X;
```

### Issue: "No students found"
**Solution:** Check if students exist and are active
```sql
SELECT COUNT(*) FROM students WHERE is_active = TRUE;
```

### Issue: "Duplicate key violation"
**Solution:** Student already has mentor for this year (this is expected)
- Script handles this with `ON CONFLICT DO UPDATE`

### Issue: "Uneven distribution"
**Solution:** This happens when students % faculty != 0
- Some faculty will have +1 extra mentee
- Run script again to redistribute if needed

---

## 📈 Best Practices

1. **Run at Start of Academic Year**
   - Fresh assignments for new year
   - Update academic year in system settings first

2. **Review Distribution**
   - Check if any faculty is overloaded
   - Manually adjust if needed

3. **Monitor Changes**
   - Track student transfers
   - Update assignments when students join/leave

4. **Faculty Availability**
   - Consider faculty workload
   - Respect max_mentees limit (default: 20)

5. **Communication**
   - Notify faculty of new mentee assignments
   - Send welcome message to students

---

## 🔐 Security & Permissions

### Role-Based Access:

**Admin:**
- ✅ Assign/Reassign mentors
- ✅ View all assignments
- ✅ Generate reports
- ✅ Modify system settings

**Faculty:**
- ✅ View own mentees only
- ✅ Add remarks for mentees
- ✅ Request reassignment
- ❌ Cannot assign mentors

**Student:**
- ✅ View assigned mentor
- ✅ Request mentor change (approval needed)
- ❌ Cannot see other mentors/mentees

---

## 🎯 Success Metrics

After running the script, you should see:

```
✅ All students assigned: 100%
✅ Distribution balance: < 3 (max - min)
✅ Average mentees per faculty: 8-15
✅ No unassigned students
✅ All faculty have at least 1 mentee
```

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review database schema in `enhanced_schema.sql`
3. Check MentorMentee model in `models/MentorMentee.js`
4. Contact system administrator

---

## 🚀 Next Steps

After assigning mentors:

1. ✅ **Notify Faculty**
   - Send email with mentee list
   - Share access to mentee dashboard

2. ✅ **Notify Students**
   - Send email with mentor details
   - Share mentor contact info

3. ✅ **Setup Meetings**
   - Schedule first mentor-mentee meeting
   - Share guidelines for mentorship

4. ✅ **Track Progress**
   - Monitor mentee attendance
   - Review academic performance
   - Collect feedback

---

**Last Updated:** January 31, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
