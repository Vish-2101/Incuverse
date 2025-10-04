import User from '../models/User.model.js';

export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      dateOfBirth,
      address,
      bankName,
      accountNumber,
      ifscCode,
      idType,
      idNumber
    } = req.body;

    // Basic validation
    if (!fullName || !phoneNumber || !bankName || !accountNumber || !ifscCode) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this phone number already exists.' });
    }

    const newUser = new User({
      fullName,
      phoneNumber,
      dateOfBirth,
      address,
      bankName,
      accountNumber,
      ifscCode,
      idType,
      idNumber
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      user: newUser
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
};

// @desc    Get logged-in user's profile
// @route   GET /api/users/profile
// @access  Private (requires JWT)
export const getUserProfile = async (req, res) => {
  // The 'protect' middleware should have already attached the user object to req.user
  const user = req.user;

  if (user) {
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      joinDate: user.createdAt,
      // Add any other non-sensitive fields you wish to return
    });
  } else {
    // This case should ideally not be reached if the 'protect' middleware is working correctly
    res.status(404).json({ message: 'User not found' });
  }
};