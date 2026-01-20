import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

// Comprehensive list of CS subjects across all semesters
const csSubjects = [
  // Semester 1
  { subject_code: 'MAT101', subject_name: 'Engineering Mathematics-I', semester: 1, credits: 4, is_lab: false },
  { subject_code: 'PHY101', subject_name: 'Engineering Physics', semester: 1, credits: 4, is_lab: false },
  { subject_code: 'CHE101', subject_name: 'Engineering Chemistry', semester: 1, credits: 4, is_lab: false },
  { subject_code: 'ELE101', subject_name: 'Basic Electrical Engineering', semester: 1, credits: 3, is_lab: false },
  { subject_code: 'CIV101', subject_name: 'Engineering Mechanics', semester: 1, credits: 3, is_lab: false },
  { subject_code: 'CSE101', subject_name: 'Introduction to Programming (C)', semester: 1, credits: 3, is_lab: false },
  { subject_code: 'CSEL101', subject_name: 'C Programming Lab', semester: 1, credits: 2, is_lab: true },
  
  // Semester 2
  { subject_code: 'MAT201', subject_name: 'Engineering Mathematics-II', semester: 2, credits: 4, is_lab: false },
  { subject_code: 'PHY201', subject_name: 'Applied Physics', semester: 2, credits: 3, is_lab: false },
  { subject_code: 'ELE201', subject_name: 'Basic Electronics', semester: 2, credits: 3, is_lab: false },
  { subject_code: 'CSE201', subject_name: 'Data Structures', semester: 2, credits: 4, is_lab: false },
  { subject_code: 'CSE202', subject_name: 'Digital Logic Design', semester: 2, credits: 3, is_lab: false },
  { subject_code: 'CSEL201', subject_name: 'Data Structures Lab', semester: 2, credits: 2, is_lab: true },
  { subject_code: 'CSEL202', subject_name: 'Digital Logic Lab', semester: 2, credits: 2, is_lab: true },
  
  // Semester 3
  { subject_code: 'MAT301', subject_name: 'Engineering Mathematics-III', semester: 3, credits: 4, is_lab: false },
  { subject_code: 'CSE301', subject_name: 'Computer Organization and Architecture', semester: 3, credits: 4, is_lab: false },
  { subject_code: 'CSE302', subject_name: 'Object Oriented Programming (OOP)', semester: 3, credits: 4, is_lab: false },
  { subject_code: 'CSE303', subject_name: 'Discrete Mathematics', semester: 3, credits: 4, is_lab: false },
  { subject_code: 'CSE304', subject_name: 'Theory of Computation', semester: 3, credits: 3, is_lab: false },
  { subject_code: 'CSEL301', subject_name: 'OOP Lab (Java)', semester: 3, credits: 2, is_lab: true },
  { subject_code: 'CSEL302', subject_name: 'Data Structures Lab-II', semester: 3, credits: 2, is_lab: true },
  
  // Semester 4
  { subject_code: 'MAT401', subject_name: 'Probability & Statistics', semester: 4, credits: 4, is_lab: false },
  { subject_code: 'CSE401', subject_name: 'Design and Analysis of Algorithms', semester: 4, credits: 4, is_lab: false },
  { subject_code: 'CSE402', subject_name: 'Database Management Systems (DBMS)', semester: 4, credits: 4, is_lab: false },
  { subject_code: 'CSE403', subject_name: 'Operating Systems (OS)', semester: 4, credits: 4, is_lab: false },
  { subject_code: 'CSE404', subject_name: 'Microprocessors and Microcontrollers', semester: 4, credits: 3, is_lab: false },
  { subject_code: 'CSEL401', subject_name: 'Algorithms Lab', semester: 4, credits: 2, is_lab: true },
  { subject_code: 'CSEL402', subject_name: 'DBMS Lab', semester: 4, credits: 2, is_lab: true },
  { subject_code: 'CSEL403', subject_name: 'OS Lab', semester: 4, credits: 2, is_lab: true },
  
  // Semester 5
  { subject_code: 'CSE501', subject_name: 'Computer Networks (CN)', semester: 5, credits: 4, is_lab: false },
  { subject_code: 'CSE502', subject_name: 'Software Engineering', semester: 5, credits: 4, is_lab: false },
  { subject_code: 'CSE503', subject_name: 'Web Technologies', semester: 5, credits: 3, is_lab: false },
  { subject_code: 'CSE504', subject_name: 'Compiler Design', semester: 5, credits: 4, is_lab: false },
  { subject_code: 'CSE505', subject_name: 'Artificial Intelligence (AI)', semester: 5, credits: 4, is_lab: false },
  { subject_code: 'CSEL501', subject_name: 'Computer Networks Lab', semester: 5, credits: 2, is_lab: true },
  { subject_code: 'CSEL502', subject_name: 'Web Technologies Lab', semester: 5, credits: 2, is_lab: true },
  { subject_code: 'CSEL503', subject_name: 'Software Engineering Lab', semester: 5, credits: 2, is_lab: true },
  
  // Semester 6
  { subject_code: 'CSE601', subject_name: 'Machine Learning (ML)', semester: 6, credits: 4, is_lab: false },
  { subject_code: 'CSE602', subject_name: 'Information Security & Cryptography', semester: 6, credits: 4, is_lab: false },
  { subject_code: 'CSE603', subject_name: 'Cloud Computing', semester: 6, credits: 4, is_lab: false },
  { subject_code: 'CSE604', subject_name: 'Mobile Application Development', semester: 6, credits: 3, is_lab: false },
  { subject_code: 'CSE605', subject_name: 'Big Data Analytics', semester: 6, credits: 4, is_lab: false },
  { subject_code: 'CSEL601', subject_name: 'Machine Learning Lab', semester: 6, credits: 2, is_lab: true },
  { subject_code: 'CSEL602', subject_name: 'Mobile App Development Lab', semester: 6, credits: 2, is_lab: true },
  { subject_code: 'CSEL603', subject_name: 'Mini Project', semester: 6, credits: 3, is_lab: true },
  
  // Semester 7
  { subject_code: 'CSE701', subject_name: 'Deep Learning', semester: 7, credits: 4, is_lab: false },
  { subject_code: 'CSE702', subject_name: 'Internet of Things (IoT)', semester: 7, credits: 4, is_lab: false },
  { subject_code: 'CSE703', subject_name: 'Blockchain Technology', semester: 7, credits: 3, is_lab: false },
  { subject_code: 'CSE704', subject_name: 'Natural Language Processing (NLP)', semester: 7, credits: 4, is_lab: false },
  { subject_code: 'CSE705E1', subject_name: 'Elective-I: DevOps', semester: 7, credits: 3, is_lab: false },
  { subject_code: 'CSE705E2', subject_name: 'Elective-I: Cyber Security', semester: 7, credits: 3, is_lab: false },
  { subject_code: 'CSEL701', subject_name: 'Deep Learning Lab', semester: 7, credits: 2, is_lab: true },
  { subject_code: 'CSEL702', subject_name: 'IoT Lab', semester: 7, credits: 2, is_lab: true },
  { subject_code: 'CSE707', subject_name: 'Major Project Phase-I', semester: 7, credits: 4, is_lab: true },
  
  // Semester 8
  { subject_code: 'CSE801', subject_name: 'Distributed Systems', semester: 8, credits: 4, is_lab: false },
  { subject_code: 'CSE802', subject_name: 'Computer Vision', semester: 8, credits: 4, is_lab: false },
  { subject_code: 'CSE803E1', subject_name: 'Elective-II: Quantum Computing', semester: 8, credits: 3, is_lab: false },
  { subject_code: 'CSE803E2', subject_name: 'Elective-II: Edge Computing', semester: 8, credits: 3, is_lab: false },
  { subject_code: 'CSE804E3', subject_name: 'Elective-II: Data Science', semester: 8, credits: 3, is_lab: false },
  { subject_code: 'CSE805', subject_name: 'Entrepreneurship Development', semester: 8, credits: 2, is_lab: false },
  { subject_code: 'CSE806', subject_name: 'Major Project Phase-II', semester: 8, credits: 8, is_lab: true },
];

