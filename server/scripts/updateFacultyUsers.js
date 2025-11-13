import pool from '../config/database.js';
import bcrypt from 'bcrypt';

// Actual faculty data from Faculty page
const facultyData = [
  {
    faculty_id: 'FAC001',
    email: 'prasannakumar.hr@pestrust.edu.in',
    full_name: 'Dr. Prasanna Kumar HR',
    designation: 'Professor and Head',
    phone: '+91-9448123456',
    department: 'CSE'
  },
  {
    faculty_id: 'FAC002',
    email: 'manu.ap@pestrust.edu.in',
    full_name: 'Dr. Manu AP',
    designation: 'Professor',
    phone: '+91-9448234567',
    department: 'CSE'
  },
  {
    faculty_id: 'FAC003',
    email: 'chethan.ls@pestrust.edu.in',
    full_name: 'Dr. Chethan LS',
    designation: 'Professor',
    phone: '+91-9448345678',
    department: 'CSE'
  },
  {
    faculty_id: 'FAC004',
    email: 'sunilkumar.hr@pestrust.edu.in',
    full_name: 'Dr. Sunilkumar H R',
    designation: 'Assistant Professor',
    phone: '+91-9448456789',
    department: 'CSE'
  },
  {
    faculty_id: 'FAC005',
    email: 'raghavendra.k@pestrust.edu.in',
    full_name: 'Mr. Raghavendra K',
    designation: 'Assistant Professor',
    phone: '+91-9448567890',
    department: 'CSE'
  },
  {
    faculty_id: 'FAC006',
    email: 'prathibha.s@pestrust.edu.in',
    full_name: 'Mrs. Prathibha S',
    designation: 'Assistant Professor',
    phone: '+91-9448678901',
    department: 'CSE'
  },
  {
    faculty_id: 'FAC007',
    email: 'rajesh.th@pestrust.edu.in',
    full_name: 'Mr. Rajesh T H',
    designation: 'Assistant Professor',
    phone: '+91-9448789012',
    department: 'CSE'
  },
  {
    faculty_id: 'FAC008',
    email: 'sandeep.kh@pestrust.edu.in',
    full_name: 'Mr. Sandeep KH',
    designation: 'Assistant Professor',
    phone: '+91-9448890123',
    department: 'CSE'
  }
];

async function updateFacultyUsers() {
  try {
    console.log('🔄 Starting faculty users update...\n');

    // Default password for all faculty (they should change it after first login)
    const defaultPassword = 'faculty123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);

    for (const faculty of facultyData) {
      const { faculty_id, email, full_name, designation, phone, department } = faculty;

      // Check if faculty user already exists
      const checkQuery = 'SELECT * FROM faculty_users WHERE faculty_id = $1';
      const checkResult = await pool.query(checkQuery, [faculty_id]);

      if (checkResult.rows.length > 0) {
        // Update existing faculty user
        const updateQuery = `
          UPDATE faculty_users 
          SET email = $1, 
              full_name = $2, 
              designation = $3, 
              phone = $4,
              department = $5,
              updated_at = CURRENT_TIMESTAMP
          WHERE faculty_id = $6
        `;
        await pool.query(updateQuery, [email, full_name, designation, phone, department, faculty_id]);
        console.log(`✅ Updated: ${full_name} (${faculty_id})`);
      } else {
        // Insert new faculty user
        const insertQuery = `
          INSERT INTO faculty_users 
          (faculty_id, email, password_hash, full_name, designation, phone, department) 
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        await pool.query(insertQuery, [faculty_id, email, hashedPassword, full_name, designation, phone, department]);
        console.log(`✨ Created: ${full_name} (${faculty_id})`);
      }
    }

    console.log('\n✅ Faculty users update completed successfully!');
    console.log('\n📝 Faculty Login Credentials:');
    console.log('================================');
    facultyData.forEach(faculty => {
      console.log(`Faculty ID: ${faculty.faculty_id}`);
      console.log(`Name: ${faculty.full_name}`);
      console.log(`Email: ${faculty.email}`);
      console.log(`Password: ${defaultPassword}`);
      console.log('--------------------------------');
    });
    console.log('\n⚠️  IMPORTANT: Faculty members should change their passwords after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating faculty users:', error);
    process.exit(1);
  }
}

// Run the update
updateFacultyUsers();
