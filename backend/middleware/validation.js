const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  console.log('=== VALIDATION MIDDLEWARE DEBUG ===');
  console.log('req.body before validation:', req.body);
  console.log('req.body.password:', req.body.password);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  
  console.log('req.body after validation:', req.body);
  console.log('req.body.password after validation:', req.body.password);
  console.log('=== VALIDATION MIDDLEWARE END ===');
  next();
};

// User registration validation
const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'),
  handleValidationErrors
];

// User login validation
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

// Profile creation/update validation
const validateProfile = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('middleName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Middle name cannot exceed 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('gender')
    .isIn(['Male', 'Female'])
    .withMessage('Gender must be Male or Female'),
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18 || age > 80) {
        throw new Error('Age must be between 18 and 80 years');
      }
      return true;
    }),
  body('maritalStatus')
    .isIn(['Unmarried', 'Divorced', 'Separated', 'Widowed'])
    .withMessage('Invalid marital status'),
  body('motherTongue')
    .trim()
    .notEmpty()
    .withMessage('Mother tongue is required'),
  body('height')
    .trim()
    .notEmpty()
    .withMessage('Height is required'),
  body('complexion')
    .isIn(['Very Fair', 'Fair', 'Wheatish', 'Dark'])
    .withMessage('Invalid complexion'),
  body('bloodGroup')
    .isIn(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
    .withMessage('Invalid blood group'),
  body('whatsappNumber')
    .notEmpty()
    .withMessage('WhatsApp number is required')
    .custom((value, { req }) => {
      const countryCode = req.body.countryCode || '+91';
      const countryCodes = [
        { code: '+91', pattern: /^[6-9]\d{9}$/, length: 10 },
        { code: '+1', pattern: /^\d{10}$/, length: 10 },
        { code: '+44', pattern: /^\d{10,11}$/, length: [10, 11] },
        { code: '+61', pattern: /^[2-9]\d{8}$/, length: 9 },
        { code: '+81', pattern: /^[7-9]\d{9}$/, length: 10 },
        { code: '+49', pattern: /^\d{10,12}$/, length: [10, 12] },
        { code: '+33', pattern: /^[1-9]\d{8}$/, length: 9 },
        { code: '+86', pattern: /^1[3-9]\d{9}$/, length: 11 },
        { code: '+7', pattern: /^9\d{9}$/, length: 10 },
        { code: '+55', pattern: /^[1-9]\d{10}$/, length: 11 },
        { code: '+27', pattern: /^[1-9]\d{8}$/, length: 9 },
        { code: '+971', pattern: /^5[0-9]\d{7}$/, length: 9 },
        { code: '+65', pattern: /^[89]\d{7}$/, length: 8 },
        { code: '+60', pattern: /^1[0-9]\d{7,8}$/, length: [9, 10] },
        { code: '+66', pattern: /^[689]\d{8}$/, length: 9 },
      ];
      
      const country = countryCodes.find(c => c.code === countryCode);
      if (!country) {
        throw new Error('Invalid country code');
      }
      
      const cleanPhone = value.replace(/\D/g, '');
      
      // Check length
      if (Array.isArray(country.length)) {
        if (!country.length.includes(cleanPhone.length)) {
          throw new Error(`Phone number must be ${country.length[0]}-${country.length[country.length.length - 1]} digits`);
        }
      } else {
        if (cleanPhone.length !== country.length) {
          throw new Error(`Phone number must be ${country.length} digits`);
        }
      }
      
      // Check pattern
      if (!country.pattern.test(cleanPhone)) {
        throw new Error('Invalid phone number format for selected country');
      }
      
      return true;
    }),
  body('countryCode')
    .notEmpty()
    .withMessage('Country code is required')
    .isIn(['+91', '+1', '+44', '+61', '+81', '+49', '+33', '+86', '+7', '+55', '+27', '+971', '+65', '+60', '+66'])
    .withMessage('Invalid country code'),
  body('emailId')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  // Social media URL validation
  body('linkedinHandle')
    .optional()
    .custom((value) => {
      if (!value) return true; // Allow empty
      const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/(in|pub|profile)\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+$/;
      if (!linkedinRegex.test(value)) {
        throw new Error('Please provide a valid LinkedIn profile URL');
      }
      return true;
    }),
  body('instagramHandle')
    .optional()
    .custom((value) => {
      if (!value) return true; // Allow empty
      const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+$/;
      if (!instagramRegex.test(value)) {
        throw new Error('Please provide a valid Instagram profile URL');
      }
      return true;
    }),
  body('facebookHandle')
    .optional()
    .custom((value) => {
      if (!value) return true; // Allow empty
      const facebookRegex = /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+$/;
      if (!facebookRegex.test(value)) {
        throw new Error('Please provide a valid Facebook profile URL');
      }
      return true;
    }),
  // At least one social media profile is required
  body()
    .custom((value, { req }) => {
      const { linkedinHandle, instagramHandle, facebookHandle } = req.body;
      const hasSocialMedia = linkedinHandle?.trim() || instagramHandle?.trim() || facebookHandle?.trim();
      if (!hasSocialMedia) {
        throw new Error('At least one social media profile is required');
      }
      return true;
    }),
  body('fathersFullName')
    .trim()
    .notEmpty()
    .withMessage('Father\'s name is required'),
  body('fathersOccupation')
    .trim()
    .notEmpty()
    .withMessage('Father\'s occupation is required'),
  body('mothersFullName')
    .trim()
    .notEmpty()
    .withMessage('Mother\'s name is required'),
  body('mothersOccupation')
    .trim()
    .notEmpty()
    .withMessage('Mother\'s occupation is required'),
  // Gotra validation - both required
  body('firstGotra')
    .notEmpty()
    .withMessage('First gotra is required'),
  body('secondGotra')
    .notEmpty()
    .withMessage('Second gotra is required'),
  // Partner qualification validation - max 4 items
  body('partnerQualification')
    .optional()
    .isArray({ max: 4 })
    .withMessage('Maximum 4 partner qualifications allowed'),
  body('partnerQualification.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Each qualification must be between 1 and 100 characters'),
  // Preferred location validation
  body('preferredLocation')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one preferred location is required'),
  body('preferredLocation.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Each location must be between 1 and 100 characters'),
  // Address validation
  body('currentAddressLine1')
    .trim()
    .notEmpty()
    .withMessage('Current address line 1 is required')
    .isLength({ max: 100 })
    .withMessage('Address line 1 cannot exceed 100 characters'),
  body('currentAddressLine2')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Address line 2 cannot exceed 100 characters'),
  body('currentCity')
    .trim()
    .notEmpty()
    .withMessage('Current city is required')
    .isLength({ max: 50 })
    .withMessage('City name cannot exceed 50 characters'),
  body('currentState')
    .trim()
    .notEmpty()
    .withMessage('Current state is required')
    .isLength({ max: 50 })
    .withMessage('State name cannot exceed 50 characters'),
  body('currentPincode')
    .matches(/^\d{6}$/)
    .withMessage('Current pincode must be exactly 6 digits'),
  body('permanentAddressLine1')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Permanent address line 1 cannot exceed 100 characters'),
  body('permanentAddressLine2')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Permanent address line 2 cannot exceed 100 characters'),
  body('permanentCity')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Permanent city name cannot exceed 50 characters'),
  body('permanentState')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Permanent state name cannot exceed 50 characters'),
  body('permanentPincode')
    .optional()
    .matches(/^\d{6}$/)
    .withMessage('Permanent pincode must be exactly 6 digits'),
  body('sameAsPermanentAddress')
    .optional()
    .isBoolean()
    .withMessage('Same as permanent address must be a boolean'),
  handleValidationErrors
];

// Interest validation
const validateInterest = [
  body('receiverId')
    .isMongoId()
    .withMessage('Invalid receiver ID'),
  body('message')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters'),
  handleValidationErrors
];

// Search validation
const validateSearch = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('ageFrom')
    .optional()
    .isInt({ min: 18, max: 80 })
    .withMessage('Age from must be between 18 and 80'),
  query('ageTo')
    .optional()
    .isInt({ min: 18, max: 80 })
    .withMessage('Age to must be between 18 and 80'),
  handleValidationErrors
];

// Password reset validation
const validatePasswordReset = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  handleValidationErrors
];

// New password validation
const validateNewPassword = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'),
  handleValidationErrors
];

// Change password validation
const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'),
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