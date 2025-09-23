import React from 'react';
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

const { width } = Dimensions.get('window');

const DashboardScreen: React.FC<{ navigation: any; parentNavigation?: any }> = ({ navigation, parentNavigation }) => {
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

  const recentTransactions = [
    { id: 1, merchant: 'Starbucks', amount: '₹450', date: 'Today', carbon: '+5 credits' },
    { id: 2, merchant: 'Zomato', amount: '₹680', date: 'Yesterday', carbon: '+8 credits' },
    { id: 3, merchant: 'Amazon', amount: '₹1,200', date: '2 days ago', carbon: '+12 credits' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#00C896', '#00A876']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good Morning!</Text>
            <Text style={styles.userName}>Welcome to EcoCred</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => parentNavigation?.navigate('Profile')}
          >
            <MaterialIcons name="account-circle" size={32} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.postInfoCardsSpacing} />

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>₹25,480</Text>
          <Text style={styles.carbonCredits}>Carbon Credits: 247</Text>
        </View>

        <View style={styles.postInsightsSpacing} />
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={action.action}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <MaterialIcons name={action.icon as any} size={24} color="white" />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionIcon}>
                <MaterialIcons name="store" size={24} color="#00C896" />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.merchantName}>{transaction.merchant}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <View style={styles.transactionAmount}>
                <Text style={styles.amountText}>{transaction.amount}</Text>
                <Text style={styles.carbonText}>{transaction.carbon}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.walletInsightsTitle]}>Wallet Insights</Text>
          <View style={styles.insightsGrid}>
            <View style={styles.insightCard}>
              <MaterialIcons name="trending-up" size={20} color="#00C896" />
              <Text style={styles.insightValue}>+12%</Text>
              <Text style={styles.insightLabel}>Monthly Spending</Text>
            </View>
            <View style={styles.insightCard}>
              <MaterialIcons name="savings" size={20} color="#4ECDC4" />
              <Text style={styles.insightValue}>₹2,340</Text>
              <Text style={styles.insightLabel}>Saved This Month</Text>
            </View>
            <View style={styles.insightCard}>
              <MaterialIcons name="credit-card" size={20} color="#45B7D1" />
              <Text style={styles.insightValue}>156</Text>
              <Text style={styles.insightLabel}>Total Transactions</Text>
            </View>
          </View>

          <View style={styles.spendingChart}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Spending by Category</Text>
              <Text style={styles.chartSubtitle}>Last 30 days</Text>
            </View>
            <View style={styles.categorySpending}>
              <View style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryDot, { backgroundColor: '#FF6B6B' }]} />
                  <Text style={styles.categoryName}>Food & Dining</Text>
                </View>
                <Text style={styles.categoryAmount}>₹8,950</Text>
              </View>
              <View style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryDot, { backgroundColor: '#4ECDC4' }]} />
                  <Text style={styles.categoryName}>Shopping</Text>
                </View>
                <Text style={styles.categoryAmount}>₹6,240</Text>
              </View>
              <View style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryDot, { backgroundColor: '#96CEB4' }]} />
                  <Text style={styles.categoryName}>Transport</Text>
                </View>
                <Text style={styles.categoryAmount}>₹3,120</Text>
              </View>
              <View style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryDot, { backgroundColor: '#FECA57' }]} />
                  <Text style={styles.categoryName}>Entertainment</Text>
                </View>
                <Text style={styles.categoryAmount}>₹2,890</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Environmental Impact</Text>
          <View style={styles.impactCard}>
            <LinearGradient colors={['#E8F8F5', '#D1F2EB']} style={styles.impactCardGradient}>
              <MaterialIcons name="eco" size={40} color="#00C896" />
              <Text style={styles.impactTitle}>This Month</Text>
              <Text style={styles.impactValue}>2.4 kg CO₂ Offset</Text>
              <Text style={styles.impactSubtext}>You're making a difference!</Text>
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
    marginBottom: 30,
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
    marginBottom: 16,
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