import http from 'http';

const API_URL = 'localhost';
const PORT = 5000;

function makeRequest(path, method, data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      hostname: API_URL,
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData && { 'Content-Length': Buffer.byteLength(postData) })
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

async function testStudentLogin() {
  console.log('\n🧪 Testing Student Login\n');
  console.log('='.repeat(60));

  try {
    // Test 1: Login with identifier
    console.log('\n📝 Test 1: Student login with identifier (USN)...');
    const loginResponse = await makeRequest('/api/student/login', 'POST', {
      identifier: '4PM23CS001',
      password: 'student123'
    });

    if (loginResponse.status === 200 && loginResponse.data.success) {
      console.log('✅ Login successful!');
      console.log(`   Student: ${loginResponse.data.data.student.full_name}`);
      console.log(`   USN: ${loginResponse.data.data.student.usn}`);
      console.log(`   Token: ${loginResponse.data.data.token.substring(0, 30)}...`);
      
    } else {
      console.log('❌ Login failed!');
      console.log('   Status:', loginResponse.status);
      console.log('   Response:', JSON.stringify(loginResponse.data, null, 2));
    }

    console.log('\n' + '='.repeat(60));
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('⚠️  Server is not running on port 5000');
    }
  }
}

testStudentLogin();
