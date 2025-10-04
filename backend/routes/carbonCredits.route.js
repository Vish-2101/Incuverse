const express = require('express');
const router = express.Router();
const {
  getCarbonCredits,
  updateCarbonCredits,
  addCarbonCredits,
  spendCarbonCredits
} = require('../controllers/CarbonCredits.controller');

// Get user carbon credits
router.get('/user/:userId', getCarbonCredits);

// Update carbon credits
router.patch('/user/:userId', updateCarbonCredits);

// Add carbon credits
router.post('/user/:userId/add', addCarbonCredits);

// Spend carbon credits
router.post('/user/:userId/spend', spendCarbonCredits);

module.exports = router;
