-- Enhanced Database Schema for CSE Portal
-- This extends the existing schema with new tables for complete management system

-- ============================================================================
-- SUBJECTS & COURSES
-- ============================================================================

CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    subject_name VARCHAR(200) NOT NULL,
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    credits INTEGER DEFAULT 4,
    department VARCHAR(100) DEFAULT 'CSE',
    is_lab BOOLEAN DEFAULT FALSE,
    syllabus_file VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- FACULTY-SUBJECT ASSIGNMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS faculty_subjects (
    id SERIAL PRIMARY KEY,
    faculty_id INTEGER REFERENCES faculty_users(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    academic_year VARCHAR(20) NOT NULL,
    section VARCHAR(10),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(faculty_id, subject_id, academic_year, section)
);

-- ============================================================================
-- MENTOR-MENTEE ASSIGNMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS mentor_mentee (
    id SERIAL PRIMARY KEY,
    faculty_id INTEGER REFERENCES faculty_users(id) ON DELETE SET NULL,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    academic_year VARCHAR(20) NOT NULL,
    assigned_date DATE DEFAULT CURRENT_DATE,
    remarks TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, academic_year)
);

-- ============================================================================
-- ATTENDANCE
-- ============================================================================

CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    faculty_id INTEGER REFERENCES faculty_users(id) ON DELETE SET NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'on_leave', 'late')),
    period_number INTEGER,
    academic_year VARCHAR(20) NOT NULL,
    semester INTEGER NOT NULL,
    remarks TEXT,
    marked_by INTEGER REFERENCES faculty_users(id),
    marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, subject_id, attendance_date, period_number)
);

CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_subject ON attendance(subject_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);

-- ============================================================================
-- MARKS / INTERNAL ASSESSMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS marks (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    exam_type VARCHAR(50) NOT NULL CHECK (exam_type IN ('internal_1', 'internal_2', 'internal_3', 'assignment', 'quiz', 'practical', 'seminar')),
    marks_obtained DECIMAL(5,2) NOT NULL,
    max_marks DECIMAL(5,2) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    semester INTEGER NOT NULL,
    exam_date DATE,
    faculty_id INTEGER REFERENCES faculty_users(id),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, subject_id, exam_type, academic_year, semester)
);

CREATE INDEX idx_marks_student ON marks(student_id);
CREATE INDEX idx_marks_subject ON marks(subject_id);

-- ============================================================================
-- STUDY MATERIALS
-- ============================================================================

CREATE TABLE IF NOT EXISTS study_materials (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    faculty_id INTEGER REFERENCES faculty_users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) CHECK (file_type IN ('pdf', 'ppt', 'doc', 'video', 'other')),
    material_type VARCHAR(50) CHECK (material_type IN ('notes', 'assignment', 'question_paper', 'solution', 'reference')),
    file_size BIGINT,
    semester INTEGER,
    is_public BOOLEAN DEFAULT TRUE,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_materials_subject ON study_materials(subject_id);
CREATE INDEX idx_materials_faculty ON study_materials(faculty_id);

-- ============================================================================
-- TIMETABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS timetable (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    faculty_id INTEGER REFERENCES faculty_users(id) ON DELETE SET NULL,
    day_of_week VARCHAR(20) NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')),
    period_number INTEGER NOT NULL CHECK (period_number BETWEEN 1 AND 8),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number VARCHAR(50),
    semester INTEGER NOT NULL,
    section VARCHAR(10),
    academic_year VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(day_of_week, period_number, room_number, academic_year, semester, section)
);

