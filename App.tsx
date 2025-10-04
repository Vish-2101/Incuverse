import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';

import LoadingScreen from './src/screens/LoadingScreen';
import SplashScreenComponent from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import BadgeDetailsScreen from './src/screens/BadgeDetailsScreen';
import EnvironmentalEducationScreen from './src/screens/EnvironmentalEducationScreen';
import BillPaymentScreen from './src/screens/BillPaymentScreen';
import PaymentConfirmationScreen from './src/screens/PaymentConfirmationScreen';
import ActivityDetailsScreen from './src/screens/ActivityDetailsScreen';
import TransactionHistoryScreen from './src/screens/TransactionHistoryScreen';
import TransactionDetailsScreen from './src/screens/TransactionDetailsScreen';
import DashboardTabs from './src/navigation/DashboardTabs';
import type { RootStackParamList } from './src/types/navigation';
import { initializeStorage, clearAllData } from './src/utils/storage';

const Stack = createStackNavigator<RootStackParamList>();

SplashScreen.preventAutoHideAsync();

export default function App() {
  // Initialize storage once when app starts
  useEffect(() => {
    // Uncomment the line below to reset balance to ₹1,00,000 and credits to 245
    // clearAllData();

    initializeStorage();
  }, []);
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // First show loading screen for 2 seconds
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Then show splash screen for 2 more seconds
    setTimeout(() => {
      setShowSplash(false);
      SplashScreen.hideAsync();
    }, 4000);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (showSplash) {
    return <SplashScreenComponent />;
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Onboarding"
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Registration" component={RegistrationScreen} />
          <Stack.Screen name="DashboardTabs" component={DashboardTabs} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="BadgeDetails" component={BadgeDetailsScreen} />
          <Stack.Screen name="EnvironmentalEducation" component={EnvironmentalEducationScreen} />
          <Stack.Screen name="BillPayment" component={BillPaymentScreen} />
          <Stack.Screen name="PaymentConfirmation" component={PaymentConfirmationScreen} />
          <Stack.Screen name="ActivityDetails" component={ActivityDetailsScreen} />
          <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
          <Stack.Screen name="TransactionDetails" component={TransactionDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
