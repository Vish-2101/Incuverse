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

const TransactionDetailsScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const themeColors = getThemeColors(theme);
  const transaction = route?.params?.transaction || {
    merchant: 'Unknown',
    amount: '₹0',
    date: 'Oct 3',
    time: '12:00 PM',
    fullDate: 'Oct 3, 2025',
    carbon: '+0 credits',
    type: 'General',
    icon: 'payment',
    status: 'Completed',
  };

  const transactionId = `TXN${Math.random().toString().slice(2, 11)}`;

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
          <Text style={styles.headerTitle}>Transaction Details</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amountValue}>{transaction.amount}</Text>
          <View style={styles.statusContainer}>
            <MaterialIcons name="check-circle" size={16} color="white" />
            <Text style={styles.statusText}>{transaction.status}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={[styles.detailsCard, { backgroundColor: themeColors.card }]}>
            <View style={styles.merchantHeader}>
              <View style={[styles.merchantIconContainer, { backgroundColor: themeColors.primaryLight }]}>
                <MaterialIcons name={transaction.icon as any} size={32} color={themeColors.primary} />
              </View>
              <View style={styles.merchantInfo}>
                <Text style={[styles.merchantName, { color: themeColors.text }]}>{transaction.merchant}</Text>
                <Text style={[styles.merchantCategory, { color: themeColors.textSecondary }]}>{transaction.type}</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0' }]} />

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: themeColors.textSecondary }]}>Transaction ID</Text>
              <Text style={[styles.detailValue, { color: themeColors.text }]}>{transactionId}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: themeColors.textSecondary }]}>Date & Time</Text>
              <Text style={[styles.detailValue, { color: themeColors.text }]}>{transaction.fullDate}, {transaction.time}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: themeColors.textSecondary }]}>Payment Method</Text>
              <Text style={[styles.detailValue, { color: themeColors.text }]}>UPI</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: themeColors.textSecondary }]}>Category</Text>
              <Text style={[styles.detailValue, { color: themeColors.text }]}>{transaction.type}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Carbon Credits Earned</Text>
          <View style={styles.creditsCard}>
            <LinearGradient colors={isDark ? ['#1A3A2E', '#0F2A1F'] : ['#E8F8F5', '#D1F2EB']} style={styles.creditsGradient}>
              <MaterialIcons name="eco" size={48} color={themeColors.primary} />
              <Text style={[styles.creditsValue, { color: themeColors.primary }]}>{transaction.carbon}</Text>
              <Text style={[styles.creditsSubtext, { color: themeColors.textSecondary }]}>Great job! You're contributing to a greener planet</Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Environmental Impact</Text>
          <View style={[styles.impactCard, { backgroundColor: themeColors.card }]}>
            <View style={styles.impactRow}>
              <View style={styles.impactItem}>
                <MaterialIcons name="park" size={24} color="#4CAF50" />
                <Text style={[styles.impactLabel, { color: themeColors.textSecondary }]}>CO₂ Offset</Text>
                <Text style={[styles.impactValue, { color: themeColors.text }]}>
                  {transaction.carbonImpact?.co2Offset || `${((transaction.credits || 0) * 0.02).toFixed(2)} kg`}
                </Text>
              </View>
              <View style={styles.impactItem}>
                <MaterialIcons name="nature" size={24} color="#8BC34A" />
                <Text style={[styles.impactLabel, { color: themeColors.textSecondary }]}>Trees Equivalent</Text>
                <Text style={[styles.impactValue, { color: themeColors.text }]}>
                  {transaction.carbonImpact?.treesEquivalent || ((transaction.credits || 0) * 0.001).toFixed(3)}
                </Text>
              </View>
            </View>
          </View>
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
  amountContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 24,
  },
  amountLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
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
  creditsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  creditsGradient: {
    padding: 32,
    alignItems: 'center',
  },
  creditsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  creditsSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  impactCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  impactRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  impactItem: {
    alignItems: 'center',
    flex: 1,
  },
  impactLabel: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  impactValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default TransactionDetailsScreen;
