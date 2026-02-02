const express = require('express');
const {
  sendInterest,
  getReceivedInterests,
  getSentInterests,
  respondToInterest,
  withdrawInterest,
  getInterestStats,
  markInterestAsRead
} = require('../controllers/interestController');
const { protect, checkSubscription, actionRateLimit } = require('../middleware/auth');
const { validateInterest, validateObjectId } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Send interest (rate limited based on subscription)
router.post('/send', 
  validateInterest,
  actionRateLimit('send-interest', 10, 24 * 60 * 60 * 1000), // 10 per day for basic
  sendInterest
);

// Get interests
router.get('/received', getReceivedInterests);
router.get('/sent', getSentInterests);
router.get('/stats', getInterestStats);

// Interest actions
router.put('/:id/respond', 
  validateObjectId('id'),
  respondToInterest
);

router.put('/:id/withdraw', 
  validateObjectId('id'),
  withdrawInterest
);

router.put('/:id/read', 
  validateObjectId('id'),
  markInterestAsRead
);

module.exports = router;