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

async function testAdminManagement() {
  console.log('\n🎯 ADMIN MANAGEMENT API TEST\n');
  console.log('='.repeat(70));

  let adminToken = null;

  try {
    // Step 1: Admin Login
    console.log('\n📝 Step 1: Admin Login...');
    const loginResponse = await makeRequest('/api/admin/login', 'POST', {
      username: 'admin',
      password: 'admin123'
    });

    if (loginResponse.status === 200 && loginResponse.data.success) {
      adminToken = loginResponse.data.data.token;
      console.log('✅ Admin login successful');
      console.log(`   Token: ${adminToken.substring(0, 30)}...`);
    } else {
      console.log('❌ Admin login failed:', loginResponse.data.message);
      return;
    }

    // Step 2: Get All Faculty
    console.log('\n📝 Step 2: Fetching all faculty...');
    const facultyResponse = await makeRequest('/api/admin/faculty', 'GET', null, adminToken);

    if (facultyResponse.status === 200) {
      console.log(`✅ Fetched ${facultyResponse.data.count} faculty members`);
      if (facultyResponse.data.data && facultyResponse.data.data.faculty && facultyResponse.data.data.faculty.length > 0) {
        const firstFaculty = facultyResponse.data.data.faculty[0];
        console.log(`   First faculty: ${firstFaculty.full_name} (${firstFaculty.faculty_id})`);
      }
    } else {
      console.log('❌ Failed to fetch faculty');
      console.log('   Response:', JSON.stringify(facultyResponse.data, null, 2));
    }

    // Step 3: Get All Students
    console.log('\n📝 Step 3: Fetching all students...');
    const studentsResponse = await makeRequest('/api/admin/students', 'GET', null, adminToken);

    if (studentsResponse.status === 200) {
      console.log(`✅ Fetched ${studentsResponse.data.count} students`);
      if (studentsResponse.data.data.students.length > 0) {
        const firstStudent = studentsResponse.data.data.students[0];
        console.log(`   First student: ${firstStudent.full_name} (${firstStudent.usn})`);
      }
    } else {
      console.log('❌ Failed to fetch students');
    }

    // Step 4: Filter Students by Section
    console.log('\n📝 Step 4: Filtering students by section A...');
    const sectionResponse = await makeRequest('/api/admin/students?section=A', 'GET', null, adminToken);

    if (sectionResponse.status === 200) {
      console.log(`✅ Found ${sectionResponse.data.count} students in Section A`);
    } else {
      console.log('❌ Failed to filter students');
    }

    // Step 5: Update Faculty (if faculty exists)
    if (facultyResponse.data.data.faculty.length > 0) {
      const facultyId = facultyResponse.data.data.faculty[0].id;
      console.log('\n📝 Step 5: Updating faculty information...');
      
      const updateResponse = await makeRequest(
        `/api/admin/faculty/${facultyId}`, 
        'PUT', 
        { phone: '9876543210' },
        adminToken
      );

      if (updateResponse.status === 200) {
        console.log('✅ Faculty updated successfully');
      } else {
        console.log('❌ Failed to update faculty:', updateResponse.data.message);
      }
    }

    // Step 6: Update Student (if student exists)
    if (studentsResponse.data.data.students.length > 0) {
      const studentId = studentsResponse.data.data.students[0].id;
      console.log('\n📝 Step 6: Updating student information...');
      
      const updateResponse = await makeRequest(
        `/api/admin/students/${studentId}`, 
        'PUT', 
        { phone: '9123456780' },
        adminToken
      );

      if (updateResponse.status === 200) {
        console.log('✅ Student updated successfully');
      } else {
        console.log('❌ Failed to update student:', updateResponse.data.message);
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('\n✅ ADMIN MANAGEMENT API TEST COMPLETED\n');

  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('⚠️  Server is not running on port 5000');
    }
  }
}

testAdminManagement();
