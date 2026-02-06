import fetch from 'node-fetch';

async function testProfileFetch() {
  try {
    console.log('Testing profile fetch...');
    
    // First, let's try to browse profiles to see what IDs exist
    const browseResponse = await fetch('http://3.109.4.243/api/profiles/browse?limit=5', {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Browse response status:', browseResponse.status);
    
    if (browseResponse.ok) {
      const browseData = await browseResponse.json();
      console.log('Browse profiles data:', JSON.stringify(browseData, null, 2));
      
      // If we have profiles, try to fetch the first one by ID
      if (browseData.profiles && browseData.profiles.length > 0) {
        const firstProfileId = browseData.profiles[0]._id;
        console.log('\nTrying to fetch profile by ID:', firstProfileId);
        
        const profileResponse = await fetch(`http://3.109.4.243/api/profiles/${firstProfileId}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log('Profile fetch response status:', profileResponse.status);
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log('Profile data:', JSON.stringify(profileData, null, 2));
        } else {
          const errorData = await profileResponse.text();
          console.log('Profile fetch error:', errorData);
        }
      }
    } else {
      const errorData = await browseResponse.text();
      console.log('Browse error:', errorData);
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testProfileFetch();