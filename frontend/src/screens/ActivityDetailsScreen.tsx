import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../utils/theme';

const ActivityDetailsScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const themeColors = getThemeColors(theme);
  const activity = route?.params?.activity;

  const allActivities = [
    {
      id: 1,
      type: 'payment',
      merchant: 'Starbucks',
      amount: '₹450',
      credits: 5,
      offset: '0.12 kg CO₂',
      date: 'Oct 3, 2:30 PM',
      fullDate: 'Oct 3, 2025',
      icon: 'payment',
      category: 'Food & Dining',
      transactionId: 'TXN123456789',
      status: 'Completed',
      paymentMethod: 'UPI',
      carbonImpact: {
        co2Offset: '0.12 kg',
        treesEquivalent: '0.006',
        creditsEarned: 5,
        breakdown: [
          { item: 'Sustainable sourcing', value: '60%' },
          { item: 'Eco-friendly packaging', value: '25%' },
          { item: 'Carbon neutral delivery', value: '15%' },
        ],
      },
    },
    {
      id: 2,
      type: 'payment',
      merchant: 'Zomato',
      amount: '₹680',
      credits: 8,
      offset: '0.18 kg CO₂',
      date: 'Oct 2, 7:45 PM',
      fullDate: 'Oct 2, 2025',
      icon: 'restaurant',
      category: 'Food & Dining',
      transactionId: 'TXN987654321',
      status: 'Completed',
      paymentMethod: 'Credit Card',
      carbonImpact: {
        co2Offset: '0.18 kg',
        treesEquivalent: '0.009',
        creditsEarned: 8,
        breakdown: [
          { item: 'Local restaurant support', value: '50%' },
          { item: 'Minimal packaging', value: '30%' },
          { item: 'Green delivery fleet', value: '20%' },
        ],
      },
    },
    {
      id: 3,
      type: 'bonus',
      merchant: 'Daily Check-in',
      amount: '',
      credits: 2,
      offset: '0.05 kg CO₂',
      date: 'Oct 2, 9:00 AM',
      fullDate: 'Oct 2, 2025',
      icon: 'event-available',
      category: 'Bonus',
      transactionId: 'BONUS123456',
      status: 'Completed',
      paymentMethod: '-',
      carbonImpact: {
        co2Offset: '0.05 kg',
        treesEquivalent: '0.0025',
        creditsEarned: 2,
        breakdown: [
          { item: 'Daily engagement bonus', value: '100%' },
        ],
      },
    },
    {
      id: 4,
      type: 'payment',
      merchant: 'Amazon',
      amount: '₹1,200',
      credits: 12,
      offset: '0.25 kg CO₂',
      date: 'Oct 1, 3:15 PM',
      fullDate: 'Oct 1, 2025',
      icon: 'shopping-cart',
      category: 'Shopping',
      transactionId: 'TXN456789123',
      status: 'Completed',
      paymentMethod: 'Debit Card',
      carbonImpact: {
        co2Offset: '0.25 kg',
        treesEquivalent: '0.0125',
        creditsEarned: 12,
        breakdown: [
          { item: 'Eco-certified products', value: '55%' },
          { item: 'Recycled packaging', value: '30%' },
          { item: 'Carbon offset shipping', value: '15%' },
        ],
      },
    },
    {
      id: 5,
      type: 'payment',
      merchant: 'Uber',
      amount: '₹320',
      credits: 6,
      offset: '0.15 kg CO₂',
      date: 'Sep 30, 11:20 AM',
      fullDate: 'Sep 30, 2025',
      icon: 'directions-car',
      category: 'Transport',
      transactionId: 'TXN789123456',
      status: 'Completed',
      paymentMethod: 'Wallet',
      carbonImpact: {
        co2Offset: '0.15 kg',
        treesEquivalent: '0.0075',
        creditsEarned: 6,
        breakdown: [
          { item: 'Electric/Hybrid vehicle', value: '70%' },
          { item: 'Shared ride efficiency', value: '30%' },
        ],
      },
    },
    {
      id: 6,
      type: 'payment',
      merchant: 'Netflix',
      amount: '₹199',
      credits: 3,
      offset: '0.08 kg CO₂',
      date: 'Sep 30, 6:00 PM',
      fullDate: 'Sep 30, 2025',
      icon: 'tv',
      category: 'Entertainment',
      transactionId: 'TXN321654987',
      status: 'Completed',
      paymentMethod: 'UPI',
      carbonImpact: {
        co2Offset: '0.08 kg',
        treesEquivalent: '0.004',
        creditsEarned: 3,
        breakdown: [
          { item: 'Green data centers', value: '80%' },
          { item: 'Renewable energy usage', value: '20%' },
        ],
      },
    },
    {
      id: 7,
      type: 'payment',
      merchant: 'BigBasket',
      amount: '₹850',
      credits: 10,
      offset: '0.22 kg CO₂',
      date: 'Sep 29, 10:30 AM',
      fullDate: 'Sep 29, 2025',
      icon: 'shopping-basket',
      category: 'Groceries',
      transactionId: 'TXN654987321',
      status: 'Completed',
      paymentMethod: 'Credit Card',
      carbonImpact: {
        co2Offset: '0.22 kg',
        treesEquivalent: '0.011',
        creditsEarned: 10,
        breakdown: [
          { item: 'Organic products', value: '45%' },
          { item: 'Local sourcing', value: '35%' },
          { item: 'Minimal packaging', value: '20%' },
        ],
      },
    },
    {
      id: 8,
      type: 'payment',
      merchant: 'Swiggy',
      amount: '₹540',
      credits: 7,
      offset: '0.16 kg CO₂',
      date: 'Sep 28, 8:15 PM',
      fullDate: 'Sep 28, 2025',
      icon: 'restaurant',
      category: 'Food & Dining',
      transactionId: 'TXN147258369',
      status: 'Completed',
      paymentMethod: 'UPI',
      carbonImpact: {
        co2Offset: '0.16 kg',
        treesEquivalent: '0.008',
        creditsEarned: 7,
        breakdown: [
          { item: 'Eco-friendly restaurants', value: '55%' },
          { item: 'Biodegradable packaging', value: '25%' },
          { item: 'Green delivery fleet', value: '20%' },
        ],
      },
    },
  ];

  const selectedActivity = activity || allActivities[0];

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <LinearGradient colors={['#00C896', '#00A876']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Activity Details</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.headerStats}>
          <View style={styles.headerStatItem}>
            <MaterialIcons name="eco" size={32} color="white" />
            <Text style={styles.headerStatNumber}>+{selectedActivity.credits}</Text>
            <Text style={styles.headerStatLabel}>Credits Earned</Text>
          </View>
          <View style={styles.headerStatItem}>
            <MaterialIcons name="park" size={32} color="white" />
            <Text style={styles.headerStatNumber}>{selectedActivity.offset}</Text>
            <Text style={styles.headerStatLabel}>CO₂ Offset</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Transaction Details</Text>
          <View style={[styles.detailsCard, { backgroundColor: themeColors.card }]}>
            <View style={styles.merchantHeader}>
              <View style={[styles.merchantIconContainer, { backgroundColor: themeColors.primaryLight }]}>
                <MaterialIcons name={selectedActivity.icon as any} size={32} color={themeColors.primary} />
              </View>
              <View style={styles.merchantInfo}>
                <Text style={[styles.merchantName, { color: themeColors.text }]}>{selectedActivity.merchant}</Text>
                <Text style={[styles.merchantCategory, { color: themeColors.textSecondary }]}>{selectedActivity.category}</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0' }]} />

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: themeColors.textSecondary }]}>Transaction ID</Text>
              <Text style={[styles.detailValue, { color: themeColors.text }]}>{selectedActivity.transactionId}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: themeColors.textSecondary }]}>Date & Time</Text>
              <Text style={[styles.detailValue, { color: themeColors.text }]}>
                {selectedActivity.fullDate || selectedActivity.date}
                {selectedActivity.date && !selectedActivity.date.includes(selectedActivity.fullDate) && `, ${selectedActivity.date.split(/,?\s+/).slice(-2).join(' ')}`}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: themeColors.textSecondary }]}>Status</Text>
              <View style={[styles.statusBadge, { backgroundColor: themeColors.primaryLight }]}>
                <MaterialIcons name="check-circle" size={16} color={themeColors.primary} />
                <Text style={[styles.statusText, { color: themeColors.primary }]}>{selectedActivity.status}</Text>
              </View>
            </View>

            {selectedActivity.amount && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: themeColors.textSecondary }]}>Amount</Text>
                <Text style={[styles.detailValueBold, { color: themeColors.text }]}>{selectedActivity.amount}</Text>
              </View>
            )}

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: themeColors.textSecondary }]}>Payment Method</Text>
              <Text style={[styles.detailValue, { color: themeColors.text }]}>{selectedActivity.paymentMethod}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Carbon Impact</Text>
          <View style={styles.impactCard}>
            <LinearGradient colors={isDark ? ['#1A3A2E', '#0F2A1F'] : ['#E8F8F5', '#D1F2EB']} style={styles.impactGradient}>
              <View style={styles.impactStats}>
                <View style={styles.impactStatItem}>
                  <MaterialIcons name="eco" size={28} color="#4CAF50" />
                  <Text style={[styles.impactStatNumber, { color: themeColors.text }]}>{selectedActivity.carbonImpact?.co2Offset || '0 kg'}</Text>
                  <Text style={[styles.impactStatLabel, { color: themeColors.textSecondary }]}>CO₂ Offset</Text>
                </View>
                <View style={styles.impactStatItem}>
                  <MaterialIcons name="park" size={28} color="#8BC34A" />
                  <Text style={[styles.impactStatNumber, { color: themeColors.text }]}>{selectedActivity.carbonImpact?.treesEquivalent || '0'}</Text>
                  <Text style={[styles.impactStatLabel, { color: themeColors.textSecondary }]}>Trees</Text>
                </View>
                <View style={styles.impactStatItem}>
                  <MaterialIcons name="stars" size={28} color="#FFB300" />
                  <Text style={[styles.impactStatNumber, { color: themeColors.text }]}>{selectedActivity.carbonImpact?.creditsEarned || 0}</Text>
                  <Text style={[styles.impactStatLabel, { color: themeColors.textSecondary }]}>Credits</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={[styles.breakdownCard, { backgroundColor: themeColors.card }]}>
            <Text style={[styles.breakdownTitle, { color: themeColors.text }]}>Carbon Credit Breakdown</Text>
            {selectedActivity.carbonImpact?.breakdown?.map((item: any, index: number) => (
              <View key={index} style={styles.breakdownItem}>
                <View style={styles.breakdownInfo}>
                  <MaterialIcons name="check-circle" size={16} color={themeColors.primary} />
                  <Text style={[styles.breakdownLabel, { color: themeColors.textSecondary }]}>{item.item}</Text>
                </View>
                <Text style={[styles.breakdownValue, { color: themeColors.primary }]}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>All Recent Activities</Text>
          {allActivities.map((act) => (
            <TouchableOpacity
              key={act.id}
              style={[
                styles.activityCard,
                { backgroundColor: themeColors.card },
                act.id === selectedActivity.id && { borderWidth: 2, borderColor: themeColors.primary },
              ]}
              onPress={() => navigation.replace('ActivityDetails', { activity: act })}
            >
              <View style={[styles.activityIcon, { backgroundColor: themeColors.primaryLight }]}>
                <MaterialIcons name={act.icon as any} size={20} color={themeColors.primary} />
              </View>
              <View style={styles.activityDetails}>
                <Text style={[styles.activityMerchant, { color: themeColors.text }]}>{act.merchant}</Text>
                <Text style={[styles.activityDate, { color: themeColors.textSecondary }]}>{act.date}</Text>
                {act.amount && <Text style={[styles.activityAmount, { color: themeColors.textTertiary }]}>{act.amount}</Text>}
              </View>
              <View style={styles.activityImpact}>
                <View style={[styles.creditsEarned, { backgroundColor: themeColors.primaryLight }]}>
                  <MaterialIcons name="eco" size={16} color={themeColors.primary} />
                  <Text style={[styles.creditsText, { color: themeColors.primary }]}>+{act.credits}</Text>
                </View>
                <Text style={[styles.offsetText, { color: themeColors.textSecondary }]}>{act.offset}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
  },
  headerStatItem: {
    alignItems: 'center',
  },
  headerStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  headerStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailsCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  merchantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  merchantIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  merchantInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  merchantCategory: {
    fontSize: 14,
    marginTop: 4,
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailValueBold: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  impactCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  impactGradient: {
    padding: 20,
  },
  impactStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  impactStatItem: {
    alignItems: 'center',
  },
  impactStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  impactStatLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  breakdownCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  breakdownInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  breakdownLabel: {
    fontSize: 14,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityCardActive: {
    borderWidth: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityMerchant: {
    fontSize: 16,
    fontWeight: '600',
  },
  activityDate: {
    fontSize: 12,
    marginTop: 2,
  },
  activityAmount: {
    fontSize: 14,
    marginTop: 2,
  },
  activityImpact: {
    alignItems: 'flex-end',
  },
  creditsEarned: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  creditsText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  offsetText: {
    fontSize: 10,
    marginTop: 4,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default ActivityDetailsScreen;
