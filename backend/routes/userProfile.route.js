const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  createOrUpdateProfile,
  updatePreferences,
  getTheme,
  updateTheme,
  deleteProfile
} = require('../controllers/UserProfile.controller');

// Get user profile
router.get('/user/:userId', getUserProfile);

// Create or update user profile
router.post('/user/:userId', createOrUpdateProfile);

// Update user preferences
router.patch('/user/:userId/preferences', updatePreferences);

// Get user theme
router.get('/user/:userId/theme', getTheme);

// Update user theme
router.patch('/user/:userId/theme', updateTheme);

// Delete user profile
router.delete('/user/:userId', deleteProfile);

module.exports = router;
