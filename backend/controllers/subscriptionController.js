const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// Subscription plans configuration
const SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Basic',
    price: {
      monthly: 0,
      annual: 0
    },
    features: [
      'Personal Profile Setup & Editing',
      'Basic Match Discovery Filters',
      'Limited Interest Expressions',
      'Restricted Contact Visibility',
      'Privacy-Protected Profile Access'
    ],
    limits: {
      dailyInterests: 5,
      monthlyInterests: 10,
      profileViews: 20
    }
  },
  standard: {
    name: 'Standard',
    price: {
      monthly: 1000,
      annual: 1000
    },
    features: [
      'All features of Basic Plan, plus:',
      'Profile Highlight',
      '12-Month Membership Validity',
      'Dedicated Customer Support',
      'Preference-Based Profile Visibility',
      'Limited Horoscope Matching'
    ],
    limits: {
      dailyInterests: 20,
      monthlyInterests: 100,
      profileViews: 200
    }
  },
  premium: {
    name: 'Premium',
    price: {
      monthly: 2500,
      annual: 2500
    },
    features: [
      'All features of Basic & Standard, plus:',
      'Monthly List of Newly Added Members via Email / WhatsApp',
      'Priority WhatsApp Customer Support',
      'Priority Listing in Search Results',
      'Maximum Profile Visibility Based on Partner Preferences',
      'Profile Highlighted as "Premium Member"',
      'First 50 Biodata Prints Free',
      'Membership Valid Until Marriage',
      'Unlimited Horoscope Matching',
      'Exclusive Discounts on Melawa Programs'
    ],
    limits: {
      dailyInterests: 100,
      monthlyInterests: 'unlimited',
      profileViews: 'unlimited'
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

  // Calculate end date based on plan
  let endDate;
  if (plan === 'basic') {
    endDate = null; // Free plan doesn't expire
  } else if (plan === 'standard') {
    endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 12 months
  } else if (plan === 'premium') {
    // Premium is valid until marriage - set a far future date
    endDate = new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000); // 10 years
  }

  // Here you would integrate with payment gateway (Razorpay, Stripe, etc.)
  // For now, we'll simulate a successful payment
  
  const subscriptionData = {
    plan,
    startDate: new Date(),
    endDate,
    isActive: true,
    autoRenew: plan === 'premium' ? false : (req.body.autoRenew || false) // Premium doesn't auto-renew
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