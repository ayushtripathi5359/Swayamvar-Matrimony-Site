const express = require('express');
const {
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
} = require('../controllers/profileController');
const { protect, checkSubscription, actionRateLimit } = require('../middleware/auth');
const { validateSearch, validateObjectId } = require('../middleware/validation');
const upload = require('../middleware/upload');

const router = express.Router();

// All routes are protected
router.use(protect);

// Profile CRUD operations
router.route('/')
  .post(createProfile)
  .get(getProfile)
  .put(updateProfile)
  .delete(deleteProfile);

// Photo upload routes
router.post('/photos', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'western', maxCount: 1 }, // Keep for backward compatibility
  { name: 'traditional', maxCount: 1 } // Keep for backward compatibility
]), uploadPhotos);

router.delete('/photos/:type', deletePhoto);

// Browse profiles (for FindPerfectBride component)
router.get('/browse', browseProfiles);

// Search profiles
router.get('/search', validateSearch, searchProfiles);

// Get specific profile by ID
router.get('/:id', validateObjectId('id'), incrementProfileView, getProfileById);

// Profile view tracking (rate limited)
router.post('/:id/view', 
  validateObjectId('id'),
  actionRateLimit('profile-view', 10, 60 * 1000), // 10 views per minute
  incrementProfileView
);

module.exports = router;