-- ============================================================================
-- NOTICES / ANNOUNCEMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS notices (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    notice_type VARCHAR(50) CHECK (notice_type IN ('general', 'urgent', 'event', 'exam', 'holiday')),
    target_audience VARCHAR(50) CHECK (target_audience IN ('all', 'students', 'faculty', 'specific_semester', 'specific_section')),
    semester INTEGER,
    section VARCHAR(10),
    file_path VARCHAR(500),
    posted_by INTEGER REFERENCES admin_users(id),
    is_active BOOLEAN DEFAULT TRUE,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notices_target ON notices(target_audience);
CREATE INDEX idx_notices_created ON notices(created_at DESC);

-- ============================================================================
-- LEAVE REQUESTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS leave_requests (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    leave_type VARCHAR(50) CHECK (leave_type IN ('sick', 'personal', 'emergency', 'other')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    mentor_id INTEGER REFERENCES faculty_users(id),
    mentor_remarks TEXT,
    supporting_document VARCHAR(500),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by INTEGER REFERENCES faculty_users(id)
);

CREATE INDEX idx_leave_student ON leave_requests(student_id);
CREATE INDEX idx_leave_mentor ON leave_requests(mentor_id);

-- ============================================================================
-- MENTEE REMARKS
-- ============================================================================

CREATE TABLE IF NOT EXISTS mentee_remarks (
    id SERIAL PRIMARY KEY,
    mentor_id INTEGER REFERENCES faculty_users(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    remark_type VARCHAR(50) CHECK (remark_type IN ('academic', 'attendance', 'behavior', 'achievement', 'concern')),
    remarks TEXT NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SYSTEM SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_by INTEGER REFERENCES admin_users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
    ('current_academic_year', '2024-25', 'Current academic year'),
    ('department_name', 'Computer Science & Engineering', 'Department name'),
    ('department_logo', '/uploads/logo/default-logo.png', 'Department logo path'),
    ('attendance_percentage_required', '75', 'Minimum attendance percentage required'),
    ('semester_start_date', '2024-08-01', 'Current semester start date'),
    ('semester_end_date', '2024-12-31', 'Current semester end date')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================================================
-- PROFILE IMAGES
-- ============================================================================

CREATE TABLE IF NOT EXISTS profile_images (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('admin', 'faculty', 'student')),
    image_path VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, user_type)
);

-- ============================================================================
-- USER NOTIFICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('admin', 'faculty', 'student')),
    notification_type VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_notifications_user ON user_notifications(user_id, user_type);
CREATE INDEX idx_user_notifications_read ON user_notifications(is_read);

-- ============================================================================
-- UPDATE EXISTING TABLES
-- ============================================================================

-- Add mentor-related fields to students table if not exists
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS current_mentor_id INTEGER REFERENCES faculty_users(id),
ADD COLUMN IF NOT EXISTS academic_year VARCHAR(20) DEFAULT '2024-25',
ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500);

-- Add faculty-related fields
ALTER TABLE faculty_users
ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500),
ADD COLUMN IF NOT EXISTS office_hours TEXT,
ADD COLUMN IF NOT EXISTS max_mentees INTEGER DEFAULT 20;

-- Add admin-related fields
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marks_updated_at BEFORE UPDATE ON marks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON study_materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Student attendance summary view
CREATE OR REPLACE VIEW student_attendance_summary AS
SELECT 
    s.id AS student_id,
    s.usn,
    s.name AS student_name,
    sub.id AS subject_id,
    sub.subject_code,
    sub.subject_name,
    COUNT(*) AS total_classes,
    SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS classes_attended,
    ROUND((SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100, 2) AS attendance_percentage
FROM students s
JOIN attendance a ON s.id = a.student_id
JOIN subjects sub ON a.subject_id = sub.id
GROUP BY s.id, s.usn, s.name, sub.id, sub.subject_code, sub.subject_name;

-- Faculty workload view
CREATE OR REPLACE VIEW faculty_workload AS
SELECT 
    f.id AS faculty_id,
    f.name AS faculty_name,
    COUNT(DISTINCT fs.subject_id) AS subjects_count,
    COUNT(DISTINCT mm.student_id) AS mentees_count,
    COUNT(DISTINCT t.id) AS timetable_slots
FROM faculty_users f
LEFT JOIN faculty_subjects fs ON f.id = fs.faculty_id AND fs.academic_year = (SELECT setting_value FROM system_settings WHERE setting_key = 'current_academic_year')
LEFT JOIN mentor_mentee mm ON f.id = mm.faculty_id AND mm.is_active = TRUE
LEFT JOIN timetable t ON f.id = t.faculty_id AND t.is_active = TRUE
GROUP BY f.id, f.name;

COMMENT ON TABLE subjects IS 'Stores all subjects/courses in the department';
COMMENT ON TABLE attendance IS 'Daily attendance records for students';
COMMENT ON TABLE marks IS 'Internal assessment marks for students';
COMMENT ON TABLE study_materials IS 'Study materials uploaded by faculty';
COMMENT ON TABLE mentor_mentee IS 'Mentor-mentee assignments';
COMMENT ON TABLE notices IS 'Department notices and announcements';
COMMENT ON TABLE leave_requests IS 'Student leave applications';
