const express = require('express');
const {
  updateUser,
  deleteUser,
  getUserStats,
  updatePreferences,
  getNotifications,
  markNotificationAsRead,
  updateSubscription
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// User profile management
router.put('/profile', updateUser);
router.delete('/profile', deleteUser);
router.get('/stats', getUserStats);

// User preferences
router.put('/preferences', updatePreferences);

// Notifications
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', 
  validateObjectId('id'),
  markNotificationAsRead
);

// Subscription management
router.put('/subscription', updateSubscription);

// Admin routes
router.use(authorize('admin', 'moderator'));

// Admin user management routes can be added here
// router.get('/admin/users', getAllUsers);
// router.put('/admin/users/:id/verify', verifyUser);
// router.put('/admin/users/:id/suspend', suspendUser);

module.exports = router;