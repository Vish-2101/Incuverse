const Transaction = require('../models/Transaction.model');
const Balance = require('../models/Balance.model');
const CarbonCredits = require('../models/CarbonCredits.model');

// Get all transactions for a user
const getTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, category, status } = req.query;

    const query = { userId };
    if (category) query.category = category;
    if (status) query.status = status;

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: {
        transactions,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message
    });
  }
};

// Get a single transaction
const getTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error getting transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transaction',
      error: error.message
    });
  }
};

// Process a payment (create transaction, update balance and credits)
const processPayment = async (req, res) => {
  try {
    const { userId, amount, merchant, category, icon = 'payment' } = req.body;

    if (!userId || !amount || !merchant || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if user has sufficient balance
    const balance = await Balance.findOne({ userId });
    if (!balance || balance.amount < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Calculate carbon credits (1 credit per ₹100 spent)
    const creditsEarned = Math.floor(amount / 100);

    // Start transaction
    const session = await Transaction.startSession();
    session.startTransaction();

    try {
      // Update balance
      await Balance.findOneAndUpdate(
        { userId },
        { 
          $inc: { amount: -amount },
          lastUpdated: new Date()
        },
        { session }
      );

      // Update carbon credits
      await CarbonCredits.findOneAndUpdate(
        { userId },
        { 
          $inc: { 
            credits: creditsEarned,
            totalEarned: creditsEarned
          },
          lastUpdated: new Date()
        },
        { session, upsert: true }
      );

      // Create transaction
      const now = new Date();
      const transaction = new Transaction({
        userId,
        id: `TXN${Date.now()}`,
        merchant,
        amount,
        credits: creditsEarned,
        date: formatDate(now),
        time: formatTime(now),
        fullDate: formatFullDate(now),
        category,
        type: 'payment',
        icon,
        status: 'Completed',
        carbonImpact: {
          co2Offset: `${(creditsEarned * 0.02).toFixed(2)} kg`,
          treesEquivalent: `${(creditsEarned * 0.001).toFixed(3)}`,
          creditsEarned,
          breakdown: [
            { item: 'Eco-friendly transaction', value: '60%' },
            { item: 'Sustainable payment', value: '25%' },
            { item: 'Carbon offset contribution', value: '15%' },
          ],
        }
      });

      await transaction.save({ session });

      await session.commitTransaction();

      res.json({
        success: true,
        message: 'Payment processed successfully',
        data: transaction
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment',
      error: error.message
    });
  }
};

// Add a bonus transaction
const addBonusTransaction = async (req, res) => {
  try {
    const { userId, amount, merchant, category, icon = 'card-giftcard', credits } = req.body;

    if (!userId || !amount || !merchant || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const now = new Date();
    const transaction = new Transaction({
      userId,
      id: `BONUS${Date.now()}`,
      merchant,
      amount,
      credits: credits || 0,
      date: formatDate(now),
      time: formatTime(now),
      fullDate: formatFullDate(now),
      category,
      type: 'bonus',
      icon,
      status: 'Completed'
    });

    await transaction.save();

    res.json({
      success: true,
      message: 'Bonus transaction added successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Error adding bonus transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding bonus transaction',
      error: error.message
    });
  }
};

// Update transaction status
const updateTransactionStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status } = req.body;

    if (!['Completed', 'Pending', 'Failed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { status },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      message: 'Transaction status updated',
      data: transaction
    });
  } catch (error) {
    console.error('Error updating transaction status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating transaction status',
      error: error.message
    });
  }
};

// Helper functions
const formatDate = (date) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${formatTime(date)}`;
};

const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

const formatFullDate = (date) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

module.exports = {
  getTransactions,
  getTransaction,
  processPayment,
  addBonusTransaction,
  updateTransactionStatus
};
