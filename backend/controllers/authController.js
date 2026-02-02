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
  
  // Save refresh token to user
  user.refreshTokens.push({
    token: refreshToken,
    createdAt: new Date()
  });
  user.save();
  
  // Remove password from output
  user.password = undefined;
  
  res.status(statusCode).json({
    success: true,
    accessToken,
    refreshToken,
    user
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
  const { email, password, profile } = req.body;
  
  // Create user
  const user = await User.create({
    email,
    password,
    authProvider: 'local'
  });
  
  // Create basic profile if profile data is provided
  if (profile && (profile.firstName || profile.lastName)) {
    try {
      await Profile.create({
        userId: user._id,
        firstName: profile.firstName || '',
        middleName: profile.middleName || '',
        lastName: profile.lastName || '',
        emailId: email
      });
    } catch (profileError) {
      console.log('Profile creation failed during registration:', profileError.message);
      // Continue with user registration even if profile creation fails
    }
  }
  
  // Generate email verification token
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
    Welcome to Swayamvar! Please verify your email address by clicking the link below:
    
    ${verificationUrl}
    
    This link will expire in 24 hours.
    
    If you did not create an account, please ignore this email.
  `;
  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Verify Your Email Address - Swayamvar',
      message
    });
    
    // Send token response for immediate authentication
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.log('Email sending failed:', error.message);
    
    // In development, allow registration to succeed even if email fails
    if (process.env.NODE_ENV === 'development') {
      // Send token response for immediate authentication
      sendTokenResponse(user, 201, res);
    } else {
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();
      
      return next(new Error('Email could not be sent'));
    }
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  
  // Check for user
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  // Check if account is locked
  if (user.isLocked) {
    return res.status(401).json({
      success: false,
      message: 'Account is temporarily locked due to multiple failed login attempts'
    });
  }
  
  // Check password
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    await user.incLoginAttempts();
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  // Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }
  
  // Update last login
  user.lastLogin = new Date();
  await user.save();
  
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
  
  res.status(200).json({
    success: true,
    user
  });
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
  googleAuth,
  googleCallback
};