const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

// JWT Strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_ACCESS_SECRET
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      return done(null, user);
    }
    
    // Check if user exists with the same email
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // Link Google account to existing user
      user.googleId = profile.id;
      user.isEmailVerified = true; // Google emails are pre-verified
      await user.save();
      return done(null, user);
    }
    
    // Create new user
    user = await User.create({
      googleId: profile.id,
      email: profile.emails[0].value,
      isEmailVerified: true, // Google emails are pre-verified
      authProvider: 'google'
    });
    
    // Create basic profile with Google name information
    if (profile.name) {
      try {
        const Profile = require('../models/Profile');
        await Profile.create({
          userId: user._id,
          firstName: profile.name.givenName || '',
          middleName: '', // Google doesn't provide middle name
          lastName: profile.name.familyName || '',
          emailId: profile.emails[0].value
        });
      } catch (profileError) {
        console.log('Profile creation failed during Google OAuth:', profileError.message);
        // Continue with user creation even if profile creation fails
      }
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;