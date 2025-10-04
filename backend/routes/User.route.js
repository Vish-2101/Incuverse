import express from 'express';
import { registerUser } from '../controllers/User.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { getUserProfile } from '../controllers/User.controller.js';
// import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   POST api/users/register
// @desc    Register a new user
// @access  Public
router.get('/profile', protect, getUserProfile);
router.post('/register', registerUser);

export default router;