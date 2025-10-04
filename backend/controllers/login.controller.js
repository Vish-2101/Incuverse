import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Vonage } from '@vonage/server-sdk';

// Initialize Vonage client from environment variables
const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

// In-memory store for OTPs
const otpStore = new Map();

// @desc    Send OTP for login
// @route   POST /api/auth/login/send-otp
// @access  Public
const sendLoginOtp = async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this phone number. Please sign up.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Store OTP with a 5-minute expiry
    const expiry = Date.now() + 5 * 60 * 1000;
    otpStore.set(phoneNumber, { otp: hashedOtp, expiry });

    console.log(`Generated OTP for ${phoneNumber}: ${otp}`); // For testing purposes

    const from = "Vonage APIs";
    const to = phoneNumber;
    const text = `Your login verification code is: ${otp}`;

    await vonage.sms.send({ to, from, text });

    res.status(200).json({ success: true, message: 'OTP sent successfully.' });

  } catch (error) {
    console.error('Error sending login OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
  }
};

// @desc    Verify OTP and log in user
// @route   POST /api/auth/login/verify-otp
// @access  Public
const verifyLoginOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required' });
  }

  try {
    const storedOtpData = otpStore.get(phoneNumber);
    if (!storedOtpData) {
      return res.status(400).json({ message: 'OTP not found or has expired. Please try again.' });
    }

    if (Date.now() > storedOtpData.expiry) {
      otpStore.delete(phoneNumber);
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    const isMatch = await bcrypt.compare(otp, storedOtpData.otp);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      // This case should ideally not happen if sendLoginOtp is used correctly
      return res.status(404).json({ message: 'User not found.' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    // Clean up OTP store
    otpStore.delete(phoneNumber);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      userId: user._id, // Add userId for MongoDB integration
      user: {
        id: user._id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error('Error verifying login OTP:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

export { sendLoginOtp, verifyLoginOtp };