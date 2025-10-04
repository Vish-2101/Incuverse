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

interface PaymentsScreenProps {
  navigation: any;
  parentNavigation?: any;
}

const PaymentsScreen: React.FC<PaymentsScreenProps> = ({ navigation, parentNavigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const navToUse = parentNavigation || navigation;

  const paymentCategories = [
    { id: 1, icon: 'flash-on', title: 'Electricity', color: '#FFB020', credits: 10 },
    { id: 2, icon: 'water-drop', title: 'Water', color: '#2196F3', credits: 8 },
    { id: 3, icon: 'phone-android', title: 'Mobile', color: '#9C27B0', credits: 5 },
    { id: 4, icon: 'wifi', title: 'Internet', color: '#FF5722', credits: 7 },
    { id: 5, icon: 'local-gas-station', title: 'Gas', color: '#FF9800', credits: 9 },
    { id: 6, icon: 'credit-card', title: 'Credit Card', color: '#00BCD4', credits: 6 },
    { id: 7, icon: 'restaurant', title: 'Food & Dining', color: '#FF6B6B', credits: 5 },
    { id: 8, icon: 'security', title: 'Insurance', color: '#4ECDC4', credits: 12 },
    { id: 9, icon: 'shopping-cart', title: 'Shopping', color: '#45B7D1', credits: 8 },
    { id: 10, icon: 'movie', title: 'Entertainment', color: '#96CEB4', credits: 4 },
    { id: 11, icon: 'directions-bus', title: 'Transport', color: '#FECA57', credits: 6 },
    { id: 12, icon: 'home', title: 'Rent', color: '#FF9FF3', credits: 15 },
  ];

  const popularBrands = [
    { id: 1, name: 'Starbucks', category: 'Food & Dining', carbonCredits: 5, logo: '☕' },
    { id: 2, name: 'McDonald\'s', category: 'Food & Dining', carbonCredits: 4, logo: '🍟' },
    { id: 3, name: 'Amazon', category: 'Shopping', carbonCredits: 8, logo: '📦' },
    { id: 4, name: 'Uber', category: 'Transport', carbonCredits: 6, logo: '🚗' },
    { id: 5, name: 'Netflix', category: 'Entertainment', carbonCredits: 3, logo: '🎬' },
    { id: 6, name: 'Spotify', category: 'Entertainment', carbonCredits: 2, logo: '🎵' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#00C896', '#00A876']} style={styles.header}>
        <Text style={styles.headerTitle}>Payments</Text>
        <Text style={styles.headerSubtitle}>Pay and earn carbon credits</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search brands or categories"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Payment Categories</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>Pay bills and earn carbon credits</Text>

          <View style={styles.billsGrid}>
            {paymentCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.billCard}
                onPress={() => navToUse.navigate('BillPayment', { category: category.title })}
              >
                <View style={[styles.billIcon, { backgroundColor: category.color }]}>
                  <MaterialIcons name={category.icon as any} size={28} color="white" />
                </View>
                <Text style={styles.billTitle}>{category.title}</Text>
                <View style={styles.billCreditsSmall}>
                  <MaterialIcons name="eco" size={12} color="#00C896" />
                  <Text style={styles.billCreditsText}>+{category.credits}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Popular Brands</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {popularBrands.map((brand) => (
            <TouchableOpacity key={brand.id} style={styles.brandCard}>
              <View style={styles.brandInfo}>
                <View style={styles.brandLogo}>
                  <Text style={styles.brandEmoji}>{brand.logo}</Text>
                </View>
                <View style={styles.brandDetails}>
                  <Text style={styles.brandName}>{brand.name}</Text>
                  <Text style={styles.brandCategory}>{brand.category}</Text>
                </View>
              </View>
              <View style={styles.brandCredits}>
                <MaterialIcons name="eco" size={16} color="#00C896" />
                <Text style={styles.creditsText}>+{brand.carbonCredits}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.section, { marginBottom: 40 }]}>
          <Text style={styles.sectionTitle}>Quick Pay Options</Text>

          <TouchableOpacity
            style={styles.quickPayCard}
            onPress={() => navigation.navigate('Scan')}
            activeOpacity={0.7}
          >
            <LinearGradient colors={['#FF6B6B', '#FF8E8E']} style={styles.quickPayGradient}>
              <MaterialIcons name="qr-code-scanner" size={32} color="white" />
              <View style={styles.quickPayText}>
                <Text style={styles.quickPayTitle}>Scan QR Code</Text>
                <Text style={styles.quickPaySubtitle}>Quick payment with camera</Text>
              </View>
              <MaterialIcons name="arrow-forward" size={24} color="white" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickPayCard}>
            <LinearGradient colors={['#4ECDC4', '#6FD8D3']} style={styles.quickPayGradient}>
              <MaterialIcons name="nfc" size={32} color="white" />
              <View style={styles.quickPayText}>
                <Text style={styles.quickPayTitle}>NFC Payment</Text>
                <Text style={styles.quickPaySubtitle}>Tap to pay securely</Text>
              </View>
              <MaterialIcons name="arrow-forward" size={24} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </View>
    </ScrollView>
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
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
    marginTop: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: '#00C896',
    fontWeight: '600',
  },
  billsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  billCard: {
    width: (width - 60) / 3,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  billIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  billTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 6,
  },
  billCreditsSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  billCreditsText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#00C896',
    marginLeft: 3,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 60) / 3,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    lineHeight: 14,
    marginTop: 4,
  },
  brandCard: {
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
  brandInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  brandLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  brandEmoji: {
    fontSize: 24,
  },
  brandDetails: {
    flex: 1,
    minWidth: 0,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  brandCategory: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  brandCredits: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  creditsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00C896',
    marginLeft: 4,
  },
  quickPayCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  quickPayGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  quickPayText: {
    flex: 1,
    marginLeft: 16,
  },
  quickPayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  quickPaySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default PaymentsScreen;