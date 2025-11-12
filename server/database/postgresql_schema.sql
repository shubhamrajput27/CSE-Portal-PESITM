-- PESITM CSE Portal - PostgreSQL Database Schema
-- Admin Users Management System

-- Create database (run this separately if needed)
-- CREATE DATABASE pesitm_cse_portal;

-- Switch to the database
-- \c pesitm_cse_portal;

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('super_admin', 'admin', 'moderator')) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES admin_users(id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- Create admin_sessions table for JWT token management
CREATE TABLE IF NOT EXISTS admin_sessions (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for sessions
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token_hash ON admin_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_active ON admin_sessions(is_active);

-- Create admin_activity_log table for audit trail
CREATE TABLE IF NOT EXISTS admin_activity_log (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100),
    resource_id INTEGER,
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for activity log
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_admin_id ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_action ON admin_activity_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON admin_activity_log(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for admin_users table
CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password will be hashed by application)
INSERT INTO admin_users (username, email, password_hash, full_name, role, is_active) 
VALUES ('admin', 'admin@pesitm.edu.in', 'temp_password_to_be_hashed', 'System Administrator', 'super_admin', TRUE)
ON CONFLICT (username) DO NOTHING;

-- Insert additional admin users
INSERT INTO admin_users (username, email, password_hash, full_name, role, is_active) VALUES
('hod', 'hod.cse@pesitm.edu.in', 'temp_password_to_be_hashed', 'Dr. Prasanna Kumar H R (HOD)', 'admin', TRUE),
('faculty', 'faculty@pesitm.edu.in', 'temp_password_to_be_hashed', 'Prof. Priya Sharma', 'moderator', TRUE),
('coordinator', 'coordinator@pesitm.edu.in', 'temp_password_to_be_hashed', 'Dr. Amit Verma', 'admin', TRUE),
('assistant', 'assistant@pesitm.edu.in', 'temp_password_to_be_hashed', 'Ms. Kavya Reddy', 'moderator', TRUE)
ON CONFLICT (username) DO NOTHING;

-- View to show admin users (excluding sensitive data)
CREATE OR REPLACE VIEW admin_users_view AS
SELECT 
    id,
    username,
    email,
    full_name,
    role,
    is_active,
    last_login_at,
    created_at,
    updated_at
FROM admin_users
WHERE is_active = TRUE;

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- =============================================
-- STUDENT LOGIN SYSTEM
-- =============================================

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    usn VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    department VARCHAR(50) DEFAULT 'CSE',
    semester INTEGER CHECK (semester >= 1 AND semester <= 8),
    year VARCHAR(10),
    phone VARCHAR(15),
    date_of_birth DATE,
    address TEXT,
    profile_image VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for students
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_usn ON students(usn);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_active ON students(is_active);
CREATE INDEX IF NOT EXISTS idx_students_semester ON students(semester);

-- Create student_sessions table
CREATE TABLE IF NOT EXISTS student_sessions (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for student sessions
CREATE INDEX IF NOT EXISTS idx_student_sessions_student_id ON student_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_student_sessions_token_hash ON student_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_student_sessions_expires_at ON student_sessions(expires_at);

-- Create student_activity_log table
CREATE TABLE IF NOT EXISTS student_activity_log (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100),
    resource_id INTEGER,
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for student activity log
CREATE INDEX IF NOT EXISTS idx_student_activity_log_student_id ON student_activity_log(student_id);
CREATE INDEX IF NOT EXISTS idx_student_activity_log_action ON student_activity_log(action);
CREATE INDEX IF NOT EXISTS idx_student_activity_log_created_at ON student_activity_log(created_at);

-- =============================================
-- FACULTY MEMBER LOGIN SYSTEM
-- =============================================

-- Create faculty_users table (separate from faculty profile table)
CREATE TABLE IF NOT EXISTS faculty_users (
    id SERIAL PRIMARY KEY,
    faculty_id VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    designation VARCHAR(100),
    department VARCHAR(50) DEFAULT 'CSE',
    phone VARCHAR(15),
    profile_image VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faculty users
CREATE INDEX IF NOT EXISTS idx_faculty_users_faculty_id ON faculty_users(faculty_id);
CREATE INDEX IF NOT EXISTS idx_faculty_users_email ON faculty_users(email);
CREATE INDEX IF NOT EXISTS idx_faculty_users_active ON faculty_users(is_active);
CREATE INDEX IF NOT EXISTS idx_faculty_users_designation ON faculty_users(designation);

-- Create faculty_sessions table
CREATE TABLE IF NOT EXISTS faculty_sessions (
    id SERIAL PRIMARY KEY,
    faculty_user_id INTEGER NOT NULL REFERENCES faculty_users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faculty sessions
CREATE INDEX IF NOT EXISTS idx_faculty_sessions_faculty_user_id ON faculty_sessions(faculty_user_id);
CREATE INDEX IF NOT EXISTS idx_faculty_sessions_token_hash ON faculty_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_faculty_sessions_expires_at ON faculty_sessions(expires_at);

-- Create faculty_activity_log table
CREATE TABLE IF NOT EXISTS faculty_activity_log (
    id SERIAL PRIMARY KEY,
    faculty_user_id INTEGER REFERENCES faculty_users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100),
    resource_id INTEGER,
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faculty activity log
CREATE INDEX IF NOT EXISTS idx_faculty_activity_log_faculty_user_id ON faculty_activity_log(faculty_user_id);
CREATE INDEX IF NOT EXISTS idx_faculty_activity_log_action ON faculty_activity_log(action);
CREATE INDEX IF NOT EXISTS idx_faculty_activity_log_created_at ON faculty_activity_log(created_at);

-- Create triggers for student and faculty tables
CREATE TRIGGER update_students_updated_at 
    BEFORE UPDATE ON students 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faculty_users_updated_at 
    BEFORE UPDATE ON faculty_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample students (password will be hashed by application)
INSERT INTO students (student_id, usn, email, password_hash, full_name, semester, year) VALUES
('2021CSE001', '1PE21CS001', 'student1@pestrust.edu.in', 'temp_password_to_be_hashed', 'Rahul Kumar', 7, '4th Year'),
('2021CSE002', '1PE21CS002', 'student2@pestrust.edu.in', 'temp_password_to_be_hashed', 'Priya Singh', 7, '4th Year'),
('2022CSE001', '1PE22CS001', 'student3@pestrust.edu.in', 'temp_password_to_be_hashed', 'Amit Sharma', 5, '3rd Year')
ON CONFLICT (student_id) DO NOTHING;

-- Insert sample faculty users (password will be hashed by application)
INSERT INTO faculty_users (faculty_id, email, password_hash, full_name, designation) VALUES
('FAC001', 'hodcse@pestrust.edu.in', 'temp_password_to_be_hashed', 'Dr. Prasanna Kumar H R', 'Professor and Head'),
('FAC002', 'manu.ap@pestrust.edu.in', 'temp_password_to_be_hashed', 'Dr. Manu A P', 'Professor'),
('FAC003', 'chethan.ls@pestrust.edu.in', 'temp_password_to_be_hashed', 'Dr. Chethan L S', 'Professor')
ON CONFLICT (faculty_id) DO NOTHING;

-- Create news/announcements table
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    category VARCHAR(50) DEFAULT 'general',
    image_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author_id INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for news
CREATE INDEX IF NOT EXISTS idx_news_published ON news(is_published);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(is_featured);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    priority VARCHAR(20) DEFAULT 'normal',
    is_active BOOLEAN DEFAULT TRUE,
    show_banner BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    expires_at TIMESTAMP,
    author_id INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_active ON notifications(is_active);
CREATE INDEX IF NOT EXISTS idx_notifications_banner ON notifications(show_banner);
CREATE INDEX IF NOT EXISTS idx_notifications_expires_at ON notifications(expires_at);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Create trigger for news table
CREATE TRIGGER update_news_updated_at 
    BEFORE UPDATE ON news 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for notifications table
CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample news
INSERT INTO news (title, content, excerpt, category, is_featured, author_id) VALUES
('Welcome to CSE Department Portal', 'We are excited to launch our new department portal with enhanced features for students, faculty, and visitors.', 'New department portal launched with enhanced features', 'announcement', TRUE, 1),
('Research Collaboration with Industry', 'Our department has partnered with leading tech companies for collaborative research projects in AI and Machine Learning.', 'New industry partnerships for research collaboration', 'research', FALSE, 1),
('Student Achievements in Hackathon', 'Our students secured first place in the national level hackathon competition held at IIT Delhi.', 'Students win national hackathon competition', 'achievement', TRUE, 1)
ON CONFLICT DO NOTHING;

-- Insert sample notifications
INSERT INTO notifications (title, message, type, priority, show_banner, author_id) VALUES
('Admission Open for 2024-25', 'Applications are now open for B.Tech and M.Tech programs. Visit admissions office for details.', 'info', 'high', TRUE, 1),
('Workshop on AI and ML', 'Join us for a 3-day workshop on Artificial Intelligence and Machine Learning. Registration required.', 'event', 'normal', FALSE, 1),
('Library Timing Update', 'Please note that library timings have been extended till 10 PM from Monday to Friday.', 'info', 'low', FALSE, 1)
ON CONFLICT DO NOTHING;

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    venue VARCHAR(200),
    category VARCHAR(50) DEFAULT 'workshop',
    organizer VARCHAR(100),
    image_url VARCHAR(500),
    attendees INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'upcoming',
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    author_id INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for events
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(is_featured);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_display_order ON events(display_order);

-- Create faculty table
CREATE TABLE IF NOT EXISTS faculty (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    specialization VARCHAR(200),
    email VARCHAR(100),
    qualification VARCHAR(200),
    experience VARCHAR(50),
    image_url VARCHAR(500),
    bio TEXT,
    research_interests TEXT,
    publications TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    author_id INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faculty
CREATE INDEX IF NOT EXISTS idx_faculty_active ON faculty(is_active);
CREATE INDEX IF NOT EXISTS idx_faculty_designation ON faculty(designation);
CREATE INDEX IF NOT EXISTS idx_faculty_display_order ON faculty(display_order);

-- Create research table
CREATE TABLE IF NOT EXISTS research (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    area VARCHAR(100),
    faculty_lead VARCHAR(100),
    funding_agency VARCHAR(200),
    funding_amount DECIMAL(15,2),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'ongoing',
    publications TEXT,
    image_url VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    author_id INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for research
CREATE INDEX IF NOT EXISTS idx_research_area ON research(area);
CREATE INDEX IF NOT EXISTS idx_research_status ON research(status);
CREATE INDEX IF NOT EXISTS idx_research_display_order ON research(display_order);

-- Create triggers for all tables
CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faculty_updated_at 
    BEFORE UPDATE ON faculty 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_research_updated_at 
    BEFORE UPDATE ON research 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample events
INSERT INTO events (title, description, date, venue, category, organizer, display_order, author_id) VALUES
('AI & ML Workshop', 'Comprehensive workshop on Artificial Intelligence and Machine Learning fundamentals', '2024-12-15 10:00:00', 'CSE Lab 1', 'Workshop', 'Dr. Priya Sharma', 1, 1),
('Tech Talk: Future of Computing', 'Guest lecture by industry expert on emerging technologies', '2024-12-20 14:00:00', 'Main Auditorium', 'Guest Lecture', 'CSE Department', 2, 1),
('CodeFest 2024', 'Annual coding competition for students', '2024-11-05 09:00:00', 'Computer Lab', 'Hackathon', 'Student Council', 3, 1)
ON CONFLICT DO NOTHING;

-- Insert sample faculty
INSERT INTO faculty (name, designation, specialization, email, qualification, experience, display_order, author_id) VALUES
('Dr. Prasanna Kumar H R', 'Professor and Head', 'Computer Science & Engineering', 'hodcse@pestrust.edu.in', 'Ph.D, M.Tech', '26 years', 1, 1),
('Dr. Manu A P', 'Professor', 'Computer Science & Engineering', 'manu.ap@pestrust.edu.in', 'Ph.D, M.Tech', '20 years', 2, 1),
('Dr. Chethan L S', 'Professor', 'Computer Science & Engineering', 'chethan.ls@pestrust.edu.in', 'Ph.D, M.Tech', '18 years', 3, 1),
('Mr. Raghavendra K', 'Assistant Professor', 'Computer Science & Engineering', 'raghavendra.k@pestrust.edu.in', 'M.Tech', '12 years', 4, 1)
ON CONFLICT DO NOTHING;

-- Insert sample research projects
INSERT INTO research (title, description, area, faculty_lead, status, display_order, author_id) VALUES
('AI-based Healthcare System', 'Development of intelligent healthcare monitoring system using machine learning', 'Artificial Intelligence', 'Dr. Priya Sharma', 'ongoing', 1, 1),
('IoT Security Framework', 'Research on securing Internet of Things devices and networks', 'Cybersecurity', 'Dr. Amit Verma', 'ongoing', 2, 1),
('Blockchain in Education', 'Implementation of blockchain technology for secure academic records', 'Blockchain', 'Dr. Manu A P', 'completed', 3, 1)
ON CONFLICT DO NOTHING;