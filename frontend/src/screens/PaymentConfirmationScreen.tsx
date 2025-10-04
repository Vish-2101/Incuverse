import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { processPayment } from '../utils/storage';
import { useTheme } from '../contexts/ThemeContext';

interface PaymentConfirmationScreenProps {
  route: any;
  navigation: any;
}

const PaymentConfirmationScreen: React.FC<PaymentConfirmationScreenProps> = ({
  route,
  navigation,
}) => {
  const { category, provider } = route.params;
  const { isDark } = useTheme();
  const styles = getStyles(isDark);
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [pin, setPin] = useState(['', '', '', '']);
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const pinRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;

  const savedAccounts = [
    { id: 1, type: 'Bank Account', name: 'HDFC Bank', number: '****1234', icon: 'account-balance' },
    { id: 2, type: 'Bank Account', name: 'ICICI Bank', number: '****5678', icon: 'account-balance' },
    { id: 3, type: 'UPI', name: 'Google Pay', number: 'user@okaxis', icon: 'qr-code' },
    { id: 4, type: 'Wallet', name: 'Paytm', number: '+91 98765****', icon: 'account-balance-wallet' },
  ];

  const handlePinChange = (value: string, index: number) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < 3) {
        pinRefs[index + 1].current?.focus();
      }
    }
  };

  const handlePinKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  const handlePayNow = () => {
    if (!accountNumber || accountNumber.trim().length === 0) {
      Alert.alert('Error', 'Please enter account/consumer number');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    if (!selectedAccount) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    setShowPinEntry(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleConfirmPayment = async () => {
    const enteredPin = pin.join('');
    if (enteredPin.length !== 4) {
      Alert.alert('Error', 'Please enter a 4-digit PIN');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(async () => {
      // Process the payment
      console.log('Processing payment:', {
        amount: parseFloat(amount),
        provider: provider.name,
        category,
      });

      const result = await processPayment(
        parseFloat(amount),
        provider.name,
        category,
        provider.logo
      );

      console.log('Payment result:', result);

      setIsProcessing(false);

      if (result.success) {
        setShowSuccess(true);

        // Animate success screen
        Animated.sequence([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(checkAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();

        // Navigate back after showing success
        setTimeout(() => {
          navigation.navigate('DashboardTabs');
        }, 3000);
      } else {
        Alert.alert('Payment Failed', result.message);
        setShowPinEntry(false);
      }
    }, 2000);
  };

  if (showSuccess) {
    return (
      <View style={styles.successContainer}>
        <Animated.View
          style={[
            styles.successCircle,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Animated.View
            style={{
              opacity: checkAnim,
            }}
          >
            <MaterialIcons name="check" size={80} color="white" />
          </Animated.View>
        </Animated.View>

        <Text style={styles.successTitle}>Payment Successful!</Text>
        <Text style={styles.successAmount}>₹{amount}</Text>
        <Text style={styles.successProvider}>Paid to {provider.name}</Text>

        <View style={styles.successCreditsCard}>
          <MaterialIcons name="eco" size={32} color="#00C896" />
          <Text style={styles.successCreditsText}>
            +{Math.floor(parseFloat(amount) / 100)} Carbon Credits Earned
          </Text>
        </View>
      </View>
    );
  }

  if (showPinEntry) {
    return (
      <View style={styles.container}>
        <View style={styles.pinHeaderContainer}>
          <TouchableOpacity onPress={() => setShowPinEntry(false)} style={styles.pinBackButton}>
            <MaterialIcons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : '#333333'} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.pinScrollContainer}
          contentContainerStyle={styles.pinScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[styles.pinContainer, { opacity: fadeAnim }]}>
            <View style={styles.paymentSummary}>
              <MaterialIcons name="lock" size={40} color="#00C896" />
              <Text style={styles.summaryAmount}>₹{amount}</Text>
              <Text style={styles.summaryProvider}>{provider.name}</Text>
              <Text style={styles.summaryCategory}>{category} Bill Payment</Text>
            </View>

            <View style={styles.pinInputContainer}>
              <Text style={styles.pinLabel}>Enter 4-digit PIN</Text>
              <View style={styles.pinBoxes}>
                {pin.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={pinRefs[index]}
                    style={styles.pinBox}
                    value={digit}
                    onChangeText={(value) => handlePinChange(value, index)}
                    onKeyPress={(e) => handlePinKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    secureTextEntry
                    selectTextOnFocus
                  />
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.confirmButton, isProcessing && styles.confirmButtonDisabled]}
              onPress={handleConfirmPayment}
              disabled={isProcessing}
            >
              <LinearGradient colors={['#00C896', '#00A876']} style={styles.confirmGradient}>
                {isProcessing ? (
                  <Text style={styles.confirmButtonText}>Processing...</Text>
                ) : (
                  <>
                    <MaterialIcons name="check-circle" size={24} color="white" />
                    <Text style={styles.confirmButtonText}>Confirm Payment</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#00C896', '#00A876']} style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('DashboardTabs', { screen: 'Payments' });
          }}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Details</Text>
        <Text style={styles.headerSubtitle}>{provider.name}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.providerCard}>
          <View style={styles.providerInfo}>
            <View style={styles.providerLogo}>
              <Text style={styles.providerEmoji}>{provider.logo}</Text>
            </View>
            <View>
              <Text style={styles.providerName}>{provider.name}</Text>
              <Text style={styles.providerCategory}>{category} Bill</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enter Account/Consumer Number</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="receipt" size={20} color={isDark ? '#AAAAAA' : '#666666'} />
            <TextInput
              style={styles.input}
              placeholder="Enter account number"
              placeholderTextColor={isDark ? '#888888' : '#999999'}
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enter Amount</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="currency-rupee" size={20} color={isDark ? '#AAAAAA' : '#666666'} />
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor={isDark ? '#888888' : '#999999'}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>
          {amount && parseFloat(amount) > 0 && (
            <View style={styles.creditsInfo}>
              <MaterialIcons name="eco" size={16} color="#00C896" />
              <Text style={styles.creditsInfoText}>
                You'll earn {Math.floor(parseFloat(amount) / 100)} carbon credits
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          {savedAccounts.map((account) => (
            <TouchableOpacity
              key={account.id}
              style={[
                styles.accountCard,
                selectedAccount?.id === account.id && styles.accountCardSelected,
              ]}
              onPress={() => setSelectedAccount(account)}
            >
              <View style={styles.accountInfo}>
                <View
                  style={[
                    styles.accountIcon,
                    selectedAccount?.id === account.id && styles.accountIconSelected,
                  ]}
                >
                  <MaterialIcons
                    name={account.icon as any}
                    size={24}
                    color={selectedAccount?.id === account.id ? '#00C896' : '#666666'}
                  />
                </View>
                <View style={styles.accountDetails}>
                  <Text style={styles.accountName}>{account.name}</Text>
                  <Text style={styles.accountNumber}>{account.number}</Text>
                </View>
              </View>
              {selectedAccount?.id === account.id && (
                <MaterialIcons name="check-circle" size={24} color="#00C896" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.payButton,
            (!accountNumber || !amount || !selectedAccount) && styles.payButtonDisabled
          ]}
          onPress={handlePayNow}
          disabled={!accountNumber || !amount || !selectedAccount}
        >
          <LinearGradient
            colors={
              (!accountNumber || !amount || !selectedAccount)
                ? ['#CCCCCC', '#AAAAAA']
                : ['#00C896', '#00A876']
            }
            style={styles.payGradient}
          >
            <Text style={styles.payButtonText}>
              Pay {amount ? `₹${amount}` : 'Now'}
            </Text>
            <MaterialIcons name="arrow-forward" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1A1A1A' : '#F8F9FA',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  pinHeaderContainer: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: isDark ? '#1A1A1A' : '#F8F9FA',
  },
  pinBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backButton: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  providerCard: {
    backgroundColor: isDark ? '#2D2D2D' : 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: isDark ? '#1A1A1A' : '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  providerEmoji: {
    fontSize: 32,
  },
  providerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#333333',
    marginBottom: 4,
  },
  providerCategory: {
    fontSize: 14,
    color: isDark ? '#AAAAAA' : '#666666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#333333',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#2D2D2D' : 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: isDark ? '#FFFFFF' : '#333333',
  },
  creditsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8F5',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  creditsInfoText: {
    fontSize: 14,
    color: '#00C896',
    fontWeight: '600',
    marginLeft: 8,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: isDark ? '#2D2D2D' : 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  accountCardSelected: {
    borderColor: '#00C896',
    backgroundColor: '#F0FDF9',
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: isDark ? '#1A1A1A' : '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  accountIconSelected: {
    backgroundColor: '#E8F8F5',
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#333333',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    color: isDark ? '#AAAAAA' : '#666666',
  },
  footer: {
    padding: 20,
    backgroundColor: isDark ? '#2D2D2D' : 'white',
    borderTopWidth: 1,
    borderTopColor: isDark ? '#444444' : '#EEEEEE',
  },
  payButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  bottomSpacing: {
    height: 20,
  },
  // PIN Entry Styles
  pinScrollContainer: {
    flex: 1,
  },
  pinScrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  pinContainer: {
    padding: 20,
    paddingTop: 10,
  },
  paymentSummary: {
    alignItems: 'center',
    backgroundColor: isDark ? '#2D2D2D' : 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryAmount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#333333',
    marginTop: 12,
  },
  summaryProvider: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#333333',
    marginTop: 6,
  },
  summaryCategory: {
    fontSize: 13,
    color: isDark ? '#AAAAAA' : '#666666',
    marginTop: 4,
  },
  pinInputContainer: {
    backgroundColor: isDark ? '#2D2D2D' : 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pinLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#333333',
    textAlign: 'center',
    marginBottom: 20,
  },
  pinBoxes: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pinBox: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#00C896',
    borderRadius: 12,
    marginHorizontal: 8,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: isDark ? '#FFFFFF' : '#333333',
    backgroundColor: isDark ? '#1A1A1A' : 'white',
  },
  confirmButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  // Success Screen Styles
  successContainer: {
    flex: 1,
    backgroundColor: isDark ? '#1A1A1A' : '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#00C896',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#333333',
    marginBottom: 16,
  },
  successAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00C896',
    marginBottom: 8,
  },
  successProvider: {
    fontSize: 18,
    color: isDark ? '#AAAAAA' : '#666666',
    marginBottom: 32,
  },
  successCreditsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#2D2D2D' : 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successCreditsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00C896',
    marginLeft: 12,
  },
});

export default PaymentConfirmationScreen;
