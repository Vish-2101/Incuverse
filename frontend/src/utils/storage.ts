import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  BALANCE: '@ecocred_balance',
  CARBON_CREDITS: '@ecocred_carbon_credits',
  TRANSACTIONS: '@ecocred_transactions',
  THEME: '@ecocred_theme',
};

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  credits: number;
  date: string;
  time: string;
  fullDate: string;
  category: string;
  type: 'payment' | 'bonus';
  icon: string;
  status: 'Completed' | 'Pending' | 'Failed';
  carbonImpact?: {
    co2Offset: string;
    treesEquivalent: string;
    creditsEarned: number;
    breakdown: { item: string; value: string }[];
  };
}

// Initialize default values
export const initializeStorage = async () => {
  try {
    const balance = await AsyncStorage.getItem(STORAGE_KEYS.BALANCE);
    const credits = await AsyncStorage.getItem(STORAGE_KEYS.CARBON_CREDITS);
    const transactions = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);

    if (balance === null) {
      await AsyncStorage.setItem(STORAGE_KEYS.BALANCE, '100000'); // ₹1,00,000 for testing
      console.log('✅ Initial balance set: ₹1,00,000');
    }
    if (credits === null) {
      await AsyncStorage.setItem(STORAGE_KEYS.CARBON_CREDITS, '245');
      console.log('✅ Initial credits set: 245');
    }
    if (theme === null) {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, 'light');
      console.log('✅ Initial theme set: light');
    }
    if (transactions === null) {
      // Add some test transactions for testing
      const testTransactions: Transaction[] = [
        {
          id: 'TXN001',
          merchant: 'Starbucks',
          amount: 450,
          credits: 4,
          date: 'Oct 3, 2:30 PM',
          time: '2:30 PM',
          fullDate: 'Oct 3, 2024',
          category: 'Food & Dining',
          type: 'payment',
          icon: 'restaurant',
          status: 'Completed',
          carbonImpact: {
            co2Offset: '0.09 kg',
            treesEquivalent: '0.004',
            creditsEarned: 4,
            breakdown: [
              { item: 'Eco-friendly transaction', value: '60%' },
              { item: 'Sustainable payment', value: '25%' },
              { item: 'Carbon offset contribution', value: '15%' },
            ],
          },
        },
        {
          id: 'TXN002',
          merchant: 'Amazon',
          amount: 1200,
          credits: 12,
          date: 'Oct 2, 3:15 PM',
          time: '3:15 PM',
          fullDate: 'Oct 2, 2024',
          category: 'Shopping',
          type: 'payment',
          icon: 'shopping-cart',
          status: 'Completed',
          carbonImpact: {
            co2Offset: '0.24 kg',
            treesEquivalent: '0.012',
            creditsEarned: 12,
            breakdown: [
              { item: 'Eco-certified products', value: '55%' },
              { item: 'Recycled packaging', value: '30%' },
              { item: 'Carbon offset shipping', value: '15%' },
            ],
          },
        },
        {
          id: 'TXN003',
          merchant: 'Uber',
          amount: 350,
          credits: 3,
          date: 'Oct 1, 11:20 AM',
          time: '11:20 AM',
          fullDate: 'Oct 1, 2024',
          category: 'Transport',
          type: 'payment',
          icon: 'directions-car',
          status: 'Completed',
          carbonImpact: {
            co2Offset: '0.07 kg',
            treesEquivalent: '0.003',
            creditsEarned: 3,
            breakdown: [
              { item: 'Eco-friendly ride', value: '50%' },
              { item: 'Carbon offset', value: '30%' },
              { item: 'Green initiative', value: '20%' },
            ],
          },
        },
      ];
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(testTransactions));
      console.log('✅ Test transactions added to storage');
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Get current balance
export const getBalance = async (): Promise<number> => {
  try {
    const balance = await AsyncStorage.getItem(STORAGE_KEYS.BALANCE);
    return balance ? parseFloat(balance) : 50000;
  } catch (error) {
    console.error('Error getting balance:', error);
    return 50000;
  }
};

