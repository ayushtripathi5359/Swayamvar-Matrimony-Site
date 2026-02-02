const Match = require('../models/Match');
const Profile = require('../models/Profile');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get matches for current user
// @route   GET /api/matches
// @access  Private
const getMatches = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, minScore = 60 } = req.query;
  
  // Find existing matches
  let matches = await Match.find({
    $or: [
      { user1Id: req.user.id },
      { user2Id: req.user.id }
    ],
    matchScore: { $gte: parseInt(minScore) },
    status: 'active'
  })
  .populate('profile1Id profile2Id', 'fullName age occupation jobLocation photos')
  .sort({ matchScore: -1 })
  .limit(limit * 1)
  .skip((page - 1) * limit);
  
  // If no matches found, generate new ones
  if (matches.length === 0) {
    const generatedMatches = await Match.findMatches(req.user.id, { limit: parseInt(limit) });
    
    // Save generated matches to database
    // Get user profile first
    const userProfile = await Profile.findOne({ userId: req.user.id }).select('_id');
    
    const matchesToSave = generatedMatches
      .filter(match => match.matchScore >= parseInt(minScore))
      .slice(0, parseInt(limit))
      .map(match => ({
        user1Id: req.user.id,
        user2Id: match.profile.userId,
        profile1Id: userProfile._id,
        profile2Id: match.profile._id,
        matchScore: match.matchScore,
        matchFactors: match.matchFactors
      }));
    
    if (matchesToSave.length > 0) {
      await Match.insertMany(matchesToSave);
      
      // Fetch the saved matches with populated data
      matches = await Match.find({
        user1Id: req.user.id,
        matchScore: { $gte: parseInt(minScore) }
      })
      .populate('profile1Id profile2Id', 'fullName age occupation jobLocation photos')
      .sort({ matchScore: -1 })
      .limit(limit * 1);
    }
  }
  
  // Format matches for response
  const formattedMatches = matches.map(match => {
    const isUser1 = match.user1Id.toString() === req.user.id;
    const partnerProfile = isUser1 ? match.profile2Id : match.profile1Id;
    
    return {
      matchId: match._id,
      profile: partnerProfile,
      matchScore: match.matchScore,
      matchFactors: match.matchFactors,
      lastInteraction: match.lastInteraction,
      interactionCount: match.interactionCount
    };
  });
  
  const total = await Match.countDocuments({
    $or: [
      { user1Id: req.user.id },
      { user2Id: req.user.id }
    ],
    matchScore: { $gte: parseInt(minScore) },
    status: 'active'
  });
  
  res.status(200).json({
    success: true,
    count: formattedMatches.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    },
    matches: formattedMatches
  });
});

// @desc    Generate new matches (Premium feature)
// @route   POST /api/matches/generate
// @access  Private (Premium+)
const generateMatches = asyncHandler(async (req, res, next) => {
  const { limit = 50, refreshExisting = false } = req.body;
  
  if (refreshExisting) {
    // Delete existing matches
    await Match.deleteMany({
      $or: [
        { user1Id: req.user.id },
        { user2Id: req.user.id }
      ]
    });
  }
  
  // Generate new matches
  const generatedMatches = await Match.findMatches(req.user.id, { limit: parseInt(limit) });
  
  if (generatedMatches.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No potential matches found. Try adjusting your preferences.'
    });
  }
  
  // Save matches to database
  const userProfile = await Profile.findOne({ userId: req.user.id });
  const matchesToSave = generatedMatches.map(match => ({
    user1Id: req.user.id,
    user2Id: match.profile.userId,
    profile1Id: userProfile._id,
    profile2Id: match.profile._id,
    matchScore: match.matchScore,
    matchFactors: match.matchFactors
  }));
  
  await Match.insertMany(matchesToSave);
  
  res.status(200).json({
    success: true,
    message: `Generated ${generatedMatches.length} new matches`,
    count: generatedMatches.length,
    averageScore: Math.round(
      generatedMatches.reduce((sum, match) => sum + match.matchScore, 0) / generatedMatches.length
    )
  });
});

// @desc    Get match details
// @route   GET /api/matches/:id
// @access  Private
const getMatchDetails = asyncHandler(async (req, res, next) => {
  const match = await Match.findOne({
    _id: req.params.id,
    $or: [
      { user1Id: req.user.id },
      { user2Id: req.user.id }
    ]
  }).populate('profile1Id profile2Id');
  
  if (!match) {
    return res.status(404).json({
      success: false,
      message: 'Match not found'
    });
  }
  
  // Update interaction count
  match.interactionCount += 1;
  match.lastInteraction = new Date();
  await match.save();
  
  // Format response
  const isUser1 = match.user1Id.toString() === req.user.id;
  const partnerProfile = isUser1 ? match.profile2Id : match.profile1Id;
  
  res.status(200).json({
    success: true,
    match: {
      matchId: match._id,
      profile: partnerProfile,
      matchScore: match.matchScore,
      matchFactors: match.matchFactors,
      lastInteraction: match.lastInteraction,
      interactionCount: match.interactionCount,
      notes: match.notes
    }
  });
});

// @desc    Update match status
// @route   PUT /api/matches/:id/status
// @access  Private
const updateMatchStatus = asyncHandler(async (req, res, next) => {
  const { status, notes } = req.body;
  
  if (!['active', 'contacted', 'blocked', 'hidden'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    });
  }
  
  const match = await Match.findOne({
    _id: req.params.id,
    $or: [
      { user1Id: req.user.id },
      { user2Id: req.user.id }
    ]
  });
  
  if (!match) {
    return res.status(404).json({
      success: false,
      message: 'Match not found'
    });
  }
  
  match.status = status;
  if (notes) match.notes = notes;
  match.lastInteraction = new Date();
  
  await match.save();
  
  res.status(200).json({
    success: true,
    message: `Match status updated to ${status}`,
    match: {
      matchId: match._id,
      status: match.status,
      notes: match.notes
    }
  });
});

// @desc    Get match statistics
// @route   GET /api/matches/stats
// @access  Private
const getMatchStats = asyncHandler(async (req, res, next) => {
  const stats = await Match.aggregate([
    {
      $match: {
        $or: [
          { user1Id: req.user._id },
          { user2Id: req.user._id }
        ]
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgScore: { $avg: '$matchScore' },
        maxScore: { $max: '$matchScore' },
        minScore: { $min: '$matchScore' }
      }
    }
  ]);
  
  // Get score distribution
  const scoreDistribution = await Match.aggregate([
    {
      $match: {
        $or: [
          { user1Id: req.user._id },
          { user2Id: req.user._id }
        ]
      }
    },
    {
      $bucket: {
        groupBy: '$matchScore',
        boundaries: [0, 50, 60, 70, 80, 90, 100],
        default: 'other',
        output: {
          count: { $sum: 1 }
        }
      }
    }
  ]);
  
  res.status(200).json({
    success: true,
    stats: {
      byStatus: stats,
      scoreDistribution,
      totalMatches: stats.reduce((sum, stat) => sum + stat.count, 0)
    }
  });
});

module.exports = {
  getMatches,
  generateMatches,
  getMatchDetails,
  updateMatchStatus,
  getMatchStats
};