const express = require('express');
const {
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
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  validateRegistration,
  validateLogin,
  validatePasswordReset,
  validateNewPassword,
  validateChangePassword
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', validateLogin, login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', validatePasswordReset, forgotPassword);
router.put('/reset-password', validateNewPassword, resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerification);

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// Protected routes
router.use(protect); // All routes after this middleware are protected

router.get('/me', getMe);
router.post('/logout', logout);
router.put('/change-password', validateChangePassword, changePassword);

module.exports = router;