const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5002';

async function testMyAcceptedInterests() {
  console.log('=== TESTING MY ACCEPTED INTERESTS FEATURE ===\n');

  try {
    // Test 1: Get sent interests with accepted status
    console.log('1. Testing sent interests with accepted status...');
    const acceptedResponse = await fetch(`${API_BASE}/api/interests/sent?status=accepted&limit=10`, {
      headers: {
        'Authorization': 'Bearer your-test-token-here', // You'll need a valid token
        'Content-Type': 'application/json'
      }
    });

    if (acceptedResponse.ok) {
      const acceptedData = await acceptedResponse.json();
      console.log('✅ My accepted interests retrieved successfully:');
      console.log(`Found ${acceptedData.interests?.length || 0} accepted interests`);
      
      if (acceptedData.interests && acceptedData.interests.length > 0) {
        acceptedData.interests.forEach((interest, index) => {
          console.log(`\nAccepted Interest ${index + 1}:`);
          console.log(`- Status: ${interest.status}`);
          console.log(`- Sent At: ${interest.sentAt}`);
          console.log(`- Accepted At: ${interest.respondedAt}`);
          console.log(`- Receiver: ${interest.receiverProfileId?.fullName || 'Unknown'}`);
          console.log(`- My Message: ${interest.message || 'No message'}`);
          console.log(`- Their Response: ${interest.responseMessage || 'No response message'}`);
        });
      } else {
        console.log('ℹ️  No accepted interests found. This means:');
        console.log('   - You haven\'t sent any interests yet, OR');
        console.log('   - No one has accepted your interests yet');
      }
    } else {
      console.log('❌ My accepted interests request failed:', acceptedResponse.status);
    }

    // Test 2: Get all sent interests for comparison
    console.log('\n2. Testing all sent interests for comparison...');
    const allSentResponse = await fetch(`${API_BASE}/api/interests/sent?limit=10`, {
      headers: {
        'Authorization': 'Bearer your-test-token-here', // You'll need a valid token
        'Content-Type': 'application/json'
      }
    });

    if (allSentResponse.ok) {
      const allSentData = await allSentResponse.json();
      console.log('✅ All sent interests retrieved successfully:');
      console.log(`Found ${allSentData.interests?.length || 0} total sent interests`);
      
      if (allSentData.interests && allSentData.interests.length > 0) {
        const statusCounts = allSentData.interests.reduce((acc, interest) => {
          acc[interest.status] = (acc[interest.status] || 0) + 1;
          return acc;
        }, {});
        
        console.log('\nStatus breakdown:');
        Object.entries(statusCounts).forEach(([status, count]) => {
          const emoji = {
            'sent': '⏳',
            'accepted': '✅',
            'declined': '❌',
            'withdrawn': '🔄'
          }[status] || '❓';
          console.log(`   ${emoji} ${status}: ${count}`);
        });
      }
    } else {
      console.log('❌ All sent interests request failed:', allSentResponse.status);
    }

    // Test 3: Get interest stats
    console.log('\n3. Testing interest statistics...');
    const statsResponse = await fetch(`${API_BASE}/api/interests/stats`, {
      headers: {
        'Authorization': 'Bearer your-test-token-here', // You'll need a valid token
        'Content-Type': 'application/json'
      }
    });

    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ Interest stats retrieved successfully:');
      console.log('Sent interests stats:', statsData.stats?.sent || 'No data');
      console.log('Received interests stats:', statsData.stats?.received || 'No data');
    } else {
      console.log('❌ Stats request failed:', statsResponse.status);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  console.log('\n=== MY ACCEPTED INTERESTS TEST COMPLETE ===');
  console.log('\n📋 How to use the new feature:');
  console.log('1. Go to the Inbox/Matches page');
  console.log('2. Click on the "💚 My Accepted" tab');
  console.log('3. You\'ll see all the people who accepted your interest requests');
  console.log('4. Each card will show:');
  console.log('   - Their profile information');
  console.log('   - When they accepted your request');
  console.log('   - Any response message they sent');
  console.log('   - Action buttons to view their profile or start chatting');
}

// Note: To run this test, you'll need to:
// 1. Have a user logged in and get their access token
// 2. Replace 'your-test-token-here' with the actual token
// 3. Make sure the backend server is running on port 5002

console.log('📝 To run this test:');
console.log('1. Login to get an access token');
console.log('2. Replace "your-test-token-here" with your actual token');
console.log('3. Run: node test-my-accepted-interests.js');
console.log('');

// Uncomment the line below to run the test
// testMyAcceptedInterests();