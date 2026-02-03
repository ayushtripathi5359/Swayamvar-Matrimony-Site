const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const Profile = require('../models/Profile');
const sendEmail = require('../utils/sendEmail');
const asyncHandler = require('../utils/asyncHandler');

// Generate JWT tokens
const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m'
  });
  
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
  });
  
  return { accessToken, refreshToken };
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const { accessToken, refreshToken } = generateTokens(user._id);
  
  // Save refresh token to user using findByIdAndUpdate to avoid triggering pre-save hook
  // This prevents issues with password field when user document doesn't have password loaded
  User.findByIdAndUpdate(user._id, {
    $push: {
      refreshTokens: {
        token: refreshToken,
        createdAt: new Date()
      }
    }
  }).exec().catch(err => {
    console.log('Error saving refresh token:', err.message);
  });
  
  // Create a clean copy of user object for response (don't modify original)
  const userResponse = user.toObject();
  delete userResponse.password;
  
  res.status(statusCode).json({
    success: true,
    accessToken,
    refreshToken,
    user: userResponse
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { email, password, profile } = req.body;

  // 1. Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'User exists' });

  // 2. Create INSTANCE (This puts the plain-text password into memory)
  const user = new User({
    email,
    password, // Plain text here, will be hashed by pre-save hook
    authProvider: 'local'
  });

  // 3. Set all additional fields on the instance BEFORE saving
  if (process.env.NODE_ENV === 'development') {
    user.isEmailVerified = true;
  } else {
    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  }

  // 4. SAVE ONCE. This triggers your pre-save debug logs and bcrypt hashing.
  await user.save(); 

  // 5. Create profile separately
  if (profile) {
    await Profile.create({ userId: user._id, ...profile, emailId: email });
  }

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  
  console.log('=== LOGIN DEBUG START ===');
  console.log('Login attempt for email:', email);
  console.log('Password provided:', password ? 'Yes' : 'No');
  console.log('Password length:', password ? password.length : 0);
  
  // Validate input
  if (!email || !password) {
    console.log('Login failed: Missing email or password');
    console.log('=== LOGIN DEBUG END ===');
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }
  
  // Check for user - MUST include .select('+password') because password has select: false
  const user = await User.findOne({ email }).select('+password');
  
  console.log('User found:', user ? 'Yes' : 'No');
  
  if (user) {
    console.log('User ID:', user._id);
    console.log('User has password field:', 'password' in user);
    console.log('Password from DB exists:', !!user.password);
    console.log('Password from DB length:', user.password ? user.password.length : 0);
    console.log('Auth provider:', user.authProvider);
    console.log('Password hash (first 30 chars):', user.password ? user.password.substring(0, 30) : 'N/A');
    console.log('Is email verified:', user.isEmailVerified);
    console.log('Login attempts:', user.loginAttempts);
    console.log('Is locked:', user.isLocked);
    
    // Test bcrypt manually for debugging
    if (user.password) {
      try {
        console.log('Testing bcrypt manually...');
        const bcrypt = require('bcryptjs');
        
        // Test with a known hash
        const testHash = await bcrypt.hash('test123', 12);
        console.log('Test hash created successfully:', testHash.substring(0, 20));
        
        // Compare with wrong password first
        const wrongCompare = await bcrypt.compare('wrongpassword', user.password);
        console.log('Wrong password comparison:', wrongCompare);
        
        // Compare with actual password
        console.log('Comparing actual password...');
        console.log('Plain text password:', password);
        console.log('Stored hash to compare with:', user.password.substring(0, 30));
        
        const directCompare = await bcrypt.compare(password, user.password);
        console.log('Direct bcrypt comparison result:', directCompare);
        
        // Also test the model method
        console.log('Testing model comparePassword method...');
        const modelCompare = await user.comparePassword(password);
        console.log('Model method comparison result:', modelCompare);
        
      } catch (bcryptError) {
        console.log('Bcrypt test error:', bcryptError.message);
      }
    }
  }
  
  if (!user) {
    console.log('Login failed: User not found');
    console.log('=== LOGIN DEBUG END ===');
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  // Check if account is locked
  if (user.isLocked) {
    console.log('Login failed: Account locked until:', user.lockUntil);
    console.log('=== LOGIN DEBUG END ===');
    return res.status(401).json({
      success: false,
      message: 'Account is temporarily locked due to multiple failed login attempts'
    });
  }
  
  // Check if user has a password (OAuth users might not)
  if (!user.password && user.authProvider === 'local') {
    console.log('Login failed: Local user has no password');
    console.log('=== LOGIN DEBUG END ===');
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  // Check password using model method
  console.log('Using model comparePassword method...');
  const isMatch = await user.comparePassword(password);
  console.log('Password comparison result:', isMatch);
  
  if (!isMatch) {
    console.log('Login failed: Password mismatch');
    await user.incLoginAttempts();
    console.log('=== LOGIN DEBUG END ===');
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  console.log('Login successful');
  console.log('=== LOGIN DEBUG END ===');
  
  // Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }
  
  // Update last login WITHOUT saving the entire user document
  // This avoids triggering the pre-save hook which could cause issues
  await User.findByIdAndUpdate(user._id, {
    lastLogin: new Date()
  });
  
  sendTokenResponse(user, 200, res);
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;
  
  if (refreshToken) {
    // Remove specific refresh token
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { refreshTokens: { token: refreshToken } }
    });
  } else {
    // Remove all refresh tokens (logout from all devices)
    await User.findByIdAndUpdate(req.user.id, {
      $set: { refreshTokens: [] }
    });
  }
  
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token is required'
    });
  }
  
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Get user and check if refresh token exists
    const user = await User.findById(decoded.id);
    
    if (!user || !user.refreshTokens.some(token => token.token === refreshToken)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
    
    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
    
    // Replace old refresh token with new one
    user.refreshTokens = user.refreshTokens.filter(token => token.token !== refreshToken);
    user.refreshTokens.push({
      token: newRefreshToken,
      createdAt: new Date()
    });
    await user.save();
    
    res.status(200).json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'No user found with that email address'
    });
  }
  
  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash token and set to resetPasswordToken field
  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Set expire
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  await user.save();
  
  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password?token=${resetToken}`;
  
  const message = `
    You are receiving this email because you (or someone else) has requested the reset of a password.
    
    Please click on the following link to reset your password:
    
    ${resetUrl}
    
    This link will expire in 10 minutes.
    
    If you did not request this, please ignore this email and your password will remain unchanged.
  `;
  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request - Swayamvar',
      message
    });
    
    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    console.log('Email sending failed:', error.message);
    
    // In development, provide the reset URL directly
    if (process.env.NODE_ENV === 'development') {
      res.status(200).json({
        success: true,
        message: 'Password reset requested. Email sending is disabled in development mode.',
        resetUrl: resetUrl,
        warning: 'Email could not be sent (development mode)'
      });
    } else {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      
      return next(new Error('Email could not be sent'));
    }
  }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.body.token)
    .digest('hex');
  
  const user = await User.findOne({
    passwordResetToken: resetPasswordToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  
  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token'
    });
  }
  
  // Set new password
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  
  await user.save();
  
  sendTokenResponse(user, 200, res);
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  
  // Check current password
  if (!(await user.comparePassword(req.body.currentPassword))) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }
  
  user.password = req.body.newPassword;
  await user.save();
  
  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const emailVerificationToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  
  const user = await User.findOne({
    emailVerificationToken,
    emailVerificationExpires: { $gt: Date.now() }
  });
  
  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired verification token'
    });
  }
  
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  
  await user.save();
  
  res.status(200).json({
    success: true,
    message: 'Email verified successfully'
  });
});

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'No user found with that email address'
    });
  }
  
  if (user.isEmailVerified) {
    return res.status(400).json({
      success: false,
      message: 'Email is already verified'
    });
  }
  
  // Generate new verification token
  const verificationToken = crypto.randomBytes(20).toString('hex');
  user.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  await user.save();
  
  // Create verification URL
  const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;
  
  const message = `
    Please verify your email address by clicking the link below:
    
    ${verificationUrl}
    
    This link will expire in 24 hours.
  `;
  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Verify Your Email Address - Swayamvar',
      message
    });
    
    res.status(200).json({
      success: true,
      message: 'Verification email sent'
    });
  } catch (error) {
    console.log('Email sending failed:', error.message);
    
    // In development, provide the verification URL directly
    if (process.env.NODE_ENV === 'development') {
      res.status(200).json({
        success: true,
        message: 'Verification requested. Email sending is disabled in development mode.',
        verificationUrl: verificationUrl,
        warning: 'Email could not be sent (development mode)'
      });
    } else {
      return next(new Error('Email could not be sent'));
    }
  }
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  // Fetch user's profile to get names
  const profile = await Profile.findOne({ userId: req.user.id });
  
  const userWithProfile = {
    ...user.toObject(),
    profile: profile ? {
      firstName: profile.firstName,
      middleName: profile.middleName,
      lastName: profile.lastName
    } : null
  };
  
  res.status(200).json({
    success: true,
    user: userWithProfile
  });
});

// @desc    Test password functionality (development only)
// @route   POST /api/auth/test-password
// @access  Public
const testPassword = asyncHandler(async (req, res, next) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({
      success: false,
      message: 'Not found'
    });
  }
  
  const { email, password } = req.body;
  
  console.log('=== PASSWORD TEST DEBUG START ===');
  console.log('Testing password for email:', email);
  console.log('Password to test:', password);
  
  try {
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('User not found');
      console.log('=== PASSWORD TEST DEBUG END ===');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    console.log('User found:', user._id);
    console.log('User has password field:', 'password' in user);
    console.log('Password exists:', !!user.password);
    console.log('Password length:', user.password ? user.password.length : 0);
    console.log('Password hash (first 30 chars):', user.password ? user.password.substring(0, 30) : 'N/A');
    
    // Test bcrypt directly
    const bcrypt = require('bcryptjs');
    
    // Create a test hash
    console.log('Creating test hash...');
    const testHash = await bcrypt.hash(password, 12);
    console.log('Test hash created:', testHash.substring(0, 30));
    
    // Compare with test hash
    const testCompare = await bcrypt.compare(password, testHash);
    console.log('Test hash comparison:', testCompare);
    
    // Compare with actual stored password
    if (user.password) {
      const actualCompare = await bcrypt.compare(password, user.password);
      console.log('Actual password comparison:', actualCompare);
      
      // Test model method
      const modelCompare = await user.comparePassword(password);
      console.log('Model method comparison:', modelCompare);
    }
    
    console.log('=== PASSWORD TEST DEBUG END ===');
    
    res.status(200).json({
      success: true,
      message: 'Password test completed',
      results: {
        userFound: true,
        hasPassword: !!user.password,
        passwordLength: user.password ? user.password.length : 0,
        testHashWorks: testCompare,
        actualPasswordWorks: user.password ? await bcrypt.compare(password, user.password) : false,
        modelMethodWorks: user.password ? await user.comparePassword(password) : false
      }
    });
    
  } catch (error) {
    console.log('Password test error:', error);
    console.log('=== PASSWORD TEST DEBUG END ===');
    
    res.status(500).json({
      success: false,
      message: 'Password test failed',
      error: error.message
    });
  }
});

// @desc    Google OAuth login
// @route   GET /api/auth/google
// @access  Public
const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
const googleCallback = asyncHandler(async (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err) {
      console.error('Google OAuth error:', err);
      return res.redirect(`${process.env.CORS_ORIGINS}/login`);
    }
    
    if (!user) {
      return res.redirect(`${process.env.CORS_ORIGINS}/login`);
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Save refresh token
    user.refreshTokens.push({
      token: refreshToken,
      createdAt: new Date()
    });
    user.lastLogin = new Date();
    user.save();
    
    // Redirect to frontend with tokens
    const redirectUrl = `${process.env.CORS_ORIGINS}/auth/callback?token=${accessToken}&refresh=${refreshToken}`;
    res.redirect(redirectUrl);
  })(req, res, next);
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  resendVerification,
  getMe,
  testPassword,
  googleAuth,
  googleCallback
};