const UserProfile = require('../models/UserProfile.model');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

// Create or update user profile
const createOrUpdateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profileData = req.body;

    // Remove userId from profileData to avoid conflicts
    delete profileData.userId;

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { 
        ...profileData,
        lastActive: new Date()
      },
      { 
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    console.error('Error creating/updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Update user preferences
const updatePreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const { preferences } = req.body;

    if (!preferences || typeof preferences !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid preferences data'
      });
    }

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { 
        $set: { 
          preferences: {
            ...preferences,
            // Validate theme
            theme: ['light', 'dark'].includes(preferences.theme) ? preferences.theme : 'light'
          }
        },
        lastActive: new Date()
      },
      { 
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: profile.preferences
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating preferences',
      error: error.message
    });
  }
};

// Get user theme preference
const getTheme = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
      return res.json({
        success: true,
        data: { theme: 'light' }
      });
    }

    res.json({
      success: true,
      data: { 
        theme: profile.preferences?.theme || 'light' 
      }
    });
  } catch (error) {
    console.error('Error getting theme:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching theme',
      error: error.message
    });
  }
};

// Update user theme
const updateTheme = async (req, res) => {
  try {
    const { userId } = req.params;
    const { theme } = req.body;

    if (!['light', 'dark'].includes(theme)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid theme. Must be "light" or "dark"'
      });
    }

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { 
        $set: { 
          'preferences.theme': theme,
          lastActive: new Date()
        }
      },
      { 
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    res.json({
      success: true,
      message: 'Theme updated successfully',
      data: { theme }
    });
  } catch (error) {
    console.error('Error updating theme:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating theme',
      error: error.message
    });
  }
};

// Delete user profile
const deleteProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const profile = await UserProfile.findOneAndDelete({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting profile',
      error: error.message
    });
  }
};

module.exports = {
  getUserProfile,
  createOrUpdateProfile,
  updatePreferences,
  getTheme,
  updateTheme,
  deleteProfile
};
