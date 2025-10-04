import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getCarbonCredits } from '../utils/storage';
import TicketCutout from '../components/TicketCutout';
import TicketModal from '../components/TicketModal';

const { width } = Dimensions.get('window');

const RewardsScreen: React.FC = () => {
  const [currentCredits, setCurrentCredits] = useState(0);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Load data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadCredits();
    }, [])
  );

  useEffect(() => {
    loadCredits();
  }, []);

  const loadCredits = async () => {
    try {
      console.log('Loading carbon credits...');
      const credits = await getCarbonCredits();
      console.log('Credits:', credits);
      setCurrentCredits(credits);
    } catch (error) {
      console.error('Error loading carbon credits:', error);
    }
  };

  const giftCards = [
    {
      id: 1,
      brand: 'Amazon',
      value: '₹250',
      credits: 500,
      image: '🛒',
      color: '#FF9500',
      description: 'Shop for millions of products',
    },
    {
      id: 2,
      brand: 'Starbucks',
      value: '₹150',
      credits: 300,
      image: '☕',
      color: '#00704A',
      description: 'Your favorite coffee awaits',
    },
    {
      id: 3,
      brand: 'Flipkart',
      value: '₹100',
      credits: 2000,
      image: '🛍️',
      color: '#2874F0',
      description: 'India\'s largest online store',
    },
    {
      id: 4,
      brand: 'Zomato',
      value: '₹200',
      credits: 400,
      image: '🍕',
      color: '#E23744',
      description: 'Delicious food delivered',
    },
    {
      id: 5,
      brand: 'BookMyShow',
      value: '₹200',
      credits: 400,
      image: '🎬',
      color: '#C4242B',
      description: 'Movies, events & more',
    },
    {
      id: 6,
      brand: 'Myntra',
      value: '₹300',
      credits: 600,
      image: '👗',
      color: '#FF3F6C',
      description: 'Fashion at your fingertips',
    },
  ];

  const ecoRewards = [
    {
      id: 1,
      title: 'Plant a Tree',
      credits: 20,
      icon: 'park',
      description: 'Plant a tree in your name',
      color: '#4CAF50',
    },
    {
      id: 2,
      title: 'Ocean Cleanup',
      credits: 35,
      icon: 'waves',
      description: 'Support ocean plastic removal',
      color: '#03A9F4',
    },
    {
      id: 3,
      title: 'Solar Panel Fund',
      credits: 50,
      icon: 'wb-sunny',
      description: 'Contribute to renewable energy',
      color: '#FFC107',
    },
  ];

  const openRewardModal = (reward: any, type: 'giftcard' | 'eco') => {
    setSelectedReward({ ...reward, type });
    setModalVisible(true);
  };

  const handleRedeemReward = () => {
    if (!selectedReward) return;

    setModalVisible(false);

    if (selectedReward.type === 'giftcard') {
      Alert.alert(
        'Success!',
        `Your ${selectedReward.brand} gift card has been redeemed! Check your email for the voucher code.`
      );
    } else {
      Alert.alert(
        'Thank You!',
        'Your contribution to environmental sustainability has been processed!'
      );
    }

    setSelectedReward(null);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#00C896', '#00A876']} style={styles.header}>
        <Text style={styles.headerTitle}>Rewards</Text>
        <Text style={styles.headerSubtitle}>Redeem your carbon credits</Text>

        <View style={styles.creditsCard}>
          <MaterialIcons name="eco" size={24} color="white" />
          <Text style={styles.creditsAmount}>{currentCredits}</Text>
          <Text style={styles.creditsLabel}>Carbon Credits Available</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scratch & Reveal</Text>
          <Text style={styles.sectionSubtitle}>Cut the ticket to reveal a surprise</Text>
          <View style={styles.ticketContainer}>
            <TicketCutout
              title="Weekly Eco Bonus"
              subtitle="Special reward for eco-friendly actions"
              rewardText="You won +15 credits!"
              onReveal={() => Alert.alert('Congrats!','You revealed +15 credits!')}
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gift Cards</Text>
          <View style={styles.cardsContainer}>
            {giftCards.map((giftCard) => (
              <TouchableOpacity
                key={giftCard.id}
                style={styles.giftCardWrapper}
                onPress={() => openRewardModal(giftCard, 'giftcard')}
                activeOpacity={0.9}
              >
                <View style={styles.giftCardContent}>
                  <View style={styles.giftCardHeader}>
                    <Text style={styles.giftCardEmoji}>{giftCard.image}</Text>
                    <View style={styles.giftCardInfo}>
                      <Text style={styles.giftCardBrand}>{giftCard.brand}</Text>
                      <Text style={styles.giftCardValue}>{giftCard.value}</Text>
                    </View>
                  </View>
                  <Text style={styles.giftCardDescription}>{giftCard.description}</Text>
                  <View style={styles.giftCardFooter}>
                    <View style={styles.creditsRequired}>
                      <MaterialIcons name={"eco" as any} size={16} color="#00C896" />
                      <Text style={styles.creditsRequiredText}>{giftCard.credits}</Text>
                    </View>
                    <View
                      style={[
                        styles.redeemButton,
                        currentCredits < giftCard.credits && styles.redeemButtonDisabled,
                      ]}
                    >
                      <Text
                        style={[
                          styles.redeemButtonText,
                          currentCredits < giftCard.credits && styles.redeemButtonTextDisabled,
                        ]}
                      >
                        {currentCredits >= giftCard.credits ? 'Tap to Open' : 'Locked'}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.clickIndicator}>
                  <MaterialIcons name="touch-app" size={20} color="#00C896" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Environmental Impact</Text>
          <Text style={styles.sectionSubtitle}>Make a direct environmental impact</Text>
          <View style={styles.cardsContainer}>
            {ecoRewards.map((reward) => (
              <TouchableOpacity
                key={reward.id}
                style={styles.ecoRewardWrapper}
                onPress={() => openRewardModal(reward, 'eco')}
                activeOpacity={0.9}
              >
                <View style={styles.ecoRewardContent}>
                  <View style={[styles.ecoRewardIcon, { backgroundColor: reward.color }]}>
                    <MaterialIcons name={reward.icon as any} size={24} color="white" />
                  </View>
                  <View style={styles.ecoRewardInfo}>
                    <Text style={styles.ecoRewardTitle}>{reward.title}</Text>
                    <Text style={styles.ecoRewardDescription}>{reward.description}</Text>
                  </View>
                  <View style={styles.ecoRewardCredits}>
                    <MaterialIcons name="eco" size={16} color="#00C896" />
                    <Text style={styles.ecoCreditsText}>{reward.credits}</Text>
                  </View>
                </View>
                <View style={styles.clickIndicator}>
                  <MaterialIcons name="touch-app" size={20} color="#4CAF50" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Earn More Credits</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipItem}>
              <MaterialIcons name="payment" size={20} color="#00C896" />
              <Text style={styles.tipText}>Make payments through the app</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="qr-code-scanner" size={20} color="#00C896" />
              <Text style={styles.tipText}>Scan QR codes at partner stores</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="group" size={20} color="#00C896" />
              <Text style={styles.tipText}>Refer friends to earn bonus credits</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="eco" size={20} color="#00C896" />
              <Text style={styles.tipText}>Choose eco-friendly merchants</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </View>

      {/* Ticket Modal */}
      {selectedReward && (
        <TicketModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setSelectedReward(null);
          }}
          onRedeem={handleRedeemReward}
          title={selectedReward.brand || selectedReward.title}
          subtitle={selectedReward.description}
          value={selectedReward.value || ''}
          credits={selectedReward.credits}
          canRedeem={currentCredits >= selectedReward.credits}
          type={selectedReward.type}
          leftContent={
            selectedReward.type === 'giftcard' ? (
              <View>
                <View style={styles.modalGiftCardHeader}>
                  <Text style={styles.modalGiftCardEmoji}>{selectedReward.image}</Text>
                  <View style={styles.modalGiftCardInfo}>
                    <Text style={styles.modalGiftCardBrand}>{selectedReward.brand}</Text>
                    <Text style={styles.modalGiftCardValue}>{selectedReward.value}</Text>
                  </View>
                </View>
                <Text style={styles.modalGiftCardDescription}>{selectedReward.description}</Text>
                <View style={styles.modalCreditsInfo}>
                  <MaterialIcons name="eco" size={18} color="#00C896" />
                  <Text style={styles.modalCreditsText}>
                    {selectedReward.credits} credits required
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.modalEcoContent}>
                <View style={[styles.modalEcoIcon, { backgroundColor: selectedReward.color }]}>
                  <MaterialIcons name={selectedReward.icon} size={28} color="white" />
                </View>
                <View style={styles.modalEcoInfo}>
                  <Text style={styles.modalEcoTitle}>{selectedReward.title}</Text>
                  <Text style={styles.modalEcoDescription}>{selectedReward.description}</Text>
                  <View style={styles.modalCreditsInfo}>
                    <MaterialIcons name="eco" size={18} color="#00C896" />
                    <Text style={styles.modalCreditsText}>
                      {selectedReward.credits} credits required
                    </Text>
                  </View>
                </View>
              </View>
            )
          }
        />
      )}
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
  creditsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  creditsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 8,
  },
  creditsLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#666666',
    marginBottom: 20,
  },
  ticketContainer: {
    marginBottom: 8,
  },
  cardsContainer: {
    gap: 16,
  },
  giftCardWrapper: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  giftCardContent: {
    padding: 16,
    flex: 1,
  },
  clickIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  giftCardReveal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  giftCardRevealText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
    textAlign: 'center',
  },
  ecoRewardWrapper: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  ecoRewardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    flex: 1,
  },
  ecoRewardReveal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  ecoRewardRevealText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
    textAlign: 'center',
  },
  giftCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  giftCardItem: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  giftCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  giftCardEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  giftCardInfo: {
    flex: 1,
  },
  giftCardBrand: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  giftCardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00C896',
  },
  giftCardDescription: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 16,
    lineHeight: 18,
    marginTop: 4,
  },
  giftCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creditsRequired: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditsRequiredText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00C896',
    marginLeft: 2,
  },
  redeemButton: {
    backgroundColor: '#00C896',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  redeemButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  redeemButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  redeemButtonTextDisabled: {
    color: '#999999',
  },
  ecoRewardCard: {
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
  ecoRewardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ecoRewardInfo: {
    flex: 1,
  },
  ecoRewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  ecoRewardDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  ecoRewardCredits: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ecoCreditsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00C896',
    marginLeft: 4,
  },
  tipsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 12,
    flex: 1,
  },
  bottomSpacing: {
    height: 40,
  },
  // Modal styles
  modalGiftCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalGiftCardEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  modalGiftCardInfo: {
    flex: 1,
  },
  modalGiftCardBrand: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  modalGiftCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00C896',
    marginTop: 2,
  },
  modalGiftCardDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
    lineHeight: 20,
  },
  modalCreditsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalCreditsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00C896',
  },
  modalEcoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  modalEcoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalEcoInfo: {
    flex: 1,
  },
  modalEcoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  modalEcoDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 20,
  },
});

export default RewardsScreen;