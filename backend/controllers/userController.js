const User = require('../models/User');
const Profile = require('../models/Profile');
const Interest = require('../models/Interest');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Update user information
// @route   PUT /api/users/profile
// @access  Private
const updateUser = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    preferences: req.body.preferences
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    user
  });
});

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Delete associated profile
  await Profile.findOneAndDelete({ userId: req.user.id });

  // Delete associated interests
  await Interest.deleteMany({
    $or: [
      { senderId: req.user.id },
      { receiverId: req.user.id }
    ]
  });

  // Soft delete user (deactivate instead of hard delete)
  user.isActive = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Account deactivated successfully'
  });
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
const getUserStats = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({ userId: req.user.id });
  
  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Profile not found'
    });
  }

  // Get interest stats
  const interestStats = await Interest.aggregate([
    {
      $facet: {
        sent: [
          { $match: { senderId: req.user._id } },
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ],
        received: [
          { $match: { receiverId: req.user._id } },
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]
      }
    }
  ]);

  // Get profile completion percentage
  const requiredFields = [
    'firstName', 'lastName', 'gender', 'dateOfBirth', 'maritalStatus', 
    'motherTongue', 'height', 'complexion', 'bloodGroup',
    'highestEducation', 'occupation', 'fathersFullName', 'mothersFullName'
  ];
  
  const completedFields = requiredFields.filter(field => profile[field]);
  const completionPercentage = Math.round((completedFields.length / requiredFields.length) * 100);

  res.status(200).json({
    success: true,
    stats: {
      profile: {
        views: profile.profileViews,
        completionPercentage,
        isVerified: profile.isVerified,
        lastActive: profile.lastActive
      },
      interests: interestStats[0],
      subscription: {
        plan: req.user.subscription.plan,
        isActive: req.user.subscription.isActive,
        endDate: req.user.subscription.endDate
      }
    }
  });
});

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
const updatePreferences = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { preferences: req.body },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Preferences updated successfully',
    preferences: user.preferences
  });
});

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;

  // Get recent interests as notifications
  const notifications = await Interest.find({
    receiverId: req.user.id,
    status: 'sent'
  })
  .populate('senderProfileId', 'fullName photos')
  .sort({ sentAt: -1 })
  .limit(limit * 1)
  .skip((page - 1) * limit);

  const total = await Interest.countDocuments({
    receiverId: req.user.id,
    status: 'sent'
  });

  // Format notifications
  const formattedNotifications = notifications.map(interest => ({
    id: interest._id,
    type: 'interest_received',
    title: 'New Interest Received',
    message: `${interest.senderProfileId.fullName} has sent you an interest`,
    data: {
      senderId: interest.senderId,
      senderProfile: interest.senderProfileId,
      message: interest.message
    },
    isRead: interest.isRead,
    createdAt: interest.sentAt
  }));

  res.status(200).json({
    success: true,
    count: formattedNotifications.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    },
    notifications: formattedNotifications
  });
});

// @desc    Mark notification as read
// @route   PUT /api/users/notifications/:id/read
// @access  Private
const markNotificationAsRead = asyncHandler(async (req, res, next) => {
  const interest = await Interest.findOne({
    _id: req.params.id,
    receiverId: req.user.id
  });

  if (!interest) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }

  interest.isRead = true;
  interest.readAt = new Date();
  await interest.save();

  res.status(200).json({
    success: true,
    message: 'Notification marked as read'
  });
});

// @desc    Update subscription
// @route   PUT /api/users/subscription
// @access  Private
const updateSubscription = asyncHandler(async (req, res, next) => {
  const { plan, duration = 1 } = req.body;

  if (!['basic', 'premium', 'elite'].includes(plan)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid subscription plan'
    });
  }

  const user = await User.findById(req.user.id);
  
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + duration);

  user.subscription = {
    plan,
    startDate,
    endDate,
    isActive: true,
    autoRenew: req.body.autoRenew || false
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Subscription updated successfully',
    subscription: user.subscription
  });
});

module.exports = {
  updateUser,
  deleteUser,
  getUserStats,
  updatePreferences,
  getNotifications,
  markNotificationAsRead,
  updateSubscription
};