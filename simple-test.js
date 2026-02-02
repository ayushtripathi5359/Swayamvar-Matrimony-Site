// Simple test for password validation
import fetch from 'node-fetch';

const testValidation = async () => {
  try {
    const response = await fetch('http://localhost:5002/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'StrongPass123!'
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }
};

testValidation();