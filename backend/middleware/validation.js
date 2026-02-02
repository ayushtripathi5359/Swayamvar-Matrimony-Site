const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation - minimal
const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required'),
  handleValidationErrors
];

// User login validation - minimal
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Profile creation/update validation - minimal (no strict validation)
const validateProfile = [
  // Just basic sanitization, no strict validation
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail(),
  body('emailId')
    .optional()
    .isEmail()
    .normalizeEmail(),
  handleValidationErrors
];

// Interest validation - minimal
const validateInterest = [
  body('receiverId')
    .isMongoId()
    .withMessage('Invalid receiver ID'),
  handleValidationErrors
];

// Search validation - minimal
const validateSearch = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  handleValidationErrors
];

// Password reset validation - minimal
const validatePasswordReset = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  handleValidationErrors
];

// New password validation - minimal
const validateNewPassword = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required'),
  handleValidationErrors
];

// Change password validation - minimal
const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 1 })
    .withMessage('New password is required'),
  handleValidationErrors
];

// MongoDB ObjectId validation
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName}`),
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateProfile,
  validateInterest,
  validateSearch,
  validatePasswordReset,
  validateNewPassword,
  validateChangePassword,
  validateObjectId,
  handleValidationErrors
};