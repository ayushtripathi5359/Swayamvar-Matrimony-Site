const Profile = require('../models/Profile');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const cloudinary = require('../utils/cloudinary');

// @desc    Create user profile
// @route   POST /api/profiles
// @access  Private
const createProfile = asyncHandler(async (req, res, next) => {
  // Check if profile already exists
  const existingProfile = await Profile.findOne({ userId: req.user.id });
  
  if (existingProfile) {
    return res.status(400).json({
      success: false,
      message: 'Profile already exists. Use PUT to update.'
    });
  }
  
  // Create profile
  const profile = await Profile.create({
    userId: req.user.id,
    ...req.body
  });
  
  // Check completeness
  profile.checkCompleteness();
  await profile.save();
  
  res.status(201).json({
    success: true,
    profile
  });
});

// @desc    Get current user's profile
// @route   GET /api/profiles
// @access  Private
const getProfile = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({ userId: req.user.id });
  
  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Profile not found'
    });
  }
  
  res.status(200).json({
    success: true,
    profile
  });
});

// @desc    Update user profile
// @route   PUT /api/profiles
// @access  Private
const updateProfile = asyncHandler(async (req, res, next) => {
  let profile = await Profile.findOne({ userId: req.user.id });
  
  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Profile not found'
    });
  }
  
  // Update profile
  profile = await Profile.findOneAndUpdate(
    { userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );
  
  // Check completeness
  profile.checkCompleteness();
  await profile.save();
  
  res.status(200).json({
    success: true,
    profile
  });
});

// @desc    Delete user profile
// @route   DELETE /api/profiles
// @access  Private
const deleteProfile = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({ userId: req.user.id });
  
  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Profile not found'
    });
  }
  
  // Delete photos from cloudinary if they exist
  if (profile.photos.profilePhoto?.publicId) {
    await cloudinary.uploader.destroy(profile.photos.profilePhoto.publicId);
  }
  if (profile.photos.western?.publicId) {
    await cloudinary.uploader.destroy(profile.photos.western.publicId);
  }
  if (profile.photos.traditional?.publicId) {
    await cloudinary.uploader.destroy(profile.photos.traditional.publicId);
  }
  
  await profile.deleteOne();
  
  res.status(200).json({
    success: true,
    message: 'Profile deleted successfully'
  });
});

// @desc    Upload profile photos
// @route   POST /api/profiles/photos
// @access  Private
const uploadPhotos = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({ userId: req.user.id });
  
  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Profile not found'
    });
  }
  
  const uploadPromises = [];
  const photoUpdates = {};
  
  // Upload profile photo (single photo)
  if (req.files.profilePhoto) {
    const profilePhotoFile = req.files.profilePhoto[0];
    uploadPromises.push(
      cloudinary.uploader.upload_stream(
        {
          folder: 'swayamvar/profiles',
          transformation: [
            { width: 400, height: 400, crop: 'fill' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) throw error;
          photoUpdates['photos.profilePhoto'] = {
            url: result.secure_url,
            publicId: result.public_id
          };
        }
      ).end(profilePhotoFile.buffer)
    );
  }
  
  // Keep legacy support for western/traditional photos
  if (req.files.western) {
    const westernFile = req.files.western[0];
    uploadPromises.push(
      cloudinary.uploader.upload_stream(
        {
          folder: 'swayamvar/profiles/western',
          transformation: [
            { width: 400, height: 400, crop: 'fill' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) throw error;
          photoUpdates['photos.western'] = {
            url: result.secure_url,
            publicId: result.public_id
          };
        }
      ).end(westernFile.buffer)
    );
  }
  
  if (req.files.traditional) {
    const traditionalFile = req.files.traditional[0];
    uploadPromises.push(
      cloudinary.uploader.upload_stream(
        {
          folder: 'swayamvar/profiles/traditional',
          transformation: [
            { width: 400, height: 400, crop: 'fill' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) throw error;
          photoUpdates['photos.traditional'] = {
            url: result.secure_url,
            publicId: result.public_id
          };
        }
      ).end(traditionalFile.buffer)
    );
  }
  
  try {
    await Promise.all(uploadPromises);
    
    // Update profile with new photo URLs
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: photoUpdates },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Photos uploaded successfully',
      photos: updatedProfile.photos
    });
  } catch (error) {
    return next(new Error('Photo upload failed'));
  }
});

