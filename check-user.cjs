const mongoose = require('mongoose');
require('dotenv').config();

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const User = require('./backend/models/User');

    const user = await User.findOne({ email: 'testuser@example.com' }).select('+password');
    if (user) {
      console.log('User found:', user.email);
      console.log('Password exists:', !!user.password);
      console.log('Password starts with hash:', user.password ? user.password.startsWith('$2') : false);
      console.log('Password length:', user.password ? user.password.length : 0);
      console.log('Auth provider:', user.authProvider);
      console.log('Password preview:', user.password ? user.password.substring(0, 20) + '...' : 'none');
    } else {
      console.log('User not found');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUser();