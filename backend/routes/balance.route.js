const express = require('express');
const router = express.Router();
const {
  getBalance,
  updateBalance,
  addFunds
} = require('../controllers/Balance.controller');

// Get user balance
router.get('/user/:userId', getBalance);

// Update user balance
router.patch('/user/:userId', updateBalance);

// Add funds to balance
router.post('/user/:userId/add', addFunds);

module.exports = router;
