const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Basic Information
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  middleName: {
    type: String,
    trim: true,
    maxlength: [50, 'Middle name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female']
  },
  dateOfBirth: {
    type: Date
  },
  age: {
    type: String
  },
  maritalStatus: {
    type: String,
    enum: ['Unmarried', 'Divorced', 'Separated', 'Widowed']
  },
  motherTongue: {
    type: String
  },
  height: {
    type: String
  },
  complexion: {
    type: String,
    enum: ['Very Fair', 'Fair', 'Wheatish', 'Dark']
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
  },
  aboutMe: {
    type: String,
    maxlength: [200, 'About me cannot exceed 200 characters']
  },
  
  // Address Information
  currentAddressLine1: {
    type: String,
    trim: true,
    maxlength: [100, 'Address line 1 cannot exceed 100 characters']
  },
  currentAddressLine2: {
    type: String,
    trim: true,
    maxlength: [100, 'Address line 2 cannot exceed 100 characters']
  },
  currentCity: {
    type: String,
    trim: true,
    maxlength: [50, 'City name cannot exceed 50 characters']
  },
  currentState: {
    type: String,
    trim: true,
    maxlength: [50, 'State name cannot exceed 50 characters']
  },
  currentPincode: {
    type: String,
    match: [/^\d{6}$/, 'Pincode must be exactly 6 digits']
  },
  permanentAddressLine1: {
    type: String,
    trim: true,
    maxlength: [100, 'Address line 1 cannot exceed 100 characters']
  },
  permanentAddressLine2: {
    type: String,
    trim: true,
    maxlength: [100, 'Address line 2 cannot exceed 100 characters']
  },
  permanentCity: {
    type: String,
    trim: true,
    maxlength: [50, 'City name cannot exceed 50 characters']
  },
  permanentState: {
    type: String,
    trim: true,
    maxlength: [50, 'State name cannot exceed 50 characters']
  },
  permanentPincode: {
    type: String,
    match: [/^\d{6}$/, 'Pincode must be exactly 6 digits']
  },
  sameAsPermanentAddress: {
    type: Boolean,
    default: false
  },
  
  // Contact Information
  whatsappNumber: {
    type: String
  },
  countryCode: {
    type: String,
    default: '+91'
  },
  emailId: {
    type: String,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  linkedinHandle: String,
  instagramHandle: String,
  facebookHandle: String,
  
  // Education & Career
  education: {
    type: String
  },
  collegeUniversity: String,
  occupation: {
    type: String
  },
  organization: String,
  designation: String,
  currentEducation: String,
  annualIncome: String,
  jobLocation: String,
  
  // Family Details
  fathersFullName: {
    type: String
  },
  fathersOccupation: {
    type: String
  },
  fathersBusinessName: String,
  fathersBusinessLocation: String,
  fathersDesignation: String,
  fathersCompanyName: String,
  fathersWhatsappNumber: String,
  fathersCountryCode: {
    type: String,
    default: '+91'
  },
  
  mothersFullName: {
    type: String
  },
  mothersOccupation: {
    type: String
  },
  mothersBusinessName: String,
  mothersBusinessLocation: String,
  mothersDesignation: String,
  mothersCompanyName: String,
  mothersWhatsappNumber: String,
  mothersCountryCode: {
    type: String,
    default: '+91'
  },
  
  brothers: [{
    name: String,
    maritalStatus: String,
    occupation: String,
    spouseName: String,
    businessName: String,
    businessLocation: String,
    designation: String,
    companyName: String,
    currentEducation: String
  }],
  
  sisters: [{
    name: String,
    maritalStatus: String,
    occupation: String,
    spouseName: String,
    businessName: String,
    businessLocation: String,
    designation: String,
    companyName: String,
    currentEducation: String
  }],
  
  // Kundali Details
  birthName: String,
  birthTime: String,
  birthPlace: String,
  firstGotra: {
    type: String
  },
  secondGotra: {
    type: String
  },
  
  // Partner Preferences
  partnerAgeFrom: String,
  partnerAgeTo: String,
  partnerQualification: [String],
  preferredLocation: [String],
  minAnnualIncome: String,
  
  // Photos
  photos: {
    profilePhoto: {
      url: String,
      publicId: String
    },
    // Keep legacy fields for backward compatibility
    western: {
      url: String,
      publicId: String
    },
    traditional: {
      url: String,
      publicId: String
    }
  },
  
  // Profile Status
  isComplete: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationNotes: String,
  
  // Privacy Settings
  privacySettings: {
    showContactInfo: {
      type: String,
      enum: ['everyone', 'premium-members', 'accepted-interests'],
      default: 'accepted-interests'
    },
    showPhotos: {
      type: String,
      enum: ['everyone', 'premium-members', 'accepted-interests'],
      default: 'premium-members'
    },
    allowMessages: {
      type: String,
      enum: ['everyone', 'premium-members', 'verified-profiles'],
      default: 'premium-members'
    }
  },
  
  // Analytics
  profileViews: {
    type: Number,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  
  // Search optimization
  searchKeywords: [String]
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculated age
profileSchema.virtual('calculatedAge').get(function() {
  if (!this.dateOfBirth) return null;
  
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual for full name (backward compatibility)
profileSchema.virtual('fullName').get(function() {
  const parts = [this.firstName, this.middleName, this.lastName].filter(Boolean);
  return parts.join(' ');
});

// Indexes for search optimization
profileSchema.index({ userId: 1 }, { unique: true });
profileSchema.index({ gender: 1, maritalStatus: 1 });
profileSchema.index({ 'calculatedAge': 1 });
profileSchema.index({ occupation: 1 });
profileSchema.index({ motherTongue: 1 });
profileSchema.index({ isComplete: 1, isVerified: 1 });
profileSchema.index({ lastActive: -1 });
profileSchema.index({ searchKeywords: 1 });

// Text index for search
profileSchema.index({
  fullName: 'text',
  occupation: 'text',
  jobLocation: 'text',
  aboutMe: 'text'
});

// Pre-save middleware to update search keywords
profileSchema.pre('save', function(next) {
  // Generate search keywords
  const keywords = [];
  
  if (this.fullName) keywords.push(...this.fullName.toLowerCase().split(' '));
  if (this.occupation) keywords.push(this.occupation.toLowerCase());
  if (this.jobLocation) keywords.push(this.jobLocation.toLowerCase());
  if (this.motherTongue) keywords.push(this.motherTongue.toLowerCase());
  if (this.education) keywords.push(this.education.toLowerCase());
  
  this.searchKeywords = [...new Set(keywords)]; // Remove duplicates
  
  // Update lastActive
  this.lastActive = new Date();
  
  next();
});

// Method to check if profile is complete
profileSchema.methods.checkCompleteness = function() {
  const requiredFields = [
    'firstName', 'lastName', 'gender', 'dateOfBirth', 'maritalStatus', 
    'motherTongue', 'height', 'complexion', 'bloodGroup',
    'currentAddressLine1', 'currentCity', 'currentState', 'currentPincode',
    'whatsappNumber', 'firstGotra', 'secondGotra',
    'education', 'occupation', 'fathersFullName', 'mothersFullName'
  ];
  
  const isComplete = requiredFields.every(field => this[field]);
  this.isComplete = isComplete;
  return isComplete;
};

// Method to increment profile views
profileSchema.methods.incrementViews = function() {
  this.profileViews += 1;
  return this.save();
};

module.exports = mongoose.model('Profile', profileSchema);