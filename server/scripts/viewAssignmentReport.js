import pool from '../config/database.js';

const displayReport = async () => {
  const client = await pool.connect();
  
  try {
    console.log('\n📊 FACULTY ASSIGNMENT REPORT - Academic Year 2025-26\n');
    console.log('='.repeat(120));
    
    const query = `
      SELECT 
        f.full_name,
        f.designation,
        COUNT(fs.id) as total_assignments,
        STRING_AGG(s.subject_code, ', ' ORDER BY s.semester, s.subject_code) as subjects
      FROM faculty_users f
      LEFT JOIN faculty_subjects fs ON f.id = fs.faculty_id AND fs.academic_year = '2025-26'
      LEFT JOIN subjects s ON fs.subject_id = s.id
      WHERE f.is_active = TRUE
      GROUP BY f.id, f.full_name, f.designation
      ORDER BY total_assignments DESC, f.full_name
    `;
    
    const result = await client.query(query);
    
    result.rows.forEach((row, index) => {
      console.log(`\n${index + 1}. ${row.full_name}`);
      console.log(`   Designation: ${row.designation}`);
      console.log(`   Total Assignments: ${row.total_assignments}`);
      if (row.subjects) {
        console.log(`   Subjects: ${row.subjects}`);
      } else {
        console.log(`   Subjects: None assigned yet`);
      }
      console.log('-'.repeat(120));
    });
    
    // Summary statistics
    console.log('\n📈 SUMMARY STATISTICS:\n');
    
    const statsQuery = `
      SELECT 
        COUNT(DISTINCT s.id) as total_subjects,
        COUNT(DISTINCT CASE WHEN s.is_lab THEN s.id END) as lab_subjects,
        COUNT(DISTINCT CASE WHEN NOT s.is_lab THEN s.id END) as theory_subjects,
        COUNT(fs.id) as total_assignments,
        COUNT(DISTINCT f.id) as faculty_assigned
      FROM subjects s
      LEFT JOIN faculty_subjects fs ON s.id = fs.subject_id AND fs.academic_year = '2025-26'
      LEFT JOIN faculty_users f ON fs.faculty_id = f.id
      WHERE s.is_active = TRUE
    `;
    
    const stats = await client.query(statsQuery);
    const statsRow = stats.rows[0];
    
    console.log(`   📚 Total Subjects: ${statsRow.total_subjects}`);
    console.log(`   🧪 Lab Subjects: ${statsRow.lab_subjects}`);
    console.log(`   📖 Theory Subjects: ${statsRow.theory_subjects}`);
    console.log(`   ✅ Total Assignments: ${statsRow.total_assignments}`);
    console.log(`   👨‍🏫 Faculty with Assignments: ${statsRow.faculty_assigned}`);
    
    // Semester-wise distribution
    console.log('\n📅 SEMESTER-WISE SUBJECT DISTRIBUTION:\n');
    
    const semesterQuery = `
      SELECT 
        semester,
        COUNT(*) as subject_count,
        COUNT(CASE WHEN is_lab THEN 1 END) as labs,
        COUNT(CASE WHEN NOT is_lab THEN 1 END) as theory
      FROM subjects
      WHERE is_active = TRUE
      GROUP BY semester
      ORDER BY semester
    `;
    
    const semesterResult = await client.query(semesterQuery);
    
    semesterResult.rows.forEach(row => {
      console.log(`   Semester ${row.semester}: ${row.subject_count} subjects (Theory: ${row.theory}, Labs: ${row.labs})`);
    });
    
    console.log('\n' + '='.repeat(120) + '\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    client.release();
    process.exit(0);
  }
};

displayReport();
