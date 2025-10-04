const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransaction,
  processPayment,
  addBonusTransaction,
  updateTransactionStatus
} = require('../controllers/Transaction.controller');

// Get all transactions for a user
router.get('/user/:userId', getTransactions);

// Get a specific transaction
router.get('/:transactionId', getTransaction);

// Process a payment
router.post('/payment', processPayment);

// Add a bonus transaction
router.post('/bonus', addBonusTransaction);

// Update transaction status
router.patch('/:transactionId/status', updateTransactionStatus);

module.exports = router;
