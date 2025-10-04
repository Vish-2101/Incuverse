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

const TransactionDetailsScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation, route }) => {
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
    <View style={styles.container}>
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
          <View style={styles.detailsCard}>
            <View style={styles.merchantHeader}>
              <View style={styles.merchantIconContainer}>
                <MaterialIcons name={transaction.icon as any} size={32} color="#00C896" />
              </View>
              <View style={styles.merchantInfo}>
                <Text style={styles.merchantName}>{transaction.merchant}</Text>
                <Text style={styles.merchantCategory}>{transaction.type}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction ID</Text>
              <Text style={styles.detailValue}>{transactionId}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailValue}>{transaction.fullDate}, {transaction.time}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Method</Text>
              <Text style={styles.detailValue}>UPI</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{transaction.type}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Carbon Credits Earned</Text>
          <View style={styles.creditsCard}>
            <LinearGradient colors={['#E8F8F5', '#D1F2EB']} style={styles.creditsGradient}>
              <MaterialIcons name="eco" size={48} color="#00C896" />
              <Text style={styles.creditsValue}>{transaction.carbon}</Text>
              <Text style={styles.creditsSubtext}>Great job! You're contributing to a greener planet</Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Environmental Impact</Text>
          <View style={styles.impactCard}>
            <View style={styles.impactRow}>
              <View style={styles.impactItem}>
                <MaterialIcons name="park" size={24} color="#4CAF50" />
                <Text style={styles.impactLabel}>CO₂ Offset</Text>
                <Text style={styles.impactValue}>
                  {transaction.carbonImpact?.co2Offset || `${((transaction.credits || 0) * 0.02).toFixed(2)} kg`}
                </Text>
              </View>
              <View style={styles.impactItem}>
                <MaterialIcons name="nature" size={24} color="#8BC34A" />
                <Text style={styles.impactLabel}>Trees Equivalent</Text>
                <Text style={styles.impactValue}>
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
    backgroundColor: '#F8F9FA',
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
    color: '#333333',
    marginBottom: 16,
  },
  detailsCard: {
    backgroundColor: 'white',
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
    backgroundColor: '#E8F8F5',
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
    color: '#1A1A1A',
  },
  merchantCategory: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
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
    color: '#666666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333333',
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
    color: '#00C896',
    marginTop: 16,
    marginBottom: 8,
  },
  creditsSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  impactCard: {
    backgroundColor: 'white',
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
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
  impactValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 4,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default TransactionDetailsScreen;
