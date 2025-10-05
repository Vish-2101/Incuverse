import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { getUsersApiUrl } from '../config/api';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../utils/theme';
import ThemeToggle from '../components/ThemeToggle';


const RegistrationScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const themeColors = getThemeColors(theme);
  
  // Safely access route.params to prevent TypeError if it's undefined
  const { phoneNumber } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    address: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    idType: '',
    idNumber: '',
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Add a check to ensure phoneNumber exists before submitting
    if (!phoneNumber) {
      Alert.alert('Error', 'An error occurred. Please go back and verify your phone number again.');
      return;
    }

    const requiredFields: (keyof typeof formData)[] = ['fullName', 'bankName', 'accountNumber', 'ifscCode'];
    const missingFields = requiredFields.filter(field => !formData[field].trim());

    if (missingFields.length > 0) {
      Alert.alert('Error', 'Please fill in all required fields marked with *');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${getUsersApiUrl()}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phoneNumber: phoneNumber, // Add the verified phone number
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Registration Successful!',
          'Your account has been created successfully.',
          [{
            text: 'OK',
            // Updated navigation to target "DashboardScreen" as requested
            onPress: () => navigation.navigate('Login')
          }]
        );
      } else {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Submit Registration Error:', error);
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
          <Text style={styles.headerTitle}>Complete Registration</Text>
          <ThemeToggle size={24} style={styles.themeToggle} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Personal Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.fullName}
              onChangeText={(value) => handleInputChange('fullName', value)}
              placeholder="Enter your full name"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              value={formData.dateOfBirth}
              onChangeText={(value) => handleInputChange('dateOfBirth', value)}
              placeholder="DD/MM/YYYY"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              placeholder="Enter your address"
              multiline={true}
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bank Details</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bank Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.bankName}
              onChangeText={(value) => handleInputChange('bankName', value)}
              placeholder="e.g., State Bank of India"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Account Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.accountNumber}
              onChangeText={(value) => handleInputChange('accountNumber', value)}
              placeholder="Enter account number"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>IFSC Code *</Text>
            <TextInput
              style={styles.input}
              value={formData.ifscCode}
              onChangeText={(value) => handleInputChange('ifscCode', value)}
              placeholder="e.g., SBIN0001234"
              autoCapitalize="characters"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identification</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>ID Type</Text>
            <TextInput
              style={styles.input}
              value={formData.idType}
              onChangeText={(value) => handleInputChange('idType', value)}
              placeholder="e.g., Aadhaar, PAN, Passport"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>ID Number</Text>
            <TextInput
              style={styles.input}
              value={formData.idNumber}
              onChangeText={(value) => handleInputChange('idNumber', value)}
              placeholder="Enter ID number"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
          <LinearGradient
            colors={isLoading ? ['#B0B0B0', '#909090'] : ['#00C896', '#00A876']}
            style={styles.buttonGradient}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Complete Registration</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
    fontSize: 20,
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
  },
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 30,
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  bottomSpacing: {
    height: 50,
  },
});

export default RegistrationScreen;