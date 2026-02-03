import fetch from 'node-fetch';

async function testLogin() {
  try {
    console.log('Testing login functionality...');
    
    // Test with some common credentials
    const testCredentials = [
      { email: 'test@example.com', password: 'password123' },
      { email: 'admin@example.com', password: 'admin123' },
      { email: 'user@test.com', password: 'test123' }
    ];
    
    for (const creds of testCredentials) {
      console.log(`\nTesting login with: ${creds.email}`);
      
      const response = await fetch('http://localhost:5002/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(creds)
      });
      
      console.log(`Response status: ${response.status}`);
      
      const data = await response.text();
      console.log(`Response: ${data}`);
    }
    
    // Test registration to create a user
    console.log('\n--- Testing Registration ---');
    const newUser = {
      email: 'testuser@example.com',
      password: 'testpassword123',
      profile: {
        firstName: 'Test',
        lastName: 'User'
      }
    };
    
    const regResponse = await fetch('http://localhost:5002/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    });
    
    console.log(`Registration status: ${regResponse.status}`);
    const regData = await regResponse.text();
    console.log(`Registration response: ${regData}`);
    
    // Now test login with the new user
    if (regResponse.status === 201) {
      console.log('\n--- Testing Login with New User ---');
      const loginResponse = await fetch('http://localhost:5002/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password
        })
      });
      
      console.log(`Login status: ${loginResponse.status}`);
      const loginData = await loginResponse.text();
      console.log(`Login response: ${loginData}`);
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testLogin();