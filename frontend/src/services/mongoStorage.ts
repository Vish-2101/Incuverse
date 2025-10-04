import AsyncStorage from '@react-native-async-storage/async-storage';
import { transactionApi, balanceApi, carbonCreditsApi, profileApi, Transaction, Balance, CarbonCredits, UserProfile } from './apiService';

const STORAGE_KEYS = {
  USER_ID: '@ecocred_user_id',
  THEME: '@ecocred_theme',
};

// Get current user ID from AsyncStorage
const getCurrentUserId = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};

// Set current user ID in AsyncStorage
const setCurrentUserId = async (userId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  } catch (error) {
    console.error('Error setting user ID:', error);
  }
};

// Initialize storage with user ID
export const initializeStorage = async (userId?: string) => {
  try {
    if (userId) {
      await setCurrentUserId(userId);
    }

    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      console.log('No user ID found. Please login first.');
      return;
    }

    // Initialize user data in MongoDB
    await Promise.all([
      balanceApi.getBalance(currentUserId).catch(() => {
        console.log('Balance will be created on first access');
      }),
      carbonCreditsApi.getCarbonCredits(currentUserId).catch(() => {
        console.log('Carbon credits will be created on first access');
      }),
    ]);

    console.log('✅ Storage initialized for user:', currentUserId);
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Balance operations
export const getBalance = async (): Promise<number> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.log('No user ID found. Using default balance.');
      return 100000;
    }

    const response = await balanceApi.getBalance(userId);
    return response.data.amount;
  } catch (error) {
    console.error('Error getting balance:', error);
    return 100000; // Default balance
  }
};

export const updateBalance = async (newBalance: number): Promise<void> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.error('No user ID found. Cannot update balance.');
      return;
    }

    await balanceApi.updateBalance(userId, newBalance, 'set');
  } catch (error) {
    console.error('Error updating balance:', error);
  }
};

// Carbon Credits operations
export const getCarbonCredits = async (): Promise<number> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.log('No user ID found. Using default credits.');
      return 245;
    }

    const response = await carbonCreditsApi.getCarbonCredits(userId);
    return response.data.credits;
  } catch (error) {
    console.error('Error getting carbon credits:', error);
    return 245; // Default credits
  }
};

export const updateCarbonCredits = async (newCredits: number): Promise<void> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.error('No user ID found. Cannot update carbon credits.');
      return;
    }

    await carbonCreditsApi.updateCarbonCredits(userId, newCredits, 'set');
  } catch (error) {
    console.error('Error updating carbon credits:', error);
  }
};

// Transaction operations
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.log('No user ID found. Returning empty transactions.');
      return [];
    }

    const response = await transactionApi.getTransactions(userId);
    return response.data.transactions;
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};

export const addTransaction = async (transaction: Transaction): Promise<void> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.error('No user ID found. Cannot add transaction.');
      return;
    }

    // For bonus transactions, use the bonus endpoint
    if (transaction.type === 'bonus') {
      await transactionApi.addBonusTransaction(
        userId,
        transaction.amount,
        transaction.merchant,
        transaction.category,
        transaction.icon,
        transaction.credits
      );
    } else {
      // For payment transactions, use the payment endpoint
      await transactionApi.processPayment(
        userId,
        transaction.amount,
        transaction.merchant,
        transaction.category,
        transaction.icon
      );
    }
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

    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, message: 'User not logged in' };
    }

    const currentBalance = await getBalance();
    console.log('Current Balance:', currentBalance);

    if (currentBalance < amount) {
      console.log('INSUFFICIENT BALANCE!');
      return { success: false, message: 'Insufficient balance' };
    }

    // Process payment through API
    const response = await transactionApi.processPayment(userId, amount, merchant, category, icon);
    
    console.log('=== PAYMENT COMPLETE ===');
    return {
      success: true,
      message: 'Payment successful',
      transaction: response.data,
    };
  } catch (error) {
    console.error('!!! ERROR PROCESSING PAYMENT !!!', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Payment failed' 
    };
  }
};

// Theme operations (still using AsyncStorage for immediate access)
export const getTheme = async (): Promise<'light' | 'dark'> => {
  try {
    const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    return (theme as 'light' | 'dark') || 'light';
  } catch (error) {
    console.error('Error getting theme:', error);
    return 'light';
  }
};

export const updateTheme = async (theme: 'light' | 'dark'): Promise<void> => {
  try {
    // Update in AsyncStorage for immediate access
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
    
    // Also update in MongoDB if user is logged in
    const userId = await getCurrentUserId();
    if (userId) {
      await profileApi.updateTheme(userId, theme);
    }
  } catch (error) {
    console.error('Error updating theme:', error);
  }
};

// User Profile operations
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }

    const response = await profileApi.getUserProfile(userId);
    return response.data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<void> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.error('No user ID found. Cannot update profile.');
      return;
    }

    await profileApi.createOrUpdateProfile(userId, profileData);
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
};

// Clear all data (for testing)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_ID,
      STORAGE_KEYS.THEME,
    ]);
    await initializeStorage();
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

// Set user ID (call this after successful login)
export const setUserId = async (userId: string): Promise<void> => {
  await setCurrentUserId(userId);
  await initializeStorage(userId);
};
