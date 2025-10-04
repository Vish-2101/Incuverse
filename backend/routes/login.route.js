import express from 'express';
import { sendLoginOtp, verifyLoginOtp } from '../controllers/login.controller.js';

const router = express.Router();

// Route for sending OTP to a registered user
router.post('/login/send-otp', sendLoginOtp);

// Route for verifying OTP and generating a JWT
router.post('/login/verify-otp', verifyLoginOtp);

export default router;