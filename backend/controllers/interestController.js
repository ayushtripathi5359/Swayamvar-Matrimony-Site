const Interest = require('../models/Interest');
const Profile = require('../models/Profile');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Send interest to another user
// @route   POST /api/interests/send
// @access  Private
const sendInterest = asyncHandler(async (req, res, next) => {
  const { receiverId, message } = req.body;
  const senderId = req.user.id;
  
  // Check if trying to send interest to self
  if (senderId === receiverId) {
    return res.status(400).json({
      success: false,
      message: 'Cannot send interest to yourself'
    });
  }
  
  // Check if receiver exists and has a profile
  const receiverProfile = await Profile.findOne({ userId: receiverId });
  if (!receiverProfile) {
    return res.status(404).json({
      success: false,
      message: 'Receiver profile not found'
    });
  }
  
  // Check if sender has a complete profile
  const senderProfile = await Profile.findOne({ userId: senderId });
  if (!senderProfile || !senderProfile.isComplete) {
    return res.status(400).json({
      success: false,
      message: 'Please complete your profile before sending interests'
    });
  }
  
  // Check if interest can be sent
  const canSend = await Interest.canSendInterest(senderId, receiverId);
  if (!canSend.canSend) {
    return res.status(400).json({
      success: false,
      message: canSend.reason
    });
  }
  
  // Check subscription limits
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayInterests = await Interest.countDocuments({
    senderId,
    sentAt: { $gte: today }
  });
  
  const user = await User.findById(senderId);
  let dailyLimit = 10; // Basic plan limit
  
  if (user.subscription.plan === 'premium') {
    dailyLimit = 50;
  } else if (user.subscription.plan === 'elite') {
    dailyLimit = 100;
  }
  
  if (todayInterests >= dailyLimit) {
    return res.status(429).json({
      success: false,
      message: `Daily interest limit reached. Upgrade your plan for more interests.`,
      currentPlan: user.subscription.plan,
      dailyLimit
    });
  }
  
  // Create interest
  const interest = await Interest.create({
    senderId,
    receiverId,
    senderProfileId: senderProfile._id,
    receiverProfileId: receiverProfile._id,
    message,
    priority: user.subscription.plan === 'elite' ? 'premium' : 'normal'
  });
  
  await interest.populate([
    { path: 'senderProfileId', select: 'fullName photos' },
    { path: 'receiverProfileId', select: 'fullName photos' }
  ]);
  
  res.status(201).json({
    success: true,
    message: 'Interest sent successfully',
    interest,
    mutualInterest: canSend.mutualInterest
  });
});

// @desc    Get received interests
// @route   GET /api/interests/received
// @access  Private
const getReceivedInterests = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, status = 'sent' } = req.query;
  
  const query = {
    receiverId: req.user.id
  };
  
  if (status !== 'all') {
    query.status = status;
  }
  
  const interests = await Interest.find(query)
    .populate('senderProfileId', 'fullName age occupation jobLocation photos')
    .sort({ sentAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
  
  const total = await Interest.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: interests.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    },
    interests
  });
});

// @desc    Get sent interests
// @route   GET /api/interests/sent
// @access  Private
const getSentInterests = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, status = 'sent' } = req.query;
  
  const query = {
    senderId: req.user.id
  };
  
  if (status !== 'all') {
    query.status = status;
  }
  
  const interests = await Interest.find(query)
    .populate('receiverProfileId', 'fullName age occupation jobLocation photos')
    .sort({ sentAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
  
  const total = await Interest.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: interests.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    },
    interests
  });
});

// @desc    Respond to interest
// @route   PUT /api/interests/:id/respond
// @access  Private
const respondToInterest = asyncHandler(async (req, res, next) => {
  const { status, responseMessage } = req.body;
  
  if (!['accepted', 'declined'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid response status'
    });
  }
  
  const interest = await Interest.findOne({
    _id: req.params.id,
    receiverId: req.user.id,
    status: 'sent'
  });
  
  if (!interest) {
    return res.status(404).json({
      success: false,
      message: 'Interest not found or already responded'
    });
  }
  
  interest.status = status;
  interest.responseMessage = responseMessage;
  interest.respondedAt = new Date();
  
  await interest.save();
  
  await interest.populate([
    { path: 'senderProfileId', select: 'fullName photos' },
    { path: 'receiverProfileId', select: 'fullName photos' }
  ]);
  
  res.status(200).json({
    success: true,
    message: `Interest ${status} successfully`,
    interest
  });
});

// @desc    Withdraw sent interest
// @route   PUT /api/interests/:id/withdraw
// @access  Private
const withdrawInterest = asyncHandler(async (req, res, next) => {
  const interest = await Interest.findOne({
    _id: req.params.id,
    senderId: req.user.id,
    status: 'sent'
  });
  
  if (!interest) {
    return res.status(404).json({
      success: false,
      message: 'Interest not found or cannot be withdrawn'
    });
  }
  
  interest.status = 'withdrawn';
  await interest.save();
  
  res.status(200).json({
    success: true,
    message: 'Interest withdrawn successfully'
  });
});

// @desc    Get interest statistics
// @route   GET /api/interests/stats
// @access  Private
const getInterestStats = asyncHandler(async (req, res, next) => {
  const stats = await Interest.getStats(req.user.id);
  
  // Format stats
  const formattedStats = {
    sent: {
      total: 0,
      pending: 0,
      accepted: 0,
      declined: 0,
      withdrawn: 0
    },
    received: {
      total: 0,
      pending: 0,
      accepted: 0,
      declined: 0
    }
  };
  
  // Process sent interests
  if (stats.sent) {
    stats.sent.forEach(item => {
      formattedStats.sent[item._id] = item.count;
      formattedStats.sent.total += item.count;
    });
  }
  
  // Process received interests
  if (stats.received) {
    stats.received.forEach(item => {
      if (item._id === 'sent') {
        formattedStats.received.pending = item.count;
      } else {
        formattedStats.received[item._id] = item.count;
      }
      formattedStats.received.total += item.count;
    });
  }
  
  res.status(200).json({
    success: true,
    stats: formattedStats
  });
});

// @desc    Mark interest as read
// @route   PUT /api/interests/:id/read
// @access  Private
const markInterestAsRead = asyncHandler(async (req, res, next) => {
  const interest = await Interest.findOne({
    _id: req.params.id,
    receiverId: req.user.id
  });
  
  if (!interest) {
    return res.status(404).json({
      success: false,
      message: 'Interest not found'
    });
  }
  
  if (!interest.isRead) {
    interest.isRead = true;
    interest.readAt = new Date();
    await interest.save();
  }
  
  res.status(200).json({
    success: true,
    message: 'Interest marked as read'
  });
});

module.exports = {
  sendInterest,
  getReceivedInterests,
  getSentInterests,
  respondToInterest,
  withdrawInterest,
  getInterestStats,
  markInterestAsRead
};