import pool from '../config/database.js';
import bcrypt from 'bcrypt';

// Actual student data from 5th Semester A Section
const studentsData = [
  { usn: '4PM23CS001', name: 'ADARSH UMESH HEGDE' },
  { usn: '4PM23CS002', name: 'ADITYA KUMAR' },
  { usn: '4PM23CS003', name: 'AHMED SHAREEF' },
  { usn: '4PM23CS004', name: 'AISHWARYA K R' },
  { usn: '4PM23CS005', name: 'AISHWARYA LAXMI' },
  { usn: '4PM23CS006', name: 'AKASH' },
  { usn: '4PM23CS007', name: 'ALOK HAVANAGI' },
  { usn: '4PM23CS008', name: 'AMRUTHA R H' },
  { usn: '4PM23CS009', name: 'ANAND HOLI' },
  { usn: '4PM23CS010', name: 'ANANYA K JOIS' },
  { usn: '4PM23CS011', name: 'ANISH M' },
  { usn: '4PM23CS012', name: 'ANKITHA B' },
  { usn: '4PM23CS013', name: 'ANKITHA C' },
  { usn: '4PM23CS014', name: 'ANKITHA N B' },
  { usn: '4PM23CS015', name: 'ANUSHA H M' },
  { usn: '4PM23CS016', name: 'B M BHARATH KUMAR' },
  { usn: '4PM23CS017', name: 'BHARGAVI S R' },
  { usn: '4PM23CS018', name: 'BHAVYA G S' },
  { usn: '4PM23CS019', name: 'CHANDANA B' },
  { usn: '4PM23CS020', name: 'CHANDRAPPA IRAPPA BANNIHATTI' },
  { usn: '4PM23CS021', name: 'CHETAN R J' },
  { usn: '4PM23CS022', name: 'CHETAN SATYEPPA MAGADUM' },
  { usn: '4PM23CS023', name: 'CHINMAY S R' },
  { usn: '4PM23CS024', name: 'D R VIJAY' },
  { usn: '4PM23CS025', name: 'DASARI KEERTHAN DATTA' },
  { usn: '4PM23CS026', name: 'DEEKSHA J R' },
  { usn: '4PM23CS027', name: 'DHANYA P TIMALAPUR' },
  { usn: '4PM23CS028', name: 'DHRUVA PATEL H' },
  { usn: '4PM23CS029', name: 'DIVYA S K' },
  { usn: '4PM23CS030', name: 'DUTHI S M' },
  { usn: '4PM23CS031', name: 'G VARUN RAJU' },
  { usn: '4PM23CS032', name: 'GAGAN R BANGER' },
  { usn: '4PM23CS033', name: 'GAGANA J' },
  { usn: '4PM23CS034', name: 'GORAKATI CHAITANYA REDDY' },
  { usn: '4PM23CS035', name: 'GOWTHAM K' },
  { usn: '4PM23CS036', name: 'H GANESH' },
  { usn: '4PM23CS037', name: 'H N SPANDAN GOWDA' },
  { usn: '4PM23CS038', name: 'HARSHA D P' },
  { usn: '4PM23CS039', name: 'HARSHITHA B R' },
  { usn: '4PM23CS041', name: 'IMMANVEL J ABNES' },
  { usn: '4PM23CS042', name: 'IMRAN BAIG' },
  { usn: '4PM23CS043', name: 'JAYASURYA V' },
  { usn: '4PM23CS044', name: 'JEEVANA KRISHNAMOORTI NAIK' },
  { usn: '4PM23CS045', name: 'JYOTI ASHOK HINDI' },
  { usn: '4PM23CS046', name: 'K C ASHWINI' },
  { usn: '4PM23CS047', name: 'K N NANDITHA' },
  { usn: '4PM23CS048', name: 'KAVANA A' },
  { usn: '4PM23CS049', name: 'KONA VENKATA SRUJANA SREE' },
  { usn: '4PM23CS050', name: 'LIKITH S' },
  { usn: '4PM23CS051', name: 'LIKHITH GOWDA K N' },
  { usn: '4PM23CS052', name: 'LINGANAGOUDA SHADAKSHAR AGOUDA PATIL' },
  { usn: '4PM23CS053', name: 'M C BINDU RANI' },
  { usn: '4PM23CS054', name: 'MAHANTESHA U' },
  { usn: '4PM23CS055', name: 'MAHERA MUSKAN' },
  { usn: '4PM23CS056', name: 'MANASA M P' },
  { usn: '4PM23CS057', name: 'MANASA N C' },
  { usn: '4PM23CS058', name: 'MANDARA G N' },
  { usn: '4PM23CS059', name: 'MANSI H J' },
  { usn: '4PM23CS061', name: 'MD ZULKERNAIN KHAN' },
  { usn: '4PM23CS062', name: 'MOHAMMED MAAZ F' },
  { usn: '4PM23CS063', name: 'MOHAMMED SAIF KATTIMANI' },
  { usn: '4PM23CS064', name: 'MUBARAK KHAN' },
  { usn: '4PM23CS065', name: 'NANDAN S P' },
  { usn: '4PM23CS066', name: 'NANDINI HOSAMANI' },
  { usn: '4PM24CS400', name: 'A R VAISHNAVI' },
  { usn: '4PM24CS401', name: 'BHUVAN S' },
  { usn: '4PM24CS402', name: 'CHETHAN K C' }
];

// Function to generate ID from USN
function generateIdFromUSN(usn) {
  // Extract year and number from USN format: 4PM23CS001 or 4PM24CS400
  const match = usn.match(/4PM(\d{2})CS(\d+)/);
  if (!match) {
    console.error(`❌ Invalid USN format: ${usn}`);
    return null;
  }
  
  const year = match[1]; // 23 or 24
  const number = parseInt(match[2]); // 001, 067, 400, 403, etc.
  
  // ID generation logic:
  // - 4PM23CS001-126 -> ID: 1-126 (direct mapping)
  // - 4PM24CS400-402 -> ID: 136-138 (start after existing 4PM24CS403-411 which are 127-135)
  // - 4PM24CS403-411 -> ID: 127-135 (already in B section)
  if (year === '23') {
    return number; // Direct number: 4PM23CS001 -> ID: 1
  } else if (year === '24') {
    if (number >= 403) {
      // B section: 4PM24CS403-411
      return 127 + (number - 403); // 403->127, 404->128, ..., 411->135
    } else if (number >= 400 && number <= 402) {
      // A section: 4PM24CS400-402
      return 136 + (number - 400); // 400->136, 401->137, 402->138
    }
  }
  
  console.error(`❌ Unsupported year/number in USN: ${usn}`);
  return null;
}

async function updateStudentsA() {
  try {
    console.log('🔄 Starting students update for 5th Semester A Section...\n');

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
        await pool.query(updateQuery, [email, name, 5, '3rd Year', 'CSE', 'A', usn]);
        updatedCount++;
        console.log(`✅ Updated: ${name} (${usn}) - ID: ${id}`);
      } else {
        // Insert new student with explicit ID
        const insertQuery = `
          INSERT INTO students 
          (id, student_id, usn, email, password_hash, full_name, semester, year, department, section) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
        await pool.query(insertQuery, [id, student_id, usn, email, hashedPassword, name, 5, '3rd Year', 'CSE', 'A']);
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
    console.log('Semester: 5th | Section: A');
    console.log('Default Password for all: student123');
    console.log('Email Format: usn@pestrust.edu.in');
    console.log('\nExample Login:');
    console.log('USN: 4PM23CS001');
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
updateStudentsA();