const seedSubjects = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting to seed subjects...');
    
    await client.query('BEGIN');
    
    // Insert subjects
    let insertedCount = 0;
    let skippedCount = 0;
    
    for (const subject of csSubjects) {
      try {
        const query = `
          INSERT INTO subjects (subject_code, subject_name, semester, credits, department, is_lab, description, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (subject_code) DO UPDATE
          SET subject_name = EXCLUDED.subject_name,
              semester = EXCLUDED.semester,
              credits = EXCLUDED.credits,
              is_lab = EXCLUDED.is_lab,
              updated_at = CURRENT_TIMESTAMP
          RETURNING id
        `;
        
        const description = `${subject.subject_name} - Semester ${subject.semester} ${subject.is_lab ? 'Lab' : 'Theory'} Course`;
        
        await client.query(query, [
          subject.subject_code,
          subject.subject_name,
          subject.semester,
          subject.credits,
          'CSE',
          subject.is_lab,
          description,
          true
        ]);
        
        insertedCount++;
        console.log(`✅ Added: ${subject.subject_code} - ${subject.subject_name}`);
      } catch (error) {
        if (error.code === '23505') { // Duplicate key
          skippedCount++;
        } else {
          console.error(`❌ Error adding ${subject.subject_code}:`, error.message);
        }
      }
    }
    
    await client.query('COMMIT');
    
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Subjects inserted/updated: ${insertedCount}`);
    console.log(`   ⏭️  Subjects skipped: ${skippedCount}`);
    console.log(`   📚 Total subjects: ${csSubjects.length}\n`);
    
    return insertedCount;
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding subjects:', error);
    throw error;
  } finally {
    client.release();
  }
};

const assignFacultyToSubjects = async () => {
  const client = await pool.connect();
  
  try {
    console.log('👨‍🏫 Starting random faculty assignments...');
    
    await client.query('BEGIN');
    
    // Get all faculty
    const facultyResult = await client.query(
      'SELECT id, faculty_id, full_name FROM faculty_users WHERE is_active = TRUE'
    );
    
    const faculty = facultyResult.rows;
    
    if (faculty.length === 0) {
      console.log('⚠️  No faculty found in database. Please add faculty first.');
      return;
    }
    
    console.log(`Found ${faculty.length} active faculty members\n`);
    
    // Get all subjects
    const subjectsResult = await client.query(
      'SELECT id, subject_code, subject_name, semester, is_lab FROM subjects WHERE is_active = TRUE ORDER BY semester, subject_code'
    );
    
    const subjects = subjectsResult.rows;
    const academicYear = '2025-26';
    const sections = ['A', 'B'];
    
    // Clear existing assignments for this academic year
    await client.query('DELETE FROM faculty_subjects WHERE academic_year = $1', [academicYear]);
    
    let assignmentCount = 0;
    
    // Randomly assign faculty to subjects
    for (const subject of subjects) {
      // Each subject gets 1-2 faculty members (different sections)
      const numAssignments = Math.random() > 0.5 ? 2 : 1;
      
      for (let i = 0; i < numAssignments; i++) {
        // Randomly select a faculty member
        const randomFaculty = faculty[Math.floor(Math.random() * faculty.length)];
        const section = sections[i % sections.length];
        
        try {
          const query = `
            INSERT INTO faculty_subjects (faculty_id, subject_id, academic_year, section)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (faculty_id, subject_id, academic_year, section) DO NOTHING
            RETURNING id
          `;
          
          const result = await client.query(query, [
            randomFaculty.id,
            subject.id,
            academicYear,
            section
          ]);
          
          if (result.rows.length > 0) {
            assignmentCount++;
            console.log(
              `✅ Assigned: ${randomFaculty.full_name} → ${subject.subject_code} (${subject.subject_name}) - Section ${section}`
            );
          }
        } catch (error) {
          console.error(`❌ Error assigning ${subject.subject_code}:`, error.message);
        }
      }
    }
    
    await client.query('COMMIT');
    
    console.log(`\n📊 Assignment Summary:`);
    console.log(`   ✅ Total assignments created: ${assignmentCount}`);
    console.log(`   👨‍🏫 Faculty members: ${faculty.length}`);
    console.log(`   📚 Subjects assigned: ${subjects.length}`);
    console.log(`   📅 Academic Year: ${academicYear}\n`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error assigning faculty:', error);
    throw error;
  } finally {
    client.release();
  }
};

const displayAssignmentReport = async () => {
  const client = await pool.connect();
  
  try {
    console.log('📋 Faculty Assignment Report:\n');
    console.log('='.repeat(100));
    
    const query = `
      SELECT 
        f.full_name,
        f.designation,
        COUNT(DISTINCT fs.subject_id) as total_subjects,
        STRING_AGG(DISTINCT s.subject_code || ' (' || fs.section || ')', ', ' ORDER BY s.subject_code) as subjects
      FROM faculty_users f
      LEFT JOIN faculty_subjects fs ON f.id = fs.faculty_id
      LEFT JOIN subjects s ON fs.subject_id = s.id
      WHERE f.is_active = TRUE
      GROUP BY f.id, f.full_name, f.designation
      ORDER BY total_subjects DESC, f.full_name
    `;
    
    const result = await client.query(query);
    
    result.rows.forEach((row, index) => {
      console.log(`\n${index + 1}. ${row.full_name} (${row.designation})`);
      console.log(`   Total Subjects: ${row.total_subjects}`);
      if (row.subjects) {
        console.log(`   Assigned To: ${row.subjects}`);
      }
      console.log('-'.repeat(100));
    });
    
  } catch (error) {
    console.error('❌ Error generating report:', error);
  } finally {
    client.release();
  }
};

// Main execution
const main = async () => {
  try {
    console.log('\n' + '='.repeat(100));
    console.log('🎓 PESITM CSE Portal - Subject & Faculty Assignment Seeder');
    console.log('='.repeat(100) + '\n');
    
    // Step 1: Seed subjects
    await seedSubjects();
    
    // Step 2: Assign faculty to subjects
    await assignFacultyToSubjects();
    
    // Step 3: Display report
    await displayAssignmentReport();
    
    console.log('\n✅ All done! Database seeding completed successfully.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
};

// Run the script
main();
