import { 
  getTransactionsApiUrl, 
  getBalanceApiUrl, 
  getCarbonCreditsApiUrl, 
  getProfileApiUrl 
} from '../config/api';

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

export interface Balance {
  amount: number;
  currency: string;
  lastUpdated: string;
}

export interface CarbonCredits {
  credits: number;
  totalEarned: number;
  totalSpent: number;
  lastUpdated: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: string;
  address?: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    carbonTracking: boolean;
  };
  joinDate: string;
  lastActive: string;
}

// Generic API call function
const apiCall = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }

    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Transaction API calls
export const transactionApi = {
  // Get all transactions for a user
  getTransactions: async (userId: string, page = 1, limit = 20, category?: string, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category && { category }),
      ...(status && { status }),
    });
    
    return apiCall(`${getTransactionsApiUrl()}/user/${userId}?${params}`);
  },

  // Get a specific transaction
  getTransaction: async (transactionId: string) => {
    return apiCall(`${getTransactionsApiUrl()}/${transactionId}`);
  },

  // Process a payment
  processPayment: async (userId: string, amount: number, merchant: string, category: string, icon = 'payment') => {
    return apiCall(`${getTransactionsApiUrl()}/payment`, {
      method: 'POST',
      body: JSON.stringify({
        userId,
        amount,
        merchant,
        category,
        icon,
      }),
    });
  },

  // Add a bonus transaction
  addBonusTransaction: async (userId: string, amount: number, merchant: string, category: string, icon = 'card-giftcard', credits = 0) => {
    return apiCall(`${getTransactionsApiUrl()}/bonus`, {
      method: 'POST',
      body: JSON.stringify({
        userId,
        amount,
        merchant,
        category,
        icon,
        credits,
      }),
    });
  },

  // Update transaction status
  updateTransactionStatus: async (transactionId: string, status: 'Completed' | 'Pending' | 'Failed') => {
    return apiCall(`${getTransactionsApiUrl()}/${transactionId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// Balance API calls
export const balanceApi = {
  // Get user balance
  getBalance: async (userId: string) => {
    return apiCall(`${getBalanceApiUrl()}/user/${userId}`);
  },

  // Update user balance
  updateBalance: async (userId: string, amount: number, operation: 'set' | 'add' | 'subtract' = 'set') => {
    return apiCall(`${getBalanceApiUrl()}/user/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ amount, operation }),
    });
  },

  // Add funds to balance
  addFunds: async (userId: string, amount: number) => {
    return apiCall(`${getBalanceApiUrl()}/user/${userId}/add`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },
};

// Carbon Credits API calls
export const carbonCreditsApi = {
  // Get user carbon credits
  getCarbonCredits: async (userId: string) => {
    return apiCall(`${getCarbonCreditsApiUrl()}/user/${userId}`);
  },

  // Update carbon credits
  updateCarbonCredits: async (userId: string, credits: number, operation: 'set' | 'add' | 'subtract' = 'set') => {
    return apiCall(`${getCarbonCreditsApiUrl()}/user/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ credits, operation }),
    });
  },

  // Add carbon credits
  addCarbonCredits: async (userId: string, credits: number) => {
    return apiCall(`${getCarbonCreditsApiUrl()}/user/${userId}/add`, {
      method: 'POST',
      body: JSON.stringify({ credits }),
    });
  },

  // Spend carbon credits
  spendCarbonCredits: async (userId: string, credits: number) => {
    return apiCall(`${getCarbonCreditsApiUrl()}/user/${userId}/spend`, {
      method: 'POST',
      body: JSON.stringify({ credits }),
    });
  },
};

// User Profile API calls
export const profileApi = {
  // Get user profile
  getUserProfile: async (userId: string) => {
    return apiCall(`${getProfileApiUrl()}/user/${userId}`);
  },

  // Create or update user profile
  createOrUpdateProfile: async (userId: string, profileData: Partial<UserProfile>) => {
    return apiCall(`${getProfileApiUrl()}/user/${userId}`, {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  },

  // Update user preferences
  updatePreferences: async (userId: string, preferences: Partial<UserProfile['preferences']>) => {
    return apiCall(`${getProfileApiUrl()}/user/${userId}/preferences`, {
      method: 'PATCH',
      body: JSON.stringify({ preferences }),
    });
  },

  // Get user theme
  getTheme: async (userId: string) => {
    return apiCall(`${getProfileApiUrl()}/user/${userId}/theme`);
  },

  // Update user theme
  updateTheme: async (userId: string, theme: 'light' | 'dark') => {
    return apiCall(`${getProfileApiUrl()}/user/${userId}/theme`, {
      method: 'PATCH',
      body: JSON.stringify({ theme }),
    });
  },

  // Delete user profile
  deleteProfile: async (userId: string) => {
    return apiCall(`${getProfileApiUrl()}/user/${userId}`, {
      method: 'DELETE',
    });
  },
};
