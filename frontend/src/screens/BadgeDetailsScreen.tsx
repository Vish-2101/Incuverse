import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const BadgeDetailsScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const [selectedBadge, setSelectedBadge] = useState<any>(route?.params?.selectedBadge || null);
  const [modalVisible, setModalVisible] = useState(false);

  const allBadges = [
    {
      id: 1,
      title: 'First Payment',
      icon: 'star',
      earned: true,
      description: 'Made your first eco-friendly payment',
      requirement: 'Complete 1 transaction',
      progress: '1/1 completed',
      category: 'Getting Started',
      earnedDate: 'Jan 15, 2025',
      details: 'Congratulations on taking your first step towards sustainable payments! Every eco-friendly transaction you make contributes to reducing carbon emissions and supporting green initiatives.',
      tips: [
        'Keep track of your eco-friendly purchases',
        'Choose merchants committed to sustainability',
        'Share your achievements with friends',
      ],
      impact: {
        co2Saved: '0.05 kg',
        treesPlanted: '0.25',
        creditsEarned: 10,
      },
    },
    {
      id: 2,
      title: 'Week Streak',
      icon: 'local-fire-department',
      earned: true,
      description: 'Maintained 7-day activity streak',
      requirement: 'Stay active for 7 consecutive days',
      progress: '7/7 days completed',
      category: 'Consistency',
      earnedDate: 'Jan 22, 2025',
      details: 'You\'ve shown great commitment by maintaining a 7-day activity streak! Consistency is key to building sustainable habits and making a lasting environmental impact.',
      tips: [
        'Set daily reminders to check in',
        'Make sustainable choices a habit',
        'Track your weekly progress',
      ],
      impact: {
        co2Saved: '0.35 kg',
        treesPlanted: '1.75',
        creditsEarned: 20,
      },
    },
    {
      id: 3,
      title: 'Eco Warrior',
      icon: 'eco',
      earned: true,
      description: 'Earned 100+ carbon credits',
      requirement: 'Accumulate 100 carbon credits',
      progress: '247/100 credits earned',
      category: 'Achievement',
      earnedDate: 'Feb 5, 2025',
      details: 'You\'ve earned the prestigious Eco Warrior badge by accumulating over 100 carbon credits! Your dedication to sustainable practices is making a real difference in the fight against climate change.',
      tips: [
        'Continue making eco-friendly choices',
        'Explore new sustainable merchants',
        'Maximize your carbon credit earnings',
      ],
      impact: {
        co2Saved: '2.5 kg',
        treesPlanted: '12.5',
        creditsEarned: 50,
      },
    },
    {
      id: 4,
      title: 'Green Champion',
      icon: 'emoji-events',
      earned: false,
      description: 'Offset 10kg of CO₂ emissions',
      requirement: 'Reach 10kg CO₂ offset milestone',
      progress: '2.4/10 kg CO₂ offset',
      category: 'Impact',
      details: 'Become a Green Champion by offsetting 10kg of CO₂ emissions! This milestone represents a significant contribution to environmental conservation.',
      tips: [
        'Increase your eco-friendly transactions',
        'Participate in carbon offset programs',
        'Choose sustainable transportation options',
      ],
      requiredActions: [
        'Make more eco-friendly purchases',
        'Support verified green merchants',
        'Engage with sustainability programs',
      ],
    },
    {
      id: 5,
      title: 'Planet Hero',
      icon: 'public',
      earned: false,
      description: 'Plant equivalent of 50 trees',
      requirement: 'Achieve 50 tree planting equivalent',
      progress: '12/50 trees planted',
      category: 'Impact',
      details: 'Become a Planet Hero by achieving the equivalent of planting 50 trees! Your actions are helping to restore natural ecosystems and combat climate change.',
      tips: [
        'Earn more carbon credits through transactions',
        'Support reforestation projects',
        'Choose eco-friendly products',
      ],
      requiredActions: [
        'Accumulate 1000 carbon credits',
        'Participate in green initiatives',
        'Offset significant CO₂ emissions',
      ],
    },
    {
      id: 6,
      title: 'Sustainable Shopper',
      icon: 'shopping-bag',
      earned: false,
      description: 'Complete 50 eco-friendly purchases',
      requirement: 'Make 50 sustainable purchases',
      progress: '28/50 purchases',
      category: 'Shopping',
      details: 'Show your commitment to sustainable shopping by completing 50 eco-friendly purchases through verified green merchants.',
      tips: [
        'Look for eco-certified products',
        'Support local sustainable businesses',
        'Choose products with minimal packaging',
      ],
      requiredActions: [
        'Shop at verified eco-friendly stores',
        'Choose sustainable alternatives',
        'Support green businesses',
      ],
    },
  ];

  const openBadgeModal = (badge: any) => {
    setSelectedBadge(badge);
    setModalVisible(true);
  };

  const closeBadgeModal = () => {
    setModalVisible(false);
  };

  const categories = ['All', 'Getting Started', 'Consistency', 'Achievement', 'Impact', 'Shopping'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredBadges = selectedCategory === 'All'
    ? allBadges
    : allBadges.filter(badge => badge.category === selectedCategory);

  const earnedCount = allBadges.filter(b => b.earned).length;
  const totalCount = allBadges.length;

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
          <Text style={styles.headerTitle}>Achievement Badges</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {earnedCount} of {totalCount} Badges Earned
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(earnedCount / totalCount) * 100}%` },
                ]}
              />
            </View>
          </View>
          <View style={styles.statsCircle}>
            <Text style={styles.statsNumber}>{earnedCount}/{totalCount}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category && styles.categoryChipTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.badgesGrid}>
          {filteredBadges.map((badge) => (
            <TouchableOpacity
              key={badge.id}
              style={[
                styles.badgeCard,
                !badge.earned && styles.badgeCardLocked,
              ]}
              onPress={() => openBadgeModal(badge)}
              activeOpacity={0.7}
            >
              <View style={styles.badgeHeader}>
                <View style={[
                  styles.badgeIconContainer,
                  { backgroundColor: badge.earned ? '#E8F8F5' : '#F5F5F5' }
                ]}>
                  <MaterialIcons
                    name={badge.icon as any}
                    size={36}
                    color={badge.earned ? '#00C896' : '#999999'}
                  />
                </View>
                {badge.earned && (
                  <View style={styles.earnedIndicator}>
                    <MaterialIcons name="check-circle" size={20} color="#00C896" />
                  </View>
                )}
              </View>
              <View style={styles.badgeContent}>
                <Text
                  style={[
                    styles.badgeTitle,
                    !badge.earned && styles.badgeTitleLocked,
                  ]}
                >
                  {badge.title}
                </Text>
                <Text
                  style={[
                    styles.badgeDescription,
                    !badge.earned && styles.badgeDescriptionLocked,
                  ]}
                  numberOfLines={2}
                >
                  {badge.description}
                </Text>
                <View style={styles.badgeFooter}>
                  <Text
                    style={[
                      styles.badgeProgress,
                      !badge.earned && styles.badgeProgressLocked,
                    ]}
                  >
                    {badge.progress}
                  </Text>
                  <MaterialIcons
                    name="info-outline"
                    size={16}
                    color={badge.earned ? '#00C896' : '#CCCCCC'}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoSection}>
          <LinearGradient colors={['#E8F8F5', '#D1F2EB']} style={styles.infoCard}>
            <MaterialIcons name="info" size={32} color="#00C896" />
            <Text style={styles.infoTitle}>About Carbon Credits & Badges</Text>
            <Text style={styles.infoText}>
              Earn badges by completing eco-friendly challenges and accumulating carbon credits.
              Each badge represents your commitment to sustainability and contributes to environmental conservation.
            </Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <MaterialIcons name="check-circle" size={20} color="#00C896" />
                <Text style={styles.benefitText}>Earn bonus credits with each badge</Text>
              </View>
              <View style={styles.benefitItem}>
                <MaterialIcons name="check-circle" size={20} color="#00C896" />
                <Text style={styles.benefitText}>Track your environmental impact</Text>
              </View>
              <View style={styles.benefitItem}>
                <MaterialIcons name="check-circle" size={20} color="#00C896" />
                <Text style={styles.benefitText}>Unlock exclusive rewards</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeBadgeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={closeBadgeModal}
                >
                  <MaterialIcons name="close" size={24} color="#333333" />
                </TouchableOpacity>
              </View>

              {selectedBadge && (
                <>
                  <View style={styles.modalBadgeDisplay}>
                    <LinearGradient
                      colors={selectedBadge.earned ? ['#E8F8F5', '#D1F2EB'] : ['#F5F5F5', '#E5E5E5']}
                      style={styles.modalBadgeCircle}
                    >
                      <MaterialIcons
                        name={selectedBadge.icon as any}
                        size={64}
                        color={selectedBadge.earned ? '#00C896' : '#999999'}
                      />
                    </LinearGradient>
                    {selectedBadge.earned && (
                      <View style={styles.modalEarnedBadge}>
                        <MaterialIcons name="verified" size={32} color="#00C896" />
                      </View>
                    )}
                  </View>

                  <Text style={styles.modalBadgeTitle}>{selectedBadge.title}</Text>
                  <Text style={styles.modalBadgeCategory}>{selectedBadge.category}</Text>

                  {selectedBadge.earned && selectedBadge.earnedDate && (
                    <View style={styles.earnedDateContainer}>
                      <MaterialIcons name="event" size={16} color="#00C896" />
                      <Text style={styles.earnedDateText}>Earned on {selectedBadge.earnedDate}</Text>
                    </View>
                  )}

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Description</Text>
                    <Text style={styles.modalSectionText}>{selectedBadge.details}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Progress</Text>
                    <Text style={styles.modalProgressText}>{selectedBadge.progress}</Text>
                    <View style={styles.modalProgressBar}>
                      <View
                        style={[
                          styles.modalProgressFill,
                          {
                            width: selectedBadge.earned ? '100%' :
                              `${(parseFloat(selectedBadge.progress.split('/')[0]) /
                                parseFloat(selectedBadge.progress.split('/')[1])) * 100}%`,
                          },
                        ]}
                      />
                    </View>
                  </View>

                  {selectedBadge.impact && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Environmental Impact</Text>
                      <View style={styles.impactGrid}>
                        <View style={styles.impactItem}>
                          <MaterialIcons name="eco" size={24} color="#4CAF50" />
                          <Text style={styles.impactValue}>{selectedBadge.impact.co2Saved}</Text>
                          <Text style={styles.impactLabel}>CO₂ Saved</Text>
                        </View>
                        <View style={styles.impactItem}>
                          <MaterialIcons name="park" size={24} color="#8BC34A" />
                          <Text style={styles.impactValue}>{selectedBadge.impact.treesPlanted}</Text>
                          <Text style={styles.impactLabel}>Trees</Text>
                        </View>
                        <View style={styles.impactItem}>
                          <MaterialIcons name="stars" size={24} color="#FFB300" />
                          <Text style={styles.impactValue}>{selectedBadge.impact.creditsEarned}</Text>
                          <Text style={styles.impactLabel}>Credits</Text>
                        </View>
                      </View>
                    </View>
                  )}

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>
                      {selectedBadge.earned ? 'Tips to Maintain' : 'How to Earn'}
                    </Text>
                    {(selectedBadge.earned ? selectedBadge.tips : selectedBadge.requiredActions || selectedBadge.tips)?.map((tip: string, index: number) => (
                      <View key={index} style={styles.tipItem}>
                        <MaterialIcons name="chevron-right" size={20} color="#00C896" />
                        <Text style={styles.tipText}>{tip}</Text>
                      </View>
                    ))}
                  </View>

                  {!selectedBadge.earned && (
                    <TouchableOpacity style={styles.ctaButton}>
                      <LinearGradient
                        colors={['#00C896', '#00A876']}
                        style={styles.ctaButtonGradient}
                      >
                        <Text style={styles.ctaButtonText}>Start Working Towards This Badge</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 20,
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
  },
  progressInfo: {
    flex: 1,
    marginRight: 16,
  },
  progressText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  statsCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00C896',
  },
  categoriesScroll: {
    maxHeight: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#00C896',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  categoryChipTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  badgesGrid: {
    gap: 16,
  },
  badgeCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  badgeCardLocked: {
    opacity: 0.6,
    backgroundColor: '#FAFAFA',
    borderColor: '#E5E5E5',
  },
  badgeHeader: {
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  badgeIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earnedIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 2,
    elevation: 3,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  badgeContent: {
    flex: 1,
    justifyContent: 'center',
  },
  badgeTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  badgeTitleLocked: {
    color: '#999999',
  },
  badgeDescription: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
    marginBottom: 8,
  },
  badgeDescriptionLocked: {
    color: '#AAAAAA',
  },
  badgeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeProgress: {
    fontSize: 12,
    color: '#00C896',
    fontWeight: '700',
  },
  badgeProgressLocked: {
    color: '#CCCCCC',
  },
  infoSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  infoCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  benefitsList: {
    width: '100%',
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  bottomSpacing: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    padding: 24,
  },
  modalHeader: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBadgeDisplay: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  modalBadgeCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalEarnedBadge: {
    position: 'absolute',
    bottom: 0,
    right: width / 2 - 70,
  },
  modalBadgeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalBadgeCategory: {
    fontSize: 14,
    color: '#00C896',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 12,
  },
  earnedDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 20,
  },
  earnedDateText: {
    fontSize: 13,
    color: '#666666',
  },
  modalSection: {
    marginTop: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  modalSectionText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },
  modalProgressText: {
    fontSize: 14,
    color: '#00C896',
    fontWeight: '600',
    marginBottom: 8,
  },
  modalProgressBar: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  modalProgressFill: {
    height: '100%',
    backgroundColor: '#00C896',
    borderRadius: 6,
  },
  impactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  impactItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  impactValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 8,
  },
  impactLabel: {
    fontSize: 11,
    color: '#666666',
    marginTop: 4,
    textAlign: 'center',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    flex: 1,
    marginLeft: 8,
  },
  ctaButton: {
    marginTop: 24,
    borderRadius: 25,
    overflow: 'hidden',
  },
  ctaButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default BadgeDetailsScreen;
