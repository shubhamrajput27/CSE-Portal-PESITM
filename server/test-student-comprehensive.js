import http from 'http';

function makeRequest(path, method, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData && { 'Content-Length': Buffer.byteLength(postData) }),
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function comprehensiveStudentTest() {
  console.log('\n🎯 COMPREHENSIVE STUDENT LOGIN TEST\n');
  console.log('='.repeat(70));

  const testStudents = [
    { usn: '4PM23CS001', name: 'ADARSH UMESH HEGDE', section: 'A' },
    { usn: '4PM23CS067', name: 'NIDA KHANUM', section: 'B' },
    { usn: '4PM23CS101', name: 'SHUBHAM KUMAR SINGH', section: 'B' }
  ];

  let passedTests = 0;
  let totalTests = 0;

  for (const student of testStudents) {
    console.log(`\n📝 Testing student: ${student.name} (${student.usn})`);
    console.log('-'.repeat(70));

    try {
      // Test 1: Login
      totalTests++;
      console.log('\n1️⃣  Login test...');
      const loginResponse = await makeRequest('/api/student/login', 'POST', {
        identifier: student.usn,
        password: 'student123'
      });

      if (loginResponse.status === 200 && loginResponse.data.success) {
        console.log('   ✅ Login successful');
        console.log(`   📌 Token received: ${loginResponse.data.data.token.substring(0, 20)}...`);
        console.log(`   👤 Name: ${loginResponse.data.data.student.full_name}`);
        console.log(`   🎓 Section: ${loginResponse.data.data.student.section}`);
        passedTests++;

        const token = loginResponse.data.data.token;

        // Test 2: Get Profile
        totalTests++;
        console.log('\n2️⃣  Profile fetch test...');
        const profileResponse = await makeRequest('/api/student/profile', 'GET', null, token);

        if (profileResponse.status === 200 && profileResponse.data.success) {
          console.log('   ✅ Profile fetched successfully');
          console.log(`   📧 Email: ${profileResponse.data.data.student.email}`);
          console.log(`   📚 Semester: ${profileResponse.data.data.student.semester}`);
          passedTests++;
        } else {
          console.log('   ❌ Profile fetch failed');
          console.log(`   Status: ${profileResponse.status}`);
          console.log(`   Error: ${profileResponse.data.message}`);
        }

        // Test 3: Get Attendance
        totalTests++;
        console.log('\n3️⃣  Attendance fetch test...');
        const attendanceResponse = await makeRequest('/api/student/attendance', 'GET', null, token);

        if (attendanceResponse.status === 200) {
          console.log('   ✅ Attendance fetched successfully');
          if (attendanceResponse.data.data && attendanceResponse.data.data.length > 0) {
            console.log(`   📊 Records found: ${attendanceResponse.data.data.length}`);
          } else {
            console.log('   📊 No attendance records yet');
          }
          passedTests++;
        } else {
          console.log('   ❌ Attendance fetch failed');
          console.log(`   Status: ${attendanceResponse.status}`);
        }

      } else {
        console.log('   ❌ Login failed');
        console.log(`   Status: ${loginResponse.status}`);
        console.log(`   Response:`, JSON.stringify(loginResponse.data, null, 2));
      }

    } catch (error) {
      console.error('   ❌ Test error:', error.message);
    }
  }

  // Test 4: Invalid credentials
  totalTests++;
  console.log('\n\n📝 Testing invalid credentials...');
  console.log('-'.repeat(70));
  try {
    const invalidResponse = await makeRequest('/api/student/login', 'POST', {
      identifier: '4PM23CS001',
      password: 'wrongpassword'
    });

    if (invalidResponse.status === 401) {
      console.log('✅ Invalid credentials correctly rejected');
      passedTests++;
    } else {
      console.log('❌ Invalid credentials test failed - should return 401');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 TEST SUMMARY\n');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests} ✅`);
  console.log(`Failed: ${totalTests - passedTests} ❌`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! Student login system is fully functional.\n');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.\n');
  }

  console.log('='.repeat(70) + '\n');
}

comprehensiveStudentTest();
