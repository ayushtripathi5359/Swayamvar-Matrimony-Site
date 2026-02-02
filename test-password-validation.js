// Simple test to verify password validation works
import fetch from 'node-fetch';

const testPasswordValidation = async () => {
  const baseUrl = 'http://localhost:5002';
  
  console.log('Testing password validation...\n');
  
  // Test 1: Weak password (should fail)
  console.log('Test 1: Weak password');
  try {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test1@example.com',
        password: 'weak',
        profile: { firstName: 'Test', lastName: 'User' }
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    console.log('Expected: Should fail with validation error\n');
  } catch (error) {
    console.log('Error:', error.message, '\n');
  }
  
  // Test 2: Strong password (should succeed)
  console.log('Test 2: Strong password');
  try {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test2@example.com',
        password: 'StrongPass123!',
        profile: { firstName: 'Test', lastName: 'User' }
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data.success ? 'Success!' : data);
    console.log('Expected: Should succeed\n');
  } catch (error) {
    console.log('Error:', error.message, '\n');
  }
};

testPasswordValidation();