const mongoose = require('mongoose');

const carbonCreditsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  credits: {
    type: Number,
    required: true,
    default: 245
  },
  totalEarned: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
carbonCreditsSchema.index({ userId: 1 });

module.exports = mongoose.model('CarbonCredits', carbonCreditsSchema);
