const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    // Require password only when creating a new local-auth user.
    // This avoids validation errors when saving existing users that were
    // loaded without the password field selected.
    required: function() {
      return this.isNew && this.authProvider === 'local';
    },
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values but unique non-null values
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 604800 // 7 days
    }
  }],
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  subscription: {
    plan: {
      type: String,
      enum: ['basic', 'premium', 'elite'],
      default: 'basic'
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: false
    },
    autoRenew: {
      type: Boolean,
      default: false
    }
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    },
    profileVisibility: {
      type: String,
      enum: ['public', 'members-only', 'premium-only'],
      default: 'members-only'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ 'subscription.plan': 1 });
userSchema.index({ isActive: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  console.log('=== PRE-SAVE DEBUG ===');
  console.log('Password exists:', !!this.password);
  console.log('Password modified:', this.isModified('password'));
  console.log('Auth provider:', this.authProvider);
  console.log('Is new:', this.isNew);
  
  // Add stack trace to see where save is being called from
  if (!this.isNew) {
    console.log('Stack trace for non-new save:');
    console.trace();
  }
  
  // Only hash password if it exists and is modified
  if (!this.password || !this.isModified('password')) {
    console.log('Skipping password hashing');
    console.log('=== PRE-SAVE DEBUG END ===');
    return next();
  }
  
  try {
    console.log('Hashing password...');
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    console.log('Salt rounds:', saltRounds);
    
    // Manually generate salt to be safe
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    
    console.log('Password hashed successfully');
    console.log('Hash length:', this.password.length);
    console.log('Hash starts with:', this.password.substring(0, 10));
    console.log('=== PRE-SAVE DEBUG END ===');
    next();
  } catch (error) {
    console.log('Password hashing error:', error);
    console.log('=== PRE-SAVE DEBUG END ===');
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  console.log('=== COMPARE PASSWORD DEBUG ===');
  console.log('Candidate password:', candidatePassword);
  console.log('Candidate password length:', candidatePassword ? candidatePassword.length : 0);
  console.log('Stored password exists:', !!this.password);
  console.log('Stored password length:', this.password ? this.password.length : 0);
  console.log('Auth provider:', this.authProvider);
  
  if (!this.password) {
    console.log('No password stored (OAuth user?)');
    console.log('=== COMPARE PASSWORD DEBUG END ===');
    return false;
  }
  
  if (!candidatePassword) {
    console.log('No candidate password provided');
    console.log('=== COMPARE PASSWORD DEBUG END ===');
    return false;
  }
  
  try {
    console.log('Performing bcrypt comparison...');
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log('Bcrypt comparison result:', result);
    console.log('=== COMPARE PASSWORD DEBUG END ===');
    return result;
  } catch (error) {
    console.log('Bcrypt comparison error:', error.message);
    console.log('=== COMPARE PASSWORD DEBUG END ===');
    return false;
  }
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

module.exports = mongoose.model('User', userSchema);