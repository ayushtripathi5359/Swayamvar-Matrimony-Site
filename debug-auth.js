import fetch from 'node-fetch';

const BASE_URL = 'http://3.109.4.243/api/auth';

async function debugAuthentication() {
  console.log('=== AUTHENTICATION DEBUG SCRIPT ===\n');
  
  try {
    // Test 1: Register a new user
    console.log('1. Testing Registration...');
    const testUser = {
      email: `test${Date.now()}@example.com`,
      password: 'TestPassword123',
      profile: {
        firstName: 'Test',
        lastName: 'User'
      }
    };
    
    console.log(`Registering user: ${testUser.email}`);
    console.log(`Password: ${testUser.password}`);
    
    const regResponse = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });
    
    console.log(`Registration Status: ${regResponse.status}`);
    const regData = await regResponse.json();
    console.log('Registration Response:', JSON.stringify(regData, null, 2));
    
    if (regResponse.status !== 201) {
      console.log('Registration failed, stopping tests');
      return;
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 2: Test password functionality
    console.log('2. Testing Password Functionality...');
    
    const passwordTestResponse = await fetch(`${BASE_URL}/test-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    console.log(`Password Test Status: ${passwordTestResponse.status}`);
    const passwordTestData = await passwordTestResponse.json();
    console.log('Password Test Response:', JSON.stringify(passwordTestData, null, 2));
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 3: Try to login
    console.log('3. Testing Login...');
    
    const loginResponse = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    console.log(`Login Status: ${loginResponse.status}`);
    const loginData = await loginResponse.json();
    console.log('Login Response:', JSON.stringify(loginData, null, 2));
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 4: Try login with wrong password
    console.log('4. Testing Login with Wrong Password...');
    
    const wrongLoginResponse = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testUser.email,
        password: 'WrongPassword123'
      })
    });
    
    console.log(`Wrong Password Login Status: ${wrongLoginResponse.status}`);
    const wrongLoginData = await wrongLoginResponse.json();
    console.log('Wrong Password Login Response:', JSON.stringify(wrongLoginData, null, 2));
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 5: Try login with non-existent user
    console.log('5. Testing Login with Non-existent User...');
    
    const noUserResponse = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'SomePassword123'
      })
    });
    
    console.log(`Non-existent User Login Status: ${noUserResponse.status}`);
    const noUserData = await noUserResponse.json();
    console.log('Non-existent User Login Response:', JSON.stringify(noUserData, null, 2));
    
  } catch (error) {
    console.error('Debug script error:', error);
  }
  
  console.log('\n=== DEBUG SCRIPT COMPLETE ===');
}

// Run the debug script
debugAuthentication();