// @desc    Delete profile photo
// @route   DELETE /api/profiles/photos/:type
// @access  Private
const deletePhoto = asyncHandler(async (req, res, next) => {
  const { type } = req.params;
  
  if (!['western', 'traditional', 'profilePhoto'].includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid photo type'
    });
  }
  
  const profile = await Profile.findOne({ userId: req.user.id });
  
  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Profile not found'
    });
  }
  
  const photo = profile.photos[type];
  
  if (!photo || !photo.publicId) {
    return res.status(404).json({
      success: false,
      message: 'Photo not found'
    });
  }
  
  // Delete from cloudinary
  await cloudinary.uploader.destroy(photo.publicId);
  
  // Update profile
  const updateField = `photos.${type}`;
  await Profile.findOneAndUpdate(
    { userId: req.user.id },
    { $unset: { [updateField]: 1 } }
  );
  
  res.status(200).json({
    success: true,
    message: 'Photo deleted successfully'
  });
});

// @desc    Get other profiles for browsing (excluding current user)
// @route   GET /api/profiles/browse
// @access  Private
const browseProfiles = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 8
  } = req.query;
  
  // Build query to exclude current user and only show complete profiles
  const query = {
    userId: { $ne: req.user.id }, // Exclude current user
    isComplete: true
  };
  
  // Get current user's profile to determine opposite gender
  const userProfile = await Profile.findOne({ userId: req.user.id });
  if (userProfile && userProfile.gender) {
    // Show opposite gender profiles by default
    query.gender = userProfile.gender === 'Male' ? 'Female' : 'Male';
  }
  
  // Execute search with essential fields only
  const profiles = await Profile.find(query)
    .select('firstName middleName lastName fullName age education occupation jobLocation photos profilePhotos')
    .sort({ lastActive: -1, createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));
  
  const total = await Profile.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: profiles.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    },
    profiles
  });
});

// @desc    Search profiles
// @route   GET /api/profiles/search
// @access  Private
const searchProfiles = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 20,
    ageFrom,
    ageTo,
    gender,
    maritalStatus,
    motherTongue,
    occupation,
    location,
    education,
    search
  } = req.query;
  
  // Build search query
  const query = {
    userId: { $ne: req.user.id }, // Exclude current user
    isComplete: true
  };
  
  // Gender filter (opposite gender by default)
  const userProfile = await Profile.findOne({ userId: req.user.id });
  if (userProfile) {
    query.gender = userProfile.gender === 'Male' ? 'Female' : 'Male';
  }
  
  if (gender) query.gender = gender;
  if (maritalStatus) query.maritalStatus = maritalStatus;
  if (motherTongue) query.motherTongue = motherTongue;
  if (occupation) query.occupation = occupation;
  if (location) query.jobLocation = new RegExp(location, 'i');
  if (education) query.highestEducation = education;
  
  // Age range filter
  if (ageFrom || ageTo) {
    const today = new Date();
    const ageQuery = {};
    
    if (ageTo) {
      const minBirthDate = new Date(today.getFullYear() - parseInt(ageTo) - 1, today.getMonth(), today.getDate());
      ageQuery.$gte = minBirthDate;
    }
    
    if (ageFrom) {
      const maxBirthDate = new Date(today.getFullYear() - parseInt(ageFrom), today.getMonth(), today.getDate());
      ageQuery.$lte = maxBirthDate;
    }
    
    if (Object.keys(ageQuery).length > 0) {
      query.dateOfBirth = ageQuery;
    }
  }
  
  // Text search
  if (search) {
    query.$text = { $search: search };
  }
  
  // Execute search
  const profiles = await Profile.find(query)
    .select('-userId -searchKeywords')
    .sort(search ? { score: { $meta: 'textScore' } } : { lastActive: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
  
  const total = await Profile.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: profiles.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    },
    profiles
  });
});

// @desc    Get profile by ID
// @route   GET /api/profiles/:id
// @access  Private
const getProfileById = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findById(req.params.id)
    .select('-searchKeywords'); // Keep userId for interest functionality
  
  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Profile not found'
    });
  }
  
  res.status(200).json({
    success: true,
    profile
  });
});

// @desc    Increment profile view count
// @route   POST /api/profiles/:id/view
// @access  Private
const incrementProfileView = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findById(req.params.id);
  
  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Profile not found'
    });
  }
  
  // Don't count views from the profile owner
  if (profile.userId.toString() !== req.user.id) {
    await profile.incrementViews();
  }
  
  // Continue to next middleware (which will call getProfileById)
  next();
});

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  uploadPhotos,
  deletePhoto,
  browseProfiles,
  searchProfiles,
  getProfileById,
  incrementProfileView
};