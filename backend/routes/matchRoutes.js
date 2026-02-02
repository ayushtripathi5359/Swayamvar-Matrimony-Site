const express = require('express');
const {
  getMatches,
  generateMatches,
  getMatchDetails,
  updateMatchStatus,
  getMatchStats
} = require('../controllers/matchController');
const { protect, checkSubscription } = require('../middleware/auth');
const { validateSearch, validateObjectId } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Get matches for current user
router.get('/', validateSearch, getMatches);

// Generate new matches (premium feature)
router.post('/generate', 
  checkSubscription('premium'),
  generateMatches
);

// Get match statistics
router.get('/stats', getMatchStats);

// Get specific match details
router.get('/:id', 
  validateObjectId('id'),
  getMatchDetails
);

// Update match status (hide, block, etc.)
router.put('/:id/status', 
  validateObjectId('id'),
  updateMatchStatus
);

module.exports = router;