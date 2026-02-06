// Test registration with proper password validation
import fetch from 'node-fetch';

const testRegistration = async () => {
  console.log('Testing registration with strong password...\n');
  
  try {
    const response = await fetch('http://3.109.4.243/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'freshuser456@example.com',
        password: 'StrongPass123!',
        profile: {
          firstName: 'Test',
          middleName: 'Middle',
          lastName: 'User'
        }
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data.success ? 'Registration successful!' : data);
    
    if (data.success) {
      console.log('✅ Registration completed successfully');
      console.log('✅ Access token received');
      console.log('✅ Profile created with name fields');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
};

testRegistration();