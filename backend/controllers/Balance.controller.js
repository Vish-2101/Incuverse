const Balance = require('../models/Balance.model');

// Get user balance
const getBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    
    let balance = await Balance.findOne({ userId });
    
    // Create balance if it doesn't exist
    if (!balance) {
      balance = new Balance({
        userId,
        amount: 100000, // ₹1,00,000 default
        currency: 'INR'
      });
      await balance.save();
    }

    res.json({
      success: true,
      data: {
        amount: balance.amount,
        currency: balance.currency,
        lastUpdated: balance.lastUpdated
      }
    });
  } catch (error) {
    console.error('Error getting balance:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching balance',
      error: error.message
    });
  }
};

// Update user balance
const updateBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, operation = 'set' } = req.body;

    if (typeof amount !== 'number' || amount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    let balance = await Balance.findOne({ userId });
    
    if (!balance) {
      balance = new Balance({
        userId,
        amount: 100000,
        currency: 'INR'
      });
    }

    if (operation === 'add') {
      balance.amount += amount;
    } else if (operation === 'subtract') {
      if (balance.amount < amount) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient balance'
        });
      }
      balance.amount -= amount;
    } else {
      balance.amount = amount;
    }

    balance.lastUpdated = new Date();
    await balance.save();

    res.json({
      success: true,
      message: 'Balance updated successfully',
      data: {
        amount: balance.amount,
        currency: balance.currency,
        lastUpdated: balance.lastUpdated
      }
    });
  } catch (error) {
    console.error('Error updating balance:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating balance',
      error: error.message
    });
  }
};

// Add funds to balance
const addFunds = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    const balance = await Balance.findOneAndUpdate(
      { userId },
      { 
        $inc: { amount },
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
      message: 'Funds added successfully',
      data: {
        amount: balance.amount,
        currency: balance.currency,
        lastUpdated: balance.lastUpdated
      }
    });
  } catch (error) {
    console.error('Error adding funds:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding funds',
      error: error.message
    });
  }
};

module.exports = {
  getBalance,
  updateBalance,
  addFunds
};
