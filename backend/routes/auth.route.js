const express = require('express');
const router = express.Router();
const otpController = require('../controllers/auth.controller.js');

// Route to send OTP to a user's phone number
router.post('/send', otpController.sendOtp);

// Route to verify the OTP submitted by the user
router.post('/verify', otpController.verifyOtp);

module.exports = router;