// Update balance
export const updateBalance = async (newBalance: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BALANCE, newBalance.toString());
  } catch (error) {
    console.error('Error updating balance:', error);
  }
};

// Get carbon credits
export const getCarbonCredits = async (): Promise<number> => {
  try {
    const credits = await AsyncStorage.getItem(STORAGE_KEYS.CARBON_CREDITS);
    return credits ? parseInt(credits) : 245;
  } catch (error) {
    console.error('Error getting carbon credits:', error);
    return 245;
  }
};

// Update carbon credits
export const updateCarbonCredits = async (newCredits: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CARBON_CREDITS, newCredits.toString());
  } catch (error) {
    console.error('Error updating carbon credits:', error);
  }
};

// Get all transactions
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const transactions = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return transactions ? JSON.parse(transactions) : [];
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};

// Add new transaction
export const addTransaction = async (transaction: Transaction): Promise<void> => {
  try {
    const transactions = await getTransactions();
    const updatedTransactions = [transaction, ...transactions];
    await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updatedTransactions));
  } catch (error) {
    console.error('Error adding transaction:', error);
  }
};

// Process payment (deduct balance, add credits, save transaction)
export const processPayment = async (
  amount: number,
  merchant: string,
  category: string,
  icon: string = 'payment'
): Promise<{ success: boolean; message: string; transaction?: Transaction }> => {
  try {
    console.log('=== PROCESSING PAYMENT ===');
    console.log('Amount:', amount);
    console.log('Merchant:', merchant);
    console.log('Category:', category);

    const currentBalance = await getBalance();
    console.log('Current Balance:', currentBalance);

    if (currentBalance < amount) {
      console.log('INSUFFICIENT BALANCE!');
      return { success: false, message: 'Insufficient balance' };
    }

    // Calculate carbon credits (1 credit per ₹100 spent)
    const creditsEarned = Math.floor(amount / 100);
    console.log('Credits to earn:', creditsEarned);

    // Deduct balance
    const newBalance = currentBalance - amount;
    console.log('New Balance will be:', newBalance);
    await updateBalance(newBalance);
    console.log('Balance updated in storage');

    // Add carbon credits
    const currentCredits = await getCarbonCredits();
    console.log('Current Credits:', currentCredits);
    const newCredits = currentCredits + creditsEarned;
    console.log('New Credits will be:', newCredits);
    await updateCarbonCredits(newCredits);
    console.log('Credits updated in storage');

    // Create transaction
    const now = new Date();
    const transaction: Transaction = {
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
      },
    };

    console.log('Adding transaction to storage...');
    await addTransaction(transaction);
    console.log('Transaction added!');
    console.log('=== PAYMENT COMPLETE ===');

    return {
      success: true,
      message: 'Payment successful',
      transaction,
    };
  } catch (error) {
    console.error('!!! ERROR PROCESSING PAYMENT !!!', error);
    return { success: false, message: 'Payment failed' };
  }
};

// Helper functions
const formatDate = (date: Date): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${formatTime(date)}`;
};

const formatTime = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

const formatFullDate = (date: Date): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

// Get theme
export const getTheme = async (): Promise<'light' | 'dark'> => {
  try {
    const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    return (theme as 'light' | 'dark') || 'light';
  } catch (error) {
    console.error('Error getting theme:', error);
    return 'light';
  }
};

// Update theme
export const updateTheme = async (theme: 'light' | 'dark'): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error('Error updating theme:', error);
  }
};

// Clear all data (for testing)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.BALANCE,
      STORAGE_KEYS.CARBON_CREDITS,
      STORAGE_KEYS.TRANSACTIONS,
      STORAGE_KEYS.THEME,
    ]);
    await initializeStorage();
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};
