const CarbonCredits = require('../models/CarbonCredits.model');

// Get user carbon credits
const getCarbonCredits = async (req, res) => {
  try {
    const { userId } = req.params;
    
    let carbonCredits = await CarbonCredits.findOne({ userId });
    
    // Create carbon credits if it doesn't exist
    if (!carbonCredits) {
      carbonCredits = new CarbonCredits({
        userId,
        credits: 245, // Default credits
        totalEarned: 0,
        totalSpent: 0
      });
      await carbonCredits.save();
    }

    res.json({
      success: true,
      data: {
        credits: carbonCredits.credits,
        totalEarned: carbonCredits.totalEarned,
        totalSpent: carbonCredits.totalSpent,
        lastUpdated: carbonCredits.lastUpdated
      }
    });
  } catch (error) {
    console.error('Error getting carbon credits:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching carbon credits',
      error: error.message
    });
  }
};

// Update carbon credits
const updateCarbonCredits = async (req, res) => {
  try {
    const { userId } = req.params;
    const { credits, operation = 'set' } = req.body;

    if (typeof credits !== 'number' || credits < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credits amount'
      });
    }

    let carbonCredits = await CarbonCredits.findOne({ userId });
    
    if (!carbonCredits) {
      carbonCredits = new CarbonCredits({
        userId,
        credits: 245,
        totalEarned: 0,
        totalSpent: 0
      });
    }

    if (operation === 'add') {
      carbonCredits.credits += credits;
      carbonCredits.totalEarned += credits;
    } else if (operation === 'subtract') {
      if (carbonCredits.credits < credits) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient carbon credits'
        });
      }
      carbonCredits.credits -= credits;
      carbonCredits.totalSpent += credits;
    } else {
      carbonCredits.credits = credits;
    }

    carbonCredits.lastUpdated = new Date();
    await carbonCredits.save();

    res.json({
      success: true,
      message: 'Carbon credits updated successfully',
      data: {
        credits: carbonCredits.credits,
        totalEarned: carbonCredits.totalEarned,
        totalSpent: carbonCredits.totalSpent,
        lastUpdated: carbonCredits.lastUpdated
      }
    });
  } catch (error) {
    console.error('Error updating carbon credits:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating carbon credits',
      error: error.message
    });
  }
};

// Add carbon credits
const addCarbonCredits = async (req, res) => {
  try {
    const { userId } = req.params;
    const { credits } = req.body;

    if (typeof credits !== 'number' || credits <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credits amount'
      });
    }

    const carbonCredits = await CarbonCredits.findOneAndUpdate(
      { userId },
      { 
        $inc: { 
          credits,
          totalEarned: credits
        },
        lastUpdated: new Date()
      },
      { 
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    res.json({
      success: true,
      message: 'Carbon credits added successfully',
      data: {
        credits: carbonCredits.credits,
        totalEarned: carbonCredits.totalEarned,
        totalSpent: carbonCredits.totalSpent,
        lastUpdated: carbonCredits.lastUpdated
      }
    });
  } catch (error) {
    console.error('Error adding carbon credits:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding carbon credits',
      error: error.message
    });
  }
};

// Spend carbon credits
const spendCarbonCredits = async (req, res) => {
  try {
    const { userId } = req.params;
    const { credits } = req.body;

    if (typeof credits !== 'number' || credits <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credits amount'
      });
    }

    const carbonCredits = await CarbonCredits.findOne({ userId });
    
    if (!carbonCredits || carbonCredits.credits < credits) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient carbon credits'
      });
    }

    carbonCredits.credits -= credits;
    carbonCredits.totalSpent += credits;
    carbonCredits.lastUpdated = new Date();
    await carbonCredits.save();

    res.json({
      success: true,
      message: 'Carbon credits spent successfully',
      data: {
        credits: carbonCredits.credits,
        totalEarned: carbonCredits.totalEarned,
        totalSpent: carbonCredits.totalSpent,
        lastUpdated: carbonCredits.lastUpdated
      }
    });
  } catch (error) {
    console.error('Error spending carbon credits:', error);
    res.status(500).json({
      success: false,
      message: 'Error spending carbon credits',
      error: error.message
    });
  }
};

module.exports = {
  getCarbonCredits,
  updateCarbonCredits,
  addCarbonCredits,
  spendCarbonCredits
};
