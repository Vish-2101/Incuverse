import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { getVerifyApiUrl } from '../config/api';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../utils/theme';
import ThemeToggle from '../components/ThemeToggle';

const SignupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const themeColors = getThemeColors(theme);
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle sending the OTP to the backend
  const handleSendOtp = async () => {
    if (!phoneNumber.trim() || phoneNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    try {
      // Prepend country code '91' before sending to backend
      const fullPhoneNumber = `91${phoneNumber}`;
      const response = await fetch(`${getVerifyApiUrl()}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: fullPhoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsOtpSent(true);
        Alert.alert('OTP Sent', 'Please check your phone for the verification code.');
      } else {
        throw new Error(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Send OTP Error:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle verifying the OTP with the backend
  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      // Prepend country code '91' for verification
      const fullPhoneNumber = `91${phoneNumber}`;
      const response = await fetch(`${getVerifyApiUrl()}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: fullPhoneNumber, otp: otp }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Phone number verified successfully!');
        navigation.navigate('Registration', { phoneNumber: fullPhoneNumber }); // Navigate to the next screen
      } else {
        throw new Error(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Determines button text based on loading and OTP state
  const getButtonText = () => {
    if (isLoading) {
        return isOtpSent ? 'Verifying...' : 'Sending OTP...';
    }
    return isOtpSent ? 'Verify & Continue' : 'Send OTP';
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#00C896', '#00A876']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sign Up</Text>
          <ThemeToggle size={24} style={styles.themeToggle} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: themeColors.text }]}>Phone Number</Text>
          <View style={[styles.phoneInputWrapper, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
            <Text style={[styles.countryCode, { color: themeColors.textSecondary }]}>+91</Text>
            <TextInput
              style={[styles.phoneInput, { color: themeColors.text }]}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter your 10-digit number"
              placeholderTextColor={themeColors.textTertiary}
              keyboardType="phone-pad"
              autoCapitalize="none"
              editable={!isOtpSent} // Disable after OTP is sent
              maxLength={10}
            />
          </View>
        </View>

        {isOtpSent && (
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: themeColors.text }]}>Enter OTP</Text>
            <TextInput
              style={[styles.input, { backgroundColor: themeColors.surface, borderColor: themeColors.border, color: themeColors.text }]}
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter 6-digit OTP"
              placeholderTextColor={themeColors.textTertiary}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={isOtpSent ? handleVerifyOtp : handleSendOtp}
          disabled={isLoading}
        >
          <LinearGradient
            colors={isLoading ? ['#B0B0B0', '#909090'] : ['#00C896', '#00A876']}
            style={styles.buttonGradient}
          >
            {isLoading ? (
                <ActivityIndicator size="small" color="white" />
            ) : (
                <Text style={styles.primaryButtonText}>{getButtonText()}</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {isOtpSent && !isLoading && (
          <TouchableOpacity style={styles.resendButton} onPress={handleSendOtp}>
            <Text style={[styles.resendButtonText, { color: themeColors.primary }]}>Resend OTP</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={[styles.loginLinkText, { color: themeColors.textSecondary }]}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  themeToggle: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#F8F8F8',
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
  },
  countryCode: {
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333333',
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    paddingRight: 16,
  },
  primaryButton: {
    marginTop: 20,
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  resendButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  resendButtonText: {
    fontSize: 16,
    color: '#00C896',
    textDecorationLine: 'underline',
  },
  loginLink: {
    marginTop: 30,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 16,
    color: '#666666',
  },
});

export default SignupScreen;