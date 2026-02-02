const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  user1Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user2Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  profile1Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  profile2Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  matchFactors: {
    ageCompatibility: Number,
    educationCompatibility: Number,
    occupationCompatibility: Number,
    locationCompatibility: Number,
    familyCompatibility: Number,
    lifestyleCompatibility: Number
  },
  status: {
    type: String,
    enum: ['active', 'contacted', 'blocked', 'hidden'],
    default: 'active'
  },
  isSystemGenerated: {
    type: Boolean,
    default: true
  },
  lastInteraction: Date,
  interactionCount: {
    type: Number,
    default: 0
  },
  notes: String
}, {
  timestamps: true
});

// Compound indexes
matchSchema.index({ user1Id: 1, user2Id: 1 }, { unique: true });
matchSchema.index({ user1Id: 1, matchScore: -1 });
matchSchema.index({ user2Id: 1, matchScore: -1 });
matchSchema.index({ matchScore: -1 });
matchSchema.index({ status: 1 });

// Static method to calculate match score
matchSchema.statics.calculateMatchScore = function(profile1, profile2) {
  let totalScore = 0;
  let factors = {};
  
  // Age compatibility (20% weight)
  const age1 = profile1.calculatedAge || 25;
  const age2 = profile2.calculatedAge || 25;
  const ageDiff = Math.abs(age1 - age2);
  factors.ageCompatibility = Math.max(0, 100 - (ageDiff * 5));
  totalScore += factors.ageCompatibility * 0.2;
  
  // Education compatibility (15% weight)
  const educationLevels = {
    'Below 10th': 1,
    '10th Pass': 2,
    '12th Pass': 3,
    'Diploma': 4,
    'Graduate': 5,
    'Post Graduate': 6,
    'Doctorate (PhD)': 7,
    'Professional Degree (CA / CS / ICWA)': 7
  };
  
  const edu1Level = educationLevels[profile1.highestEducation] || 5;
  const edu2Level = educationLevels[profile2.highestEducation] || 5;
  const eduDiff = Math.abs(edu1Level - edu2Level);
  factors.educationCompatibility = Math.max(0, 100 - (eduDiff * 15));
  totalScore += factors.educationCompatibility * 0.15;
  
  // Occupation compatibility (15% weight)
  const occupationGroups = {
    'Salaried (Private)': 'employed',
    'Salaried (Government)': 'employed',
    'Business Owner': 'business',
    'Self-Employed': 'business',
    'Freelancer': 'business',
    'Student': 'student',
    'Homemaker': 'homemaker',
    'Not Working': 'unemployed'
  };
  
  const occ1Group = occupationGroups[profile1.occupation] || 'other';
  const occ2Group = occupationGroups[profile2.occupation] || 'other';
  factors.occupationCompatibility = occ1Group === occ2Group ? 100 : 60;
  totalScore += factors.occupationCompatibility * 0.15;
  
  // Location compatibility (10% weight)
  factors.locationCompatibility = 70; // Default score, can be enhanced with actual location matching
  if (profile1.jobLocation && profile2.jobLocation) {
    factors.locationCompatibility = profile1.jobLocation.toLowerCase() === profile2.jobLocation.toLowerCase() ? 100 : 50;
  }
  totalScore += factors.locationCompatibility * 0.1;
  
  // Family compatibility (20% weight)
  factors.familyCompatibility = 80; // Base score
  if (profile1.motherTongue === profile2.motherTongue) {
    factors.familyCompatibility += 20;
  }
  factors.familyCompatibility = Math.min(100, factors.familyCompatibility);
  totalScore += factors.familyCompatibility * 0.2;
  
  // Lifestyle compatibility (20% weight)
  factors.lifestyleCompatibility = 75; // Base score
  // Can be enhanced with more lifestyle factors
  totalScore += factors.lifestyleCompatibility * 0.2;
  
  return {
    matchScore: Math.round(totalScore),
    matchFactors: factors
  };
};

// Static method to find matches for a user
matchSchema.statics.findMatches = async function(userId, options = {}) {
  const Profile = mongoose.model('Profile');
  const userProfile = await Profile.findOne({ userId });
  
  if (!userProfile) {
    throw new Error('User profile not found');
  }
  
  // Build match criteria
  const matchCriteria = {
    userId: { $ne: userId },
    gender: userProfile.gender === 'Male' ? 'Female' : 'Male',
    isComplete: true,
    isVerified: true
  };
  
  // Age range filter
  if (userProfile.partnerAgeFrom && userProfile.partnerAgeTo) {
    const ageFrom = parseInt(userProfile.partnerAgeFrom.replace(' years', ''));
    const ageTo = parseInt(userProfile.partnerAgeTo.replace(' years', ''));
    
    const today = new Date();
    const maxBirthDate = new Date(today.getFullYear() - ageFrom, today.getMonth(), today.getDate());
    const minBirthDate = new Date(today.getFullYear() - ageTo - 1, today.getMonth(), today.getDate());
    
    matchCriteria.dateOfBirth = {
      $gte: minBirthDate,
      $lte: maxBirthDate
    };
  }
  
  // Location filter
  if (userProfile.preferredLocation && userProfile.preferredLocation.length > 0) {
    matchCriteria.jobLocation = { $in: userProfile.preferredLocation };
  }
  
  // Find potential matches
  const potentialMatches = await Profile.find(matchCriteria)
    .limit(options.limit || 50)
    .sort({ lastActive: -1 });
  
  // Calculate match scores
  const matches = potentialMatches.map(profile => {
    const { matchScore, matchFactors } = this.calculateMatchScore(userProfile, profile);
    return {
      profile,
      matchScore,
      matchFactors
    };
  });
  
  // Sort by match score
  matches.sort((a, b) => b.matchScore - a.matchScore);
  
  return matches;
};

module.exports = mongoose.model('Match', matchSchema);