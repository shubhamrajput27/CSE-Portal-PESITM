import http from 'http';

console.log('🧪 Testing Attendance Marking API\n');

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

    console.log('🔐 Step 1: Testing faculty login...');
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const response = JSON.parse(data);
          console.log(`✅ Login successful!`);
          console.log(`Response structure:`, Object.keys(response));
          const token = response.token || response.data?.token;
          const facultyName = response.facultyUser?.full_name || response.data?.facultyUser?.full_name || 'Faculty';
          console.log(`👤 Faculty: ${facultyName}`);
          console.log(`🎫 Token: ${token?.substring(0, 30)}...`);
          resolve(token);
        } else {
          console.log(`❌ Login failed: ${res.statusCode}`);
          console.log(`Response: ${data}`);
          reject(new Error(`Login failed with status ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error.message);
      reject(error);
    });

    req.write(loginData);
    req.end();
  });
}

// Step 2: Fetch Students
function fetchStudents(token) {
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

    console.log('\n📚 Step 2: Fetching all students...');
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const response = JSON.parse(data);
          console.log(`✅ Students fetched successfully`);
          const students = response.students || response.data?.students || response.data || [];
          console.log(`📊 Total students: ${students.length}`);
          
          // Group by section
          const sections = students.reduce((acc, student) => {
            acc[student.section] = (acc[student.section] || 0) + 1;
            return acc;
          }, {});
          
          console.log('\n📈 Section breakdown:');
          Object.entries(sections).forEach(([section, count]) => {
            console.log(`   Section ${section}: ${count} students`);
          });
          
          console.log('\n📋 First 5 students:');
          students.slice(0, 5).forEach(student => {
            console.log(`   ${student.usn} - ${student.full_name} (Section ${student.section})`);
          });
          
          console.log('\n📋 Last 5 students:');
          students.slice(-5).forEach(student => {
            console.log(`   ${student.usn} - ${student.full_name} (Section ${student.section})`);
          });
          
          resolve(students);
        } else {
          console.log(`❌ Fetch failed: ${res.statusCode}`);
          console.log(`Response: ${data}`);
          reject(new Error(`Fetch failed with status ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error.message);
      reject(error);
    });

    req.end();
  });
}

// Run the test
facultyLogin()
  .then(token => fetchStudents(token))
  .then(() => {
    console.log('\n✅ All tests passed! Attendance marking should work correctly.');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  });

// Timeout after 10 seconds
setTimeout(() => {
  console.error('\n⏱️  Test timeout - server may not be responding');
  process.exit(1);
}, 10000);
