import http from 'http';

console.log('🧪 Testing Attendance Marking and Student View\n');

// Step 1: Faculty Login
function facultyLogin() {
  return new Promise((resolve, reject) => {
    const loginData = JSON.stringify({
      identifier: 'FAC001',
      password: 'faculty123'
    });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/faculty-auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
      }
    };

    console.log('🔐 Step 1: Faculty login...');
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const response = JSON.parse(data);
          const token = response.token || response.data?.token;
          console.log(`✅ Faculty login successful`);
          resolve(token);
        } else {
          reject(new Error(`Login failed: ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.write(loginData);
    req.end();
  });
}

// Step 2: Get Students
function getStudents(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/faculty/students',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    console.log('\n📚 Step 2: Fetching students...');
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const response = JSON.parse(data);
          const students = response.students || response.data || [];
          console.log(`✅ Fetched ${students.length} students`);
          resolve(students);
        } else {
          reject(new Error(`Fetch failed: ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Step 3: Mark Bulk Attendance
function markAttendance(token, students) {
  return new Promise((resolve, reject) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Mark first 5 students as present, next 3 as absent, rest present
    const attendanceRecords = students.map((student, idx) => ({
      student_id: student.id,
      status: idx < 5 ? 'present' : (idx < 8 ? 'absent' : 'present'),
      remarks: idx < 5 ? '' : (idx < 8 ? 'Absent today' : '')
    }));

    const requestData = JSON.stringify({
      subject_id: 1, // CS501 - Computer Networks
      date: today,
      period: 1,
      attendance_records: attendanceRecords
    });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/faculty/attendance/bulk',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': requestData.length
      }
    };

    console.log(`\n📝 Step 3: Marking attendance for ${students.length} students...`);
    console.log(`   Date: ${today}, Subject ID: 1, Period: 1`);
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 201 || res.statusCode === 200) {
          const response = JSON.parse(data);
          console.log(`✅ ${response.message}`);
          resolve({ date: today, studentId: students[0].id, usn: students[0].usn });
        } else {
          console.log(`❌ Failed: ${res.statusCode}`);
          console.log(`Response: ${data}`);
          reject(new Error(`Attendance marking failed: ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.write(requestData);
    req.end();
  });
}

// Step 4: Student Login
function studentLogin(usn) {
  return new Promise((resolve, reject) => {
    const loginData = JSON.stringify({
      identifier: usn,  // Changed from 'usn' to 'identifier'
      password: 'student123'
    });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/student/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
      }
    };

    console.log(`\n🔐 Step 4: Student login (${usn})...`);
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const response = JSON.parse(data);
          const token = response.token || response.data?.token;
          console.log(`✅ Student login successful`);
          resolve(token);
        } else {
          reject(new Error(`Student login failed: ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.write(loginData);
    req.end();
  });
}

// Step 5: Get Student's Attendance
function getStudentAttendance(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/student/attendance',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    console.log('\n📊 Step 5: Fetching student attendance...');
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const response = JSON.parse(data);
          const attendance = response.data || [];
          console.log(`✅ Found ${attendance.length} attendance record(s)`);
          
          if (attendance.length > 0) {
            console.log('\n📋 Attendance Details:');
            attendance.forEach((record, idx) => {
              console.log(`   ${idx + 1}. Date: ${record.attendance_date}, Status: ${record.status}, Subject: ${record.subject_code || 'N/A'}`);
            });
          }
          resolve(attendance);
        } else {
          console.log(`❌ Failed: ${res.statusCode}`);
          console.log(`Response: ${data}`);
          reject(new Error(`Get attendance failed: ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Run the full test
facultyLogin()
  .then(token => {
    return getStudents(token).then(students => ({ token, students }));
  })
  .then(({ token, students }) => {
    return markAttendance(token, students).then(result => ({ ...result, students }));
  })
  .then(({ studentId, usn, students }) => {
    return studentLogin(usn).then(token => ({ token, usn }));
  })
  .then(({ token, usn }) => {
    return getStudentAttendance(token);
  })
  .then((attendance) => {
    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL TESTS PASSED!');
    console.log('='.repeat(60));
    console.log('\n📌 Summary:');
    console.log('   ✓ Faculty can login');
    console.log('   ✓ Faculty can fetch students');
    console.log('   ✓ Faculty can mark attendance');
    console.log('   ✓ Student can login');
    console.log('   ✓ Student can view their attendance');
    console.log('\n🎉 Attendance system is working correctly!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Test failed:', error.message);
    console.error('\n💡 Check server logs for details');
    process.exit(1);
  });

// Timeout
setTimeout(() => {
  console.error('\n⏱️  Test timeout');
  process.exit(1);
}, 15000);
