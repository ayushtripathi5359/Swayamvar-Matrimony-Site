const express = require('express');
const {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  uploadPhotos,
  deletePhoto,
  searchProfiles,
  getProfileById,
  incrementProfileView
} = require('../controllers/profileController');
const { protect, checkSubscription, actionRateLimit } = require('../middleware/auth');
const { validateProfile, validateSearch, validateObjectId } = require('../middleware/validation');
const upload = require('../middleware/upload');

const router = express.Router();

// All routes are protected
router.use(protect);

// Profile CRUD operations
router.route('/')
  .post(validateProfile, createProfile)
  .get(getProfile)
  .put(validateProfile, updateProfile)
  .delete(deleteProfile);

// Photo upload routes
router.post('/photos', upload.fields([
  { name: 'western', maxCount: 1 },
  { name: 'traditional', maxCount: 1 }
]), uploadPhotos);

router.delete('/photos/:type', deletePhoto);

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