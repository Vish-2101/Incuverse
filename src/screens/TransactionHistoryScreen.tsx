import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getTransactions } from '../utils/storage';
import type { Transaction } from '../utils/storage';

const TransactionHistoryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadTransactions();
    }, [])
  );

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const transactions = await getTransactions();
    setAllTransactions(transactions);
  };


  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'food', label: 'Food & Dining' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'transport', label: 'Transport' },
    { id: 'entertainment', label: 'Entertainment' },
  ];

  const getFilteredTransactions = () => {
    if (selectedFilter === 'all') return allTransactions;
    const filterMap: { [key: string]: string } = {
      food: 'Food & Dining',
      shopping: 'Shopping',
      transport: 'Transport',
      entertainment: 'Entertainment',
    };
    return allTransactions.filter(t => t.type === filterMap[selectedFilter]);
  };

  const filteredTransactions = getFilteredTransactions();

  const totalAmount = filteredTransactions.reduce((sum, t) => {
    const amount = typeof t.amount === 'number' ? t.amount : parseFloat(String(t.amount).replace('₹', '').replace(',', ''));
    return sum + amount;
  }, 0);

  const totalCredits = filteredTransactions.reduce((sum, t) => {
    const credits = typeof t.credits === 'number' ? t.credits : parseInt(String(t.credits).replace('+', '').replace(' credits', ''));
    return sum + credits;
  }, 0);

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
          <Text style={styles.headerTitle}>Transaction History</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Spent</Text>
            <Text style={styles.summaryValue}>₹{totalAmount.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Credits Earned</Text>
            <Text style={styles.summaryValue}>{totalCredits}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                selectedFilter === filter.id && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === filter.id && styles.filterChipTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.resultCount}>
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </Text>

          {filteredTransactions.map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              style={styles.transactionCard}
              onPress={() => navigation.navigate('TransactionDetails', { transaction })}
              activeOpacity={0.7}
            >
              <View style={styles.transactionIcon}>
                <MaterialIcons name={transaction.icon as any} size={24} color="#00C896" />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.merchantName}>{transaction.merchant}</Text>
                <Text style={styles.transactionType}>{transaction.category}</Text>
                <Text style={styles.transactionDate}>{transaction.fullDate} {transaction.time}</Text>
              </View>
              <View style={styles.transactionAmount}>
                <Text style={styles.amountText}>₹{transaction.amount}</Text>
                <Text style={styles.carbonText}>+{transaction.credits} credits</Text>
                <View style={styles.statusBadge}>
                  <MaterialIcons name="check-circle" size={12} color="#00C896" />
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
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
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterChipActive: {
    backgroundColor: '#00C896',
    borderColor: '#00C896',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  resultCount: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    marginBottom: 2,
  },
  transactionType: {
    fontSize: 13,
    color: '#999999',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666666',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  carbonText: {
    fontSize: 12,
    color: '#00C896',
    marginBottom: 4,
  },
  statusBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E8F8F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default TransactionHistoryScreen;
