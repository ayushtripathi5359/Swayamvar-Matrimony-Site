const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// Subscription plans configuration
const SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Basic',
    price: {
      monthly: 999,
      annual: 9999
    },
    features: [
      'Create detailed profile',
      'Browse unlimited profiles',
      'Send up to 10 interests per month',
      'Basic search filters',
      'View contact details of accepted matches',
      'Email support'
    ],
    limits: {
      dailyInterests: 10,
      monthlyInterests: 10,
      profileViews: 50
    }
  },
  premium: {
    name: 'Premium',
    price: {
      monthly: 2499,
      annual: 24999
    },
    features: [
      'All Basic features',
      'Unlimited interests & messages',
      'Advanced search filters',
      'See who viewed your profile',
      'Priority listing in search results',
      'Verified badge on profile',
      'Dedicated relationship manager',
      'Phone support',
      'Profile highlighting'
    ],
    limits: {
      dailyInterests: 50,
      monthlyInterests: 1500,
      profileViews: 500
    }
  },
  elite: {
    name: 'Elite',
    price: {
      monthly: 4999,
      annual: 49999
    },
    features: [
      'All Premium features',
      'Personalized matchmaking service',
      'Professional photo shoot assistance',
      'Profile writing assistance',
      'Background verification',
      'Exclusive elite member directory',
      'Personal consultation sessions',
      '24/7 priority support',
      'Custom match recommendations'
    ],
    limits: {
      dailyInterests: 100,
      monthlyInterests: 3000,
      profileViews: 1000
    }
  }
};

// @desc    Get subscription plans
// @route   GET /api/subscriptions/plans
// @access  Public
const getPlans = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    plans: SUBSCRIPTION_PLANS
  });
});

// @desc    Create subscription
// @route   POST /api/subscriptions/create
// @access  Private
const createSubscription = asyncHandler(async (req, res, next) => {
  const { plan, duration = 'monthly', paymentMethod } = req.body;

  if (!SUBSCRIPTION_PLANS[plan]) {
    return res.status(400).json({
      success: false,
      message: 'Invalid subscription plan'
    });
  }

  if (!['monthly', 'annual'].includes(duration)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid subscription duration'
    });
  }

  const user = await User.findById(req.user.id);
  const planDetails = SUBSCRIPTION_PLANS[plan];
  const amount = planDetails.price[duration];

  // Here you would integrate with payment gateway (Razorpay, Stripe, etc.)
  // For now, we'll simulate a successful payment
  
  const subscriptionData = {
    plan,
    startDate: new Date(),
    endDate: new Date(Date.now() + (duration === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000),
    isActive: true,
    autoRenew: req.body.autoRenew || false
  };

  user.subscription = subscriptionData;
  await user.save();

  // Create payment record (you would save this to a Payment model)
  const paymentRecord = {
    userId: user._id,
    plan,
    duration,
    amount,
    status: 'completed',
    paymentMethod,
    transactionId: `txn_${Date.now()}`, // This would come from payment gateway
    createdAt: new Date()
  };

  res.status(201).json({
    success: true,
    message: 'Subscription created successfully',
    subscription: user.subscription,
    payment: paymentRecord
  });
});

// @desc    Update subscription
// @route   PUT /api/subscriptions/update
// @access  Private
const updateSubscription = asyncHandler(async (req, res, next) => {
  const { plan, autoRenew } = req.body;
  const user = await User.findById(req.user.id);

  if (!user.subscription.isActive) {
    return res.status(400).json({
      success: false,
      message: 'No active subscription found'
    });
  }

  // Update plan if provided
  if (plan && SUBSCRIPTION_PLANS[plan]) {
    user.subscription.plan = plan;
  }

  // Update auto-renewal setting
  if (typeof autoRenew === 'boolean') {
    user.subscription.autoRenew = autoRenew;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Subscription updated successfully',
    subscription: user.subscription
  });
});

// @desc    Cancel subscription
// @route   POST /api/subscriptions/cancel
// @access  Private
const cancelSubscription = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user.subscription.isActive) {
    return res.status(400).json({
      success: false,
      message: 'No active subscription found'
    });
  }

  // Don't immediately deactivate, let it expire naturally
  user.subscription.autoRenew = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Subscription will be cancelled at the end of current billing period',
    subscription: user.subscription
  });
});

// @desc    Get subscription history
// @route   GET /api/subscriptions/history
// @access  Private
const getSubscriptionHistory = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  // In a real application, you would fetch from a Payment/Transaction model
  // For now, we'll return the current subscription info
  const history = [{
    plan: user.subscription.plan,
    startDate: user.subscription.startDate,
    endDate: user.subscription.endDate,
    status: user.subscription.isActive ? 'active' : 'expired',
    amount: SUBSCRIPTION_PLANS[user.subscription.plan]?.price.monthly || 0
  }];

  res.status(200).json({
    success: true,
    history
  });
});

// @desc    Verify payment
// @route   POST /api/subscriptions/verify-payment
// @access  Private
const verifyPayment = asyncHandler(async (req, res, next) => {
  const { paymentId, orderId, signature } = req.body;

  // Here you would verify the payment with your payment gateway
  // For Razorpay, you would verify the signature
  // For now, we'll simulate successful verification

  const isValid = true; // This would be the actual verification result

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: 'Payment verification failed'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Payment verified successfully',
    paymentId,
    orderId
  });
});

module.exports = {
  getPlans,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  getSubscriptionHistory,
  verifyPayment
};