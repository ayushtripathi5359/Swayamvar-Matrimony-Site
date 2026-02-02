// Simple test to debug the password issue
import fetch from 'node-fetch';

const testSimple = async () => {
  console.log('Testing simple registration...\n');
  
  const payload = {
    email: 'finaltest@example.com',
    password: 'TestPass123!',
    profile: {
      firstName: 'Debug',
      lastName: 'User'
    }
  };
  
  console.log('Sending payload:', JSON.stringify(payload, null, 2));
  
  try {
    const response = await fetch('http://localhost:5002/api/auth/register', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));
    
    const text = await response.text();
    console.log('Response body:', text);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
};

testSimple();