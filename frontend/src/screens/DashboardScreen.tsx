import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getBalance, getCarbonCredits, getTransactions, initializeStorage } from '../utils/storage';
import type { Transaction } from '../utils/storage';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors, createThemedStyles } from '../utils/theme';
import ThemeToggle from '../components/ThemeToggle';

const { width } = Dimensions.get('window');

const DashboardScreen: React.FC<{ navigation: any; parentNavigation?: any }> = ({ navigation, parentNavigation }) => {
  const { theme, isDark } = useTheme();
  const themeColors = getThemeColors(theme);
  const themedStyles = createThemedStyles(theme);
  
  const [balance, setBalance] = useState(0);
  const [carbonCredits, setCarbonCredits] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  // Load data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('Loading dashboard data...');
      const bal = await getBalance();
      const credits = await getCarbonCredits();
      const transactions = await getTransactions();

      console.log('Balance:', bal);
      console.log('Credits:', credits);
      console.log('Transactions:', transactions);

      setBalance(bal);
      setCarbonCredits(credits);
      setRecentTransactions(transactions.slice(0, 3)); // Show only latest 3
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };
  const quickActions = [
    {
      id: 1,
      icon: 'qr-code-scanner',
      title: 'Scan QR',
      color: '#FF6B6B',
      action: () => navigation.navigate('Scan')
    },
    {
      id: 2,
      icon: 'payment',
      title: 'Pay Bills',
      color: '#4ECDC4',
      action: () => navigation.navigate('Payments')
    },
    {
      id: 3,
      icon: 'card-giftcard',
      title: 'Rewards',
      color: '#45B7D1',
      action: () => navigation.navigate('Rewards')
    },
    {
      id: 4,
      icon: 'eco',
      title: 'Carbon Credits',
      color: '#96CEB4',
      action: () => navigation.navigate('Carbon')
    },
  ];


  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#00C896', '#00A876']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.userName}>Welcome to EcoCred</Text>
          </View>
          <View style={styles.headerButtons}>
            <ThemeToggle size={24} style={styles.themeToggle} />
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => parentNavigation?.navigate('Profile')}
            >
              <MaterialIcons name="account-circle" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.postInfoCardsSpacing} />

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>₹{balance.toLocaleString('en-IN')}</Text>
          <Text style={styles.carbonCredits}>Carbon Credits: {carbonCredits}</Text>
        </View>

        <View style={styles.postInsightsSpacing} />
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionCard, { backgroundColor: themeColors.card }]}
                onPress={action.action}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <MaterialIcons name={action.icon as any} size={24} color="white" />
                </View>
                <Text style={[styles.quickActionTitle, { color: themeColors.text }]}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => parentNavigation?.navigate('TransactionHistory')}>
              <Text style={[styles.seeAllText, { color: themeColors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions && recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <TouchableOpacity
                key={transaction.id}
                style={[styles.transactionCard, { backgroundColor: themeColors.card }]}
                onPress={() => parentNavigation?.navigate('TransactionHistory')}
                activeOpacity={0.7}
              >
                <View style={[styles.transactionIcon, { backgroundColor: themeColors.primaryLight }]}>
                  <MaterialIcons name="store" size={24} color={themeColors.primary} />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={[styles.merchantName, { color: themeColors.text }]}>{transaction.merchant || 'Unknown'}</Text>
                  <Text style={[styles.transactionDate, { color: themeColors.textSecondary }]}>{transaction.fullDate || transaction.date}</Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={[styles.amountText, { color: themeColors.text }]}>₹{transaction.amount?.toLocaleString('en-IN') || 0}</Text>
                  <Text style={[styles.carbonText, { color: themeColors.primary }]}>+{transaction.credits || 0} credits</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={[styles.emptyTransactions, { backgroundColor: themeColors.card }]}>
              <MaterialIcons name="receipt-long" size={48} color={themeColors.textTertiary} />
              <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>No transactions yet</Text>
              <Text style={[styles.emptySubtext, { color: themeColors.textTertiary }]}>Make a payment to see your transactions here</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.walletInsightsTitle, { color: themeColors.text }]}>Wallet Insights</Text>
          <View style={styles.insightsGrid}>
            <View style={[styles.insightCard, { backgroundColor: themeColors.card }]}>
              <MaterialIcons name="trending-up" size={20} color={themeColors.primary} />
              <Text style={[styles.insightValue, { color: themeColors.text }]}>+12%</Text>
              <Text style={[styles.insightLabel, { color: themeColors.textSecondary }]}>Monthly Spending</Text>
            </View>
            <View style={[styles.insightCard, { backgroundColor: themeColors.card }]}>
              <MaterialIcons name="savings" size={20} color="#4ECDC4" />
              <Text style={[styles.insightValue, { color: themeColors.text }]}>₹2,340</Text>
              <Text style={[styles.insightLabel, { color: themeColors.textSecondary }]}>Saved This Month</Text>
            </View>
            <View style={[styles.insightCard, { backgroundColor: themeColors.card }]}>
              <MaterialIcons name="credit-card" size={20} color="#45B7D1" />
              <Text style={[styles.insightValue, { color: themeColors.text }]}>156</Text>
              <Text style={[styles.insightLabel, { color: themeColors.textSecondary }]}>Total Transactions</Text>
            </View>
          </View>

          <View style={[styles.spendingChart, { backgroundColor: themeColors.card }]}>
            <View style={styles.chartHeader}>
              <Text style={[styles.chartTitle, { color: themeColors.text }]}>Spending by Category</Text>
              <Text style={[styles.chartSubtitle, { color: themeColors.textSecondary }]}>Last 30 days</Text>
            </View>
            <View style={styles.categorySpending}>
              <View style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryDot, { backgroundColor: '#FF6B6B' }]} />
                  <Text style={[styles.categoryName, { color: themeColors.text }]}>Food & Dining</Text>
                </View>
                <Text style={[styles.categoryAmount, { color: themeColors.text }]}>₹8,950</Text>
              </View>
              <View style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryDot, { backgroundColor: '#4ECDC4' }]} />
                  <Text style={[styles.categoryName, { color: themeColors.text }]}>Shopping</Text>
                </View>
                <Text style={[styles.categoryAmount, { color: themeColors.text }]}>₹6,240</Text>
              </View>
              <View style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryDot, { backgroundColor: '#96CEB4' }]} />
                  <Text style={[styles.categoryName, { color: themeColors.text }]}>Transport</Text>
                </View>
                <Text style={[styles.categoryAmount, { color: themeColors.text }]}>₹3,120</Text>
              </View>
              <View style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryDot, { backgroundColor: '#FECA57' }]} />
                  <Text style={[styles.categoryName, { color: themeColors.text }]}>Entertainment</Text>
                </View>
                <Text style={[styles.categoryAmount, { color: themeColors.text }]}>₹2,890</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Environmental Impact</Text>
          <View style={styles.impactCard}>
            <LinearGradient colors={isDark ? ['#1A3A2E', '#0F2A1F'] : ['#E8F8F5', '#D1F2EB']} style={styles.impactCardGradient}>
              <MaterialIcons name="eco" size={40} color={themeColors.primary} />
              <Text style={[styles.impactTitle, { color: themeColors.text }]}>This Month</Text>
              <Text style={[styles.impactValue, { color: themeColors.primary }]}>2.4 kg CO₂ Offset</Text>
              <Text style={[styles.impactSubtext, { color: themeColors.textSecondary }]}>You're making a difference!</Text>
            </LinearGradient>
          </View>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggle: {
    marginRight: 12,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  balanceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 4,
  },
  carbonCredits: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    padding: 20,
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
  walletInsightsTitle: {
    padding: 8,
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: '#00C896',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F8F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  carbonText: {
    fontSize: 12,
    color: '#00C896',
    marginTop: 2,
  },
  emptyTransactions: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
  },
  insightsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  insightCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 8,
  },
  insightLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    textAlign: 'center',
  },
  spendingChart: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  categorySpending: {
    marginTop: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#333333',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  impactCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  impactCardGradient: {
    padding: 24,
    alignItems: 'center',
  },
  impactTitle: {
    fontSize: 16,
    color: '#333333',
    marginTop: 12,
  },
  impactValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00C896',
    marginTop: 4,
  },
  impactSubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  postInfoCardsSpacing: {
    height: 16,
  },
  postInsightsSpacing: {
    height: 16,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default DashboardScreen;