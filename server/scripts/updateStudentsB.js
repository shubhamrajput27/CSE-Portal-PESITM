import pool from '../config/database.js';
import bcrypt from 'bcrypt';

// Actual student data from 5th Semester B Section
const studentsData = [
  { usn: '4PM23CS067', name: 'NIDA KHANUM' },
  { usn: '4PM23CS068', name: 'NISHAN K H' },
  { usn: '4PM23CS069', name: 'NISHANTH M R' },
  { usn: '4PM23CS070', name: 'PALLETI PRADEEPA' },
  { usn: '4PM23CS071', name: 'PAVAN KUMAR' },
  { usn: '4PM23CS072', name: 'POOJA S' },
  { usn: '4PM23CS073', name: 'POORVIKA J GOWDA' },
  { usn: '4PM23CS074', name: 'PRACHI YADAV' },
  { usn: '4PM23CS075', name: 'PRAHLAD P PATIL' },
  { usn: '4PM23CS076', name: 'PRAJWAL K H' },
  { usn: '4PM23CS077', name: 'PRANATH K J' },
  { usn: '4PM23CS078', name: 'PRASHANTH C' },
  { usn: '4PM23CS079', name: 'PREMA R B' },
  { usn: '4PM23CS080', name: 'PRIYA R G' },
  { usn: '4PM23CS081', name: 'PUSHKAR RAJ PUROHIT' },
  { usn: '4PM23CS082', name: 'RACHANA D' },
  { usn: '4PM23CS083', name: 'RAKSHITHA RAMESH KURDEKAR' },
  { usn: '4PM23CS084', name: 'RATIYA VIJAYKUMAR KATTI' },
  { usn: '4PM23CS085', name: 'RANJITH T H' },
  { usn: '4PM23CS086', name: 'ROHITH D K' },
  { usn: '4PM23CS087', name: 'S B SINCHANA' },
  { usn: '4PM23CS088', name: 'S U GAYATRI' },
  { usn: '4PM23CS089', name: 'SAHANA H M' },
  { usn: '4PM23CS090', name: 'SAHANA PRABULINGAPPA KAJJERA' },
  { usn: '4PM23CS091', name: 'SAHANA R MIRAJAKAR' },
  { usn: '4PM23CS092', name: 'SAMARTHA B' },
  { usn: '4PM23CS093', name: 'SANJANA K KUBASADA' },
  { usn: '4PM23CS094', name: 'SANJAY A' },
  { usn: '4PM23CS095', name: 'SANKALPA V HEGDE' },
  { usn: '4PM23CS096', name: 'SATHVIK D' },
  { usn: '4PM23CS097', name: 'SHASHANK KUMAR G N' },
  { usn: '4PM23CS098', name: 'SHASHANK V S' },
  { usn: '4PM23CS099', name: 'SHIVAJI KULKARNI' },
  { usn: '4PM23CS101', name: 'SHUBHAM KUMAR SINGH' },
  { usn: '4PM23CS102', name: 'SMITHA SUBHASH ISARAGONDA' },
  { usn: '4PM23CS103', name: 'SNEHA T' },
  { usn: '4PM23CS104', name: 'SOMANATH MOTAGI' },
  { usn: '4PM23CS105', name: 'SOUMYA GURUPADAYYA HIREMATH' },
  { usn: '4PM23CS106', name: 'SOUMYA M GALABHI' },
  { usn: '4PM23CS107', name: 'SRUSHTI M V' },
  { usn: '4PM23CS108', name: 'SUHAS PATEL N' },
  { usn: '4PM23CS109', name: 'SUHASINI H PUJAR' },
  { usn: '4PM23CS110', name: 'SUSHMA MARUTI JADHAV' },
  { usn: '4PM23CS111', name: 'SWAYAM DATTATRAY' },
  { usn: '4PM23CS112', name: 'T A ANANTHA KRISHNA' },
  { usn: '4PM23CS113', name: 'THANUSHREE K H' },
  { usn: '4PM23CS114', name: 'THEJAS GOWDA H J' },
  { usn: '4PM23CS115', name: 'THRISHA A P' },
  { usn: '4PM23CS116', name: 'TRISHA VISHWANATH BALI' },
  { usn: '4PM23CS117', name: 'TUSHAR D G' },
  { usn: '4PM23CS119', name: 'VEDHA P TUMMINAKATTI' },
  { usn: '4PM23CS120', name: 'VEERENDRA K J' },
  { usn: '4PM23CS121', name: 'VIKAS NAIK' },
  { usn: '4PM23CS122', name: 'VIKAS U G' },
  { usn: '4PM23CS124', name: 'YELLAMMA BHAVANI' },
  { usn: '4PM23CS125', name: 'YUSRA SADIYAH SHAIKH' },
  { usn: '4PM23CS126', name: 'GUNAVATHI GR' },
  { usn: '4PM24CS403', name: 'MALLANNA RAJU KARU' },
  { usn: '4PM24CS404', name: 'MOHAMMED SHAKIR MADANI' },
  { usn: '4PM24CS405', name: 'NIKITHA HUBLIKAR' },
  { usn: '4PM24CS406', name: 'PAVAN G' },
  { usn: '4PM24CS407', name: 'RABIYA BASARI' },
  { usn: '4PM24CS408', name: 'SACHIN MALLAPPA ADI' },
  { usn: '4PM24CS409', name: 'SHRIDHAR K' },
  { usn: '4PM24CS410', name: 'TEJASWINI K S' },
  { usn: '4PM24CS411', name: 'VIGHNESH C' }
];

// Function to generate ID from USN
function generateIdFromUSN(usn) {
  // Extract year and number from USN format: 4PM23CS067 or 4PM24CS403
  const match = usn.match(/4PM(\d{2})CS(\d+)/);
  if (!match) {
    console.error(`❌ Invalid USN format: ${usn}`);
    return null;
  }
  
  const year = match[1]; // 23 or 24
  const number = parseInt(match[2]); // 067, 101, 403, 411, etc.
  
  // ID generation logic:
  // - 4PM23CS001-066 -> ID: 1-66 (A section, already in database)
  // - 4PM23CS067-126 -> ID: 67-126 (B section)
  // - 4PM24CS400-402 -> ID: 136-138 (A section, already in database)
  // - 4PM24CS403-411 -> ID: 127-135 (B section)
  if (year === '23') {
    return number; // Direct number: 4PM23CS067 -> ID: 67
  } else if (year === '24') {
    if (number >= 403) {
      // B section: 4PM24CS403-411
      return 127 + (number - 403); // 403->127, 404->128, ..., 411->135
    } else if (number >= 400 && number <= 402) {
      // A section: 4PM24CS400-402 (already in database)
      return 136 + (number - 400); // 400->136, 401->137, 402->138
    }
  }
  
  console.error(`❌ Unsupported year/number in USN: ${usn}`);
  return null;
}

async function updateStudentsB() {
  try {
    console.log('🔄 Starting students update for 5th Semester B Section...\n');

    // Default password for all students (they should change it after first login)
    const defaultPassword = 'student123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);

    let updatedCount = 0;
    let createdCount = 0;

    for (const student of studentsData) {
      const { usn, name } = student;
      
      // Generate ID from USN
      const id = generateIdFromUSN(usn);
      if (id === null) {
        console.error(`⚠️  Skipping student: ${name} (${usn}) - Invalid USN format`);
        continue;
      }
      
      // Generate student_id and email based on USN
      const student_id = usn.replace('4PM', '2023CSE');
      const email = `${usn.toLowerCase()}@pestrust.edu.in`;

      // Check if student already exists
      const checkQuery = 'SELECT * FROM students WHERE usn = $1';
      const checkResult = await pool.query(checkQuery, [usn]);

      if (checkResult.rows.length > 0) {
        // Update existing student
        const updateQuery = `
          UPDATE students 
          SET email = $1, 
              full_name = $2, 
              semester = $3,
              year = $4,
              department = $5,
              section = $6,
              updated_at = CURRENT_TIMESTAMP
          WHERE usn = $7
        `;
        await pool.query(updateQuery, [email, name, 5, '3rd Year', 'CSE', 'B', usn]);
        updatedCount++;
        console.log(`✅ Updated: ${name} (${usn}) - ID: ${id}`);
      } else {
        // Insert new student with explicit ID
        const insertQuery = `
          INSERT INTO students 
          (id, student_id, usn, email, password_hash, full_name, semester, year, department, section) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
        await pool.query(insertQuery, [id, student_id, usn, email, hashedPassword, name, 5, '3rd Year', 'CSE', 'B']);
        createdCount++;
        console.log(`✨ Created: ${name} (${usn}) - ID: ${id}`);
      }
    }

    console.log('\n✅ Students update completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Total Students: ${studentsData.length}`);
    console.log(`   - Created: ${createdCount}`);
    console.log(`   - Updated: ${updatedCount}`);
    console.log('\n📝 Student Login Information:');
    console.log('================================');
    console.log('Semester: 5th | Section: B');
    console.log('Default Password for all: student123');
    console.log('Email Format: usn@pestrust.edu.in');
    console.log('\nExample Login:');
    console.log('USN: 4PM23CS067');
    console.log('Password: student123');
    console.log('--------------------------------');
    console.log('\n⚠️  IMPORTANT: Students should change their passwords after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating students:', error);
    process.exit(1);
  }
}

// Run the update
updateStudentsB();
