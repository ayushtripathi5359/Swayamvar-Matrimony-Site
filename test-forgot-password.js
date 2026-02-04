// Test script for forgot password functionality
const API_BASE_URL = "http://localhost:5002";

async function testForgotPassword() {
  console.log("Testing Forgot Password functionality...");
  
  const testEmail = "test@example.com";
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: testEmail
      })
    });
    
    const data = await response.json();
    
    console.log("Response Status:", response.status);
    console.log("Response Data:", data);
    
    if (response.ok) {
      console.log("✅ Forgot password request successful");
    } else {
      console.log("❌ Forgot password request failed:", data.message);
    }
    
  } catch (error) {
    console.error("❌ Network error:", error.message);
  }
}

// Run the test if this file is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  testForgotPassword();
} else {
  // Browser environment
  console.log("Run testForgotPassword() in the browser console to test");
}