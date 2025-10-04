const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true,
    default: 100000 // ₹1,00,000 default balance
  },
  currency: {
    type: String,
    default: 'INR'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
balanceSchema.index({ userId: 1 });

module.exports = mongoose.model('Balance', balanceSchema);
