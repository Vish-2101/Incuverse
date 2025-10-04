import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCarbonCredits, updateCarbonCredits as storageUpdateCredits } from '../utils/storage';

interface CreditsContextType {
  credits: number;
  refreshCredits: () => Promise<void>;
  updateCredits: (newCredits: number) => Promise<void>;
  deductCredits: (amount: number) => Promise<boolean>;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

interface CreditsProviderProps {
  children: ReactNode;
}

export const CreditsProvider: React.FC<CreditsProviderProps> = ({ children }) => {
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    refreshCredits();
  }, []);

  const refreshCredits = async () => {
    try {
      const currentCredits = await getCarbonCredits();
      setCredits(currentCredits);
    } catch (error) {
      console.error('Error refreshing credits:', error);
    }
  };

  const updateCredits = async (newCredits: number) => {
    try {
      await storageUpdateCredits(newCredits);
      setCredits(newCredits);
      console.log('✅ Credits updated to:', newCredits);
    } catch (error) {
      console.error('Error updating credits:', error);
    }
  };

  const deductCredits = async (amount: number): Promise<boolean> => {
    if (credits < amount) {
      return false;
    }
    const newCredits = credits - amount;
    await updateCredits(newCredits);
    return true;
  };

  const value: CreditsContextType = {
    credits,
    refreshCredits,
    updateCredits,
    deductCredits,
  };

  return (
    <CreditsContext.Provider value={value}>
      {children}
    </CreditsContext.Provider>
  );
};

export const useCredits = (): CreditsContextType => {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  return context;
};
