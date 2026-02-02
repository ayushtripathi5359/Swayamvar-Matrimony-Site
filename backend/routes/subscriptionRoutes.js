const express = require('express');
const {
  getPlans,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  getSubscriptionHistory,
  verifyPayment
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/plans', getPlans);

// Protected routes
router.use(protect);

router.post('/create', createSubscription);
router.put('/update', updateSubscription);
router.post('/cancel', cancelSubscription);
router.get('/history', getSubscriptionHistory);
router.post('/verify-payment', verifyPayment);

module.exports = router;