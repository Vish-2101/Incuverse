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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSendOtp = () => {
    if (!phoneOrEmail.trim()) {
      Alert.alert('Error', 'Please enter your phone number or email');
      return;
    }
    setIsOtpSent(true);
    Alert.alert('OTP Sent', 'Please check your phone/email for the verification code');
  };

  const handleVerifyOtp = () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }
    Alert.alert('Success', 'Login successful!');
    navigation.navigate('DashboardTabs');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#00C896', '#00A876']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Login</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number or Email</Text>
          <TextInput
            style={styles.input}
            value={phoneOrEmail}
            onChangeText={setPhoneOrEmail}
            placeholder="Enter phone number or email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {isOtpSent && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enter OTP</Text>
            <TextInput
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter 6-digit OTP"
              keyboardType="numeric"
              maxLength={6}
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={isOtpSent ? handleVerifyOtp : handleSendOtp}
        >
          <LinearGradient
            colors={['#00C896', '#00A876']}
            style={styles.buttonGradient}
          >
            <Text style={styles.primaryButtonText}>
              {isOtpSent ? 'Verify OTP' : 'Send OTP'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {isOtpSent && (
          <TouchableOpacity style={styles.resendButton} onPress={handleSendOtp}>
            <Text style={styles.resendButtonText}>Resend OTP</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.signupLink}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.signupLinkText}>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
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