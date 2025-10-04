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
  const providerData: { [key: string]: any[] } = {
    'Electricity': [
      { id: 1, name: 'Tata Power', logo: '⚡', popular: true },
      { id: 2, name: 'Adani Electricity', logo: '💡', popular: true },
      { id: 3, name: 'BSES Rajdhani', logo: '🔌', popular: false },
      { id: 4, name: 'BSES Yamuna', logo: '⚡', popular: false },
      { id: 5, name: 'Torrent Power', logo: '💡', popular: true },
      { id: 6, name: 'MSEDCL', logo: '🔌', popular: false },
    ],
    'Water': [
      { id: 1, name: 'Delhi Jal Board', logo: '💧', popular: true },
      { id: 2, name: 'Mumbai Water Supply', logo: '💦', popular: true },
      { id: 3, name: 'Bangalore Water', logo: '💧', popular: false },
      { id: 4, name: 'Chennai Metro Water', logo: '💦', popular: false },
      { id: 5, name: 'Hyderabad Water', logo: '💧', popular: true },
    ],
    'Mobile': [
      { id: 1, name: 'Airtel', logo: '📱', popular: true },
      { id: 2, name: 'Jio', logo: '📲', popular: true },
      { id: 3, name: 'Vi (Vodafone Idea)', logo: '📱', popular: true },
      { id: 4, name: 'BSNL', logo: '📲', popular: false },
      { id: 5, name: 'Airtel Postpaid', logo: '📱', popular: false },
      { id: 6, name: 'Jio Postpaid', logo: '📲', popular: false },
    ],
    'Internet': [
      { id: 1, name: 'Airtel Broadband', logo: '🌐', popular: true },
      { id: 2, name: 'Jio Fiber', logo: '📡', popular: true },
      { id: 3, name: 'ACT Fibernet', logo: '🌐', popular: true },
      { id: 4, name: 'Hathway', logo: '📡', popular: false },
      { id: 5, name: 'Tikona', logo: '🌐', popular: false },
      { id: 6, name: 'YOU Broadband', logo: '📡', popular: false },
    ],
    'Gas': [
      { id: 1, name: 'Indraprastha Gas', logo: '🔥', popular: true },
      { id: 2, name: 'Mahanagar Gas', logo: '⛽', popular: true },
      { id: 3, name: 'Gujarat Gas', logo: '🔥', popular: false },
      { id: 4, name: 'Adani Gas', logo: '⛽', popular: true },
      { id: 5, name: 'Bharat Petroleum', logo: '🔥', popular: false },
    ],
    'Credit Card': [
      { id: 1, name: 'HDFC Bank', logo: '💳', popular: true },
      { id: 2, name: 'ICICI Bank', logo: '💳', popular: true },
      { id: 3, name: 'SBI Card', logo: '💳', popular: true },
      { id: 4, name: 'Axis Bank', logo: '💳', popular: false },
      { id: 5, name: 'American Express', logo: '💳', popular: false },
      { id: 6, name: 'Citibank', logo: '💳', popular: false },
    ],
    'Food & Dining': [
      { id: 1, name: 'Zomato', logo: '🍕', popular: true },
      { id: 2, name: 'Swiggy', logo: '🍔', popular: true },
      { id: 3, name: 'Starbucks', logo: '☕', popular: true },
      { id: 4, name: 'McDonald\'s', logo: '🍟', popular: false },
      { id: 5, name: 'Domino\'s', logo: '🍕', popular: false },
      { id: 6, name: 'KFC', logo: '🍗', popular: false },
    ],
    'Insurance': [
      { id: 1, name: 'LIC', logo: '🛡️', popular: true },
      { id: 2, name: 'HDFC Life', logo: '🏥', popular: true },
      { id: 3, name: 'ICICI Prudential', logo: '🛡️', popular: true },
      { id: 4, name: 'SBI Life', logo: '🏥', popular: false },
      { id: 5, name: 'Max Life', logo: '🛡️', popular: false },
      { id: 6, name: 'Bajaj Allianz', logo: '🏥', popular: false },
    ],
    'Shopping': [
      { id: 1, name: 'Amazon', logo: '📦', popular: true },
      { id: 2, name: 'Flipkart', logo: '🛍️', popular: true },
      { id: 3, name: 'Myntra', logo: '👗', popular: true },
      { id: 4, name: 'BigBasket', logo: '🛒', popular: false },
      { id: 5, name: 'Nykaa', logo: '💄', popular: false },
      { id: 6, name: 'Ajio', logo: '👔', popular: false },
    ],
    'Entertainment': [
      { id: 1, name: 'Netflix', logo: '🎬', popular: true },
      { id: 2, name: 'Amazon Prime', logo: '📺', popular: true },
      { id: 3, name: 'Disney+ Hotstar', logo: '🎥', popular: true },
      { id: 4, name: 'Spotify', logo: '🎵', popular: false },
      { id: 5, name: 'BookMyShow', logo: '🎟️', popular: false },
      { id: 6, name: 'Sony LIV', logo: '📺', popular: false },
    ],
    'Transport': [
      { id: 1, name: 'Uber', logo: '🚗', popular: true },
      { id: 2, name: 'Ola', logo: '🚕', popular: true },
      { id: 3, name: 'Metro Card Recharge', logo: '🚇', popular: true },
      { id: 4, name: 'Rapido', logo: '🛵', popular: false },
      { id: 5, name: 'IRCTC', logo: '🚂', popular: false },
      { id: 6, name: 'RedBus', logo: '🚌', popular: false },
    ],
    'Rent': [
      { id: 1, name: 'NoBroker', logo: '🏠', popular: true },
      { id: 2, name: 'MagicBricks', logo: '🏘️', popular: true },
      { id: 3, name: '99acres', logo: '🏡', popular: true },
      { id: 4, name: 'Housing.com', logo: '🏠', popular: false },
      { id: 5, name: 'Nestaway', logo: '🏘️', popular: false },
      { id: 6, name: 'FlatMate', logo: '🏡', popular: false },
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
