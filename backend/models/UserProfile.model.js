const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  dateOfBirth: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    carbonTracking: {
      type: Boolean,
      default: true
    }
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
userProfileSchema.index({ userId: 1 });
userProfileSchema.index({ email: 1 });
userProfileSchema.index({ phoneNumber: 1 });

module.exports = mongoose.model('UserProfile', userProfileSchema);
