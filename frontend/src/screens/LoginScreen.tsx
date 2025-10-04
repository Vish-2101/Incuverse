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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../utils/theme';
import ThemeToggle from '../components/ThemeToggle';
import { setUserId } from '../utils/storage';
import { getApiBaseUrl } from '../config/api';

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const themeColors = getThemeColors(theme);
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (phoneNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number.');
      return;
    }
    const fullPhoneNumber = `91${phoneNumber}`;
    setIsLoading(true);

    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/login/send-otp`, {
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
        throw new Error(data.message || 'Failed to send OTP.');
      }
    } catch (error) {
      console.error('Send OTP Error:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit OTP.');
      return;
    }
    const fullPhoneNumber = `91${phoneNumber}`;
    setIsLoading(true);

    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/login/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: fullPhoneNumber, otp }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Securely store the JWT
        await AsyncStorage.setItem('userToken', data.token);
        
        // Set user ID for MongoDB integration
        if (data.userId) {
          await setUserId(data.userId);
        }
        
        Alert.alert('Success', 'Login successful!');
        navigation.navigate('DashboardTabs');
      } else {
        throw new Error(data.message || 'Invalid OTP or login failed.');
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

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
          <Text style={styles.headerTitle}>Login</Text>
          <ThemeToggle size={24} style={styles.themeToggle} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: themeColors.text }]}>Phone Number</Text>
           <View style={[styles.phoneInputContainer, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
            <Text style={[styles.countryCode, { color: themeColors.textSecondary }]}>+91</Text>
            <TextInput
              style={[styles.phoneInput, { color: themeColors.text }]}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter your 10-digit number"
              placeholderTextColor={themeColors.textTertiary}
              keyboardType="phone-pad"
              autoCapitalize="none"
              maxLength={10}
              editable={!isOtpSent}
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
            {isLoading ? <ActivityIndicator size="small" color="#fff" /> : 
              <Text style={styles.primaryButtonText}>
                {isOtpSent ? 'Verify OTP & Login' : 'Send OTP'}
              </Text>
            }
          </LinearGradient>
        </TouchableOpacity>

        {isOtpSent && !isLoading && (
          <TouchableOpacity style={styles.resendButton} onPress={handleSendOtp}>
            <Text style={[styles.resendButtonText, { color: themeColors.primary }]}>Resend OTP</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.signupLink}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={[styles.signupLinkText, { color: themeColors.textSecondary }]}>
            Don't have an account? Sign Up
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
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        backgroundColor: '#F8F8F8',
    },
    countryCode: {
        fontSize: 16,
        paddingHorizontal: 12,
        color: '#555',
    },
    phoneInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
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
    primaryButton: {
        marginTop: 20,
        borderRadius: 25,
        overflow: 'hidden',
    },
    buttonGradient: {
        paddingVertical: 16,
        alignItems: 'center',
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
    signupLink: {
        marginTop: 30,
        alignItems: 'center',
    },
    signupLinkText: {
        fontSize: 16,
        color: '#666666',
    },
});

export default LoginScreen;

