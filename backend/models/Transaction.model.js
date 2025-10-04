const mongoose = require('mongoose');

const carbonImpactSchema = new mongoose.Schema({
  co2Offset: {
    type: String,
    required: true
  },
  treesEquivalent: {
    type: String,
    required: true
  },
  creditsEarned: {
    type: Number,
    required: true
  },
  breakdown: [{
    item: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }]
});

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  id: {
    type: String,
    required: true,
    unique: true
  },
  merchant: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  credits: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  fullDate: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['payment', 'bonus'],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Completed', 'Pending', 'Failed'],
    required: true
  },
  carbonImpact: {
    type: carbonImpactSchema,
    required: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ merchant: 1 });
transactionSchema.index({ category: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
