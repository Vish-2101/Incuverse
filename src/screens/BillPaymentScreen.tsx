import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface BillPaymentScreenProps {
  route: any;
  navigation: any;
}

const BillPaymentScreen: React.FC<BillPaymentScreenProps> = ({ route, navigation }) => {
  const { category } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  // Provider data for each category
  const providerData: { [key: string]: any[] } =
    {
      'Electricity': [
        { id: 1, name: 'Tata Power', logo: '⚡', popular: true },
        { id: 2, name: 'Adani Electricity', logo: '⚡', popular: true },
        { id: 3, name: 'BSES Rajdhani', logo: '⚡', popular: false },
        { id: 4, name: 'BSES Yamuna', logo: '⚡', popular: false },
        { id: 5, name: 'Torrent Power', logo: '⚡', popular: true },
        { id: 6, name: 'MSEDCL', logo: '⚡', popular: false },
      ],
      'Airlines': [
        { id: 1, name: 'IndiGo', logo: '✈️', popular: true },
        { id: 2, name: 'Air India', logo: '🛫', popular: true },
        { id: 3, name: 'Vistara', logo: '✈️', popular: true },
        { id: 4, name: 'SpiceJet', logo: '🛫', popular: false },
        { id: 5, name: 'Air Asia India', logo: '✈️', popular: false },
        { id: 6, name: 'GoFirst', logo: '🛫', popular: false },
      ],
      'Mobile': [
        { id: 1, name: 'Airtel', logo: '📱', popular: true },
        { id: 2, name: 'Jio', logo: '📱', popular: true },
        { id: 3, name: 'Vi (Vodafone Idea)', logo: '📱', popular: true },
        { id: 4, name: 'BSNL', logo: '📱', popular: false },
        { id: 5, name: 'Airtel Postpaid', logo: '📱', popular: false },
        { id: 6, name: 'Jio Postpaid', logo: '📱', popular: false },
      ],
      'Internet': [
        { id: 1, name: 'Airtel Xstream Fiber', logo: '🌐', popular: true },
        { id: 2, name: 'JioFiber', logo: '🌐', popular: true },
        { id: 3, name: 'ACT Fibernet', logo: '🌐', popular: true },
        { id: 4, name: 'Hathway Broadband', logo: '🌐', popular: false },
        { id: 5, name: 'Spectra', logo: '🌐', popular: false },
        { id: 6, name: 'You Broadband', logo: '🌐', popular: false },
      ],
      'Gas': [
        { id: 1, name: 'HP Gas', logo: '🔥', popular: true },
        { id: 2, name: 'Bharat Petroleum', logo: '🔥', popular: true },
        { id: 3, name: 'Mahanagar Gas', logo: '🔥', popular: true },
        { id: 4, name: 'Adani Gas', logo: '🔥', popular: true },
        { id: 5, name: 'Jio Gas', logo: '🔥', popular: false },
      ],
      'Credit Card': [
        { id: 1, name: 'HDFC Bank Credit Card', logo: '💳', popular: true },
        { id: 2, name: 'ICICI Bank Credit Card', logo: '💳', popular: true },
        { id: 3, name: 'SBI Card', logo: '💳', popular: true },
        { id: 4, name: 'Axis Bank Credit Card', logo: '💳', popular: false },
        { id: 5, name: 'Kotak Mahindra Credit Card', logo: '💳', popular: false },
        { id: 6, name: 'American Express India', logo: '💳', popular: false },
      ],
      'Food & Dining': [
        { id: 1, name: 'Zomato', logo: '🍽️', popular: true },
        { id: 2, name: 'Swiggy', logo: '🍽️', popular: true },
        { id: 3, name: 'Domino’s', logo: '🍽️', popular: true },
        { id: 4, name: 'McDonald’s India', logo: '🍽️', popular: false },
        { id: 5, name: 'Pizza Hut', logo: '🍽️', popular: false },
        { id: 6, name: 'Barbeque Nation', logo: '🍽️', popular: false },
      ],
      'Insurance': [
        { id: 1, name: 'LIC of India', logo: '🛡️', popular: true },
        { id: 2, name: 'HDFC Life', logo: '🛡️', popular: true },
        { id: 3, name: 'ICICI Lombard', logo: '🛡️', popular: true },
        { id: 4, name: 'Tata AIA Life', logo: '🛡️', popular: false },
        { id: 5, name: 'Bajaj Allianz', logo: '🛡️', popular: false },
        { id: 6, name: 'SBI Life Insurance', logo: '🛡️', popular: true },
      ],
      'Shopping': [
        { id: 1, name: 'Amazon India', logo: '🛒', popular: true },
        { id: 2, name: 'Flipkart', logo: '🛒', popular: true },
        { id: 3, name: 'Myntra', logo: '🛒', popular: true },
        { id: 4, name: 'Ajio', logo: '🛒', popular: false },
        { id: 5, name: 'Tata CLiQ', logo: '🛒', popular: false },
        { id: 6, name: 'Nykaa', logo: '🛒', popular: true },
      ],
      'Entertainment': [
        { id: 1, name: 'Netflix India', logo: '🎬', popular: true },
        { id: 2, name: 'Amazon Prime Video', logo: '🎬', popular: true },
        { id: 3, name: 'Disney+ Hotstar', logo: '🎬', popular: true },
        { id: 4, name: 'SonyLIV', logo: '🎬', popular: false },
        { id: 5, name: 'ZEE5', logo: '🎬', popular: false },
        { id: 6, name: 'JioCinema', logo: '🎬', popular: true },
      ],
      'Transport': [
        { id: 1, name: 'Ola Cabs', logo: '🚗', popular: true },
        { id: 2, name: 'Uber India', logo: '🚗', popular: true },
        { id: 3, name: 'Rapido', logo: '🚗', popular: true },
        { id: 4, name: 'RedBus', logo: '🚗', popular: false },
        { id: 5, name: 'IRCTC', logo: '🚗', popular: true },
        { id: 6, name: 'BluSmart', logo: '🚗', popular: false },
      ],
      'Rent': [
        { id: 1, name: 'NoBroker Rent Payment', logo: '🏠', popular: true },
        { id: 2, name: 'Housing.com Pay Rent', logo: '🏠', popular: false },
        { id: 3, name: 'Paytm Rent Payment', logo: '🏠', popular: true },
        { id: 4, name: 'CRED RentPay', logo: '🏠', popular: true },
        { id: 5, name: 'PhonePe Rent Payment', logo: '🏠', popular: false },
      ],    
  };

  const providers = providerData[category] || [];
  const popularProviders = providers.filter(p => p.popular);
  const otherProviders = providers.filter(p => !p.popular);

  const handleProviderSelect = (provider: any) => {
    navigation.navigate('PaymentConfirmation', {
      category,
      provider,
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#00C896', '#00A876']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category} Bill Payment</Text>
        <Text style={styles.headerSubtitle}>Select your provider</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search provider"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {popularProviders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Providers</Text>
            {popularProviders.map((provider) => (
              <TouchableOpacity
                key={provider.id}
                style={styles.providerCard}
                onPress={() => handleProviderSelect(provider)}
              >
                <View style={styles.providerInfo}>
                  <View style={styles.providerLogo}>
                    <Text style={styles.providerEmoji}>{provider.logo}</Text>
                  </View>
                  <Text style={styles.providerName}>{provider.name}</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={20} color="#CCCCCC" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {otherProviders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Providers</Text>
            {otherProviders.map((provider) => (
              <TouchableOpacity
                key={provider.id}
                style={styles.providerCard}
                onPress={() => handleProviderSelect(provider)}
              >
                <View style={styles.providerInfo}>
                  <View style={styles.providerLogo}>
                    <Text style={styles.providerEmoji}>{provider.logo}</Text>
                  </View>
                  <Text style={styles.providerName}>{provider.name}</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={20} color="#CCCCCC" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: '#333333',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  providerLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  providerEmoji: {
    fontSize: 24,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default BillPaymentScreen;
