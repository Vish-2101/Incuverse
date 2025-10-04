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
import { getTransactions, Transaction } from '../utils/storage';
import { useTheme } from '../contexts/ThemeContext';
import { useCredits } from '../contexts/CreditsContext';
import { getThemeColors } from '../utils/theme';
import ThemeToggle from '../components/ThemeToggle';

const { width } = Dimensions.get('window');

const CarbonCreditsScreen: React.FC<{ navigation: any; parentNavigation?: any }> = ({ navigation, parentNavigation }) => {
  const { theme, isDark } = useTheme();
  const { credits: totalCredits, refreshCredits } = useCredits();
  const themeColors = getThemeColors(theme);

  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [recentActivities, setRecentActivities] = useState<Transaction[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await refreshCredits();
    const transactions = await getTransactions();
    setRecentActivities(transactions.slice(0, 4)); // Show latest 4
  };

  const carbonStats = {
    totalCredits: totalCredits,
    monthlyOffset: (totalCredits * 0.02).toFixed(1),
    yearlyOffset: (totalCredits * 0.24).toFixed(1),
    treesEquivalent: Math.floor(totalCredits * 0.05),
    rank: 'Eco Warrior',
  };

  const impactGoals = [
    {
      id: 1,
      title: 'Monthly Target',
      current: totalCredits,
      target: 300,
      unit: 'credits',
      color: '#00C896',
      icon: 'trending-up',
    },
    {
      id: 2,
      title: 'CO₂ Offset Goal',
      current: parseFloat(carbonStats.monthlyOffset),
      target: 5.0,
      unit: 'kg CO₂',
      color: '#4ECDC4',
      icon: 'eco',
    },
    {
      id: 3,
      title: 'Tree Equivalent',
      current: carbonStats.treesEquivalent,
      target: 20,
      unit: 'trees',
      color: '#96CEB4',
      icon: 'park',
    },
  ];

  const achievementBadges = [
    {
      id: 1,
      title: 'First Payment',
      icon: 'star',
      earned: recentActivities.length > 0,
      description: 'Made your first eco-friendly payment',
      requirement: 'Complete 1 transaction',
      progress: `${Math.min(recentActivities.length, 1)}/1 completed`
    },
    {
      id: 2,
      title: 'Week Streak',
      icon: 'local-fire-department',
      earned: true,
      description: 'Maintained 7-day activity streak',
      requirement: 'Stay active for 7 consecutive days',
      progress: '7/7 days completed'
    },
    {
      id: 3,
      title: 'Eco Warrior',
      icon: 'eco',
      earned: totalCredits >= 100,
      description: 'Earned 100+ carbon credits',
      requirement: 'Accumulate 100 carbon credits',
      progress: `${totalCredits}/100 credits earned`
    },
    {
      id: 4,
      title: 'Green Champion',
      icon: 'emoji-events',
      earned: parseFloat(carbonStats.monthlyOffset) >= 10,
      description: 'Offset 10kg of CO₂ emissions',
      requirement: 'Reach 10kg CO₂ offset milestone',
      progress: `${carbonStats.monthlyOffset}/10 kg CO₂ offset`
    },
    {
      id: 5,
      title: 'Planet Hero',
      icon: 'public',
      earned: carbonStats.treesEquivalent >= 50,
      description: 'Plant equivalent of 50 trees',
      requirement: 'Achieve 50 tree planting equivalent',
      progress: `${carbonStats.treesEquivalent}/50 trees planted`
    },
  ];

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#00C896', '#00A876']} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Carbon Credits</Text>
          <ThemeToggle size={24} style={styles.themeToggle} />
        </View>
        <Text style={styles.headerSubtitle}>Track your environmental impact</Text>

        <View style={styles.statsContainer}>
          <View style={styles.mainStat}>
            <MaterialIcons name="eco" size={32} color="white" />
            <Text style={styles.mainStatNumber}>{carbonStats.totalCredits}</Text>
            <Text style={styles.mainStatLabel}>Total Credits Earned</Text>
          </View>

          <View style={styles.subStatsRow}>
            <View style={styles.subStat}>
              <Text style={styles.subStatNumber}>{carbonStats.monthlyOffset}</Text>
              <Text style={styles.subStatLabel}>kg CO₂ Offset</Text>
            </View>
            <View style={styles.subStat}>
              <Text style={styles.subStatNumber}>{carbonStats.treesEquivalent}</Text>
              <Text style={styles.subStatLabel}>Trees Planted</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Impact Goals</Text>
          {impactGoals.map((goal) => (
            <View key={goal.id} style={[styles.goalCard, { backgroundColor: themeColors.card }]}>
              <View style={styles.goalHeader}>
                <View style={styles.goalInfo}>
                  <MaterialIcons name={goal.icon as any} size={20} color={goal.color} />
                  <Text style={[styles.goalTitle, { color: themeColors.text }]}>{goal.title}</Text>
                </View>
                <Text style={[styles.goalProgress, { color: themeColors.textSecondary }]}>
                  {goal.current} / {goal.target} {goal.unit}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${getProgressPercentage(goal.current, goal.target)}%`,
                      backgroundColor: goal.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Achievement Badges</Text>
            <TouchableOpacity onPress={() => parentNavigation?.navigate('BadgeDetails')}>
              <Text style={[styles.seeAllText, { color: themeColors.primary }]}>Know More</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.sectionSubtitle, { color: themeColors.textSecondary }]}>Complete challenges to unlock badges and earn bonus credits</Text>
          <View style={styles.badgesGrid}>
            {achievementBadges.slice(0, 3).map((badge) => (
              <TouchableOpacity
                key={badge.id}
                style={[
                  styles.badgeCard,
                  { backgroundColor: themeColors.card },
                  !badge.earned && styles.badgeCardLocked,
                ]}
                onPress={() => parentNavigation?.navigate('BadgeDetails', { selectedBadge: badge })}
                activeOpacity={0.7}
              >
                <View style={styles.badgeHeader}>
                  <View style={[
                    styles.badgeIconContainer,
                    { backgroundColor: badge.earned ? themeColors.primaryLight : themeColors.divider }
                  ]}>
                    <MaterialIcons
                      name={badge.icon as any}
                      size={32}
                      color={badge.earned ? themeColors.primary : themeColors.textTertiary}
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
                      { color: badge.earned ? themeColors.text : themeColors.textTertiary },
                      !badge.earned && styles.badgeTitleLocked,
                    ]}
                  >
                    {badge.title}
                  </Text>
                  <Text
                    style={[
                      styles.badgeDescription,
                      { color: badge.earned ? themeColors.textSecondary : themeColors.textTertiary },
                      !badge.earned && styles.badgeDescriptionLocked,
                    ]}
                    numberOfLines={2}
                  >
                    {badge.description}
                  </Text>
                  <View style={styles.badgeProgressContainer}>
                    <Text
                      style={[
                        styles.badgeProgress,
                        !badge.earned && styles.badgeProgressLocked,
                      ]}
                    >
                      {badge.progress}
                    </Text>
                    <MaterialIcons name="arrow-forward" size={16} color={badge.earned ? '#00C896' : '#CCCCCC'} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.viewAllBadgesButton}
            onPress={() => parentNavigation?.navigate('BadgeDetails')}
          >
            <Text style={styles.viewAllBadgesText}>View All Badges</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#00C896" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Recent Activities</Text>
            <TouchableOpacity onPress={() => parentNavigation?.navigate('ActivityDetails')}>
              <Text style={[styles.seeAllText, { color: themeColors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                style={[styles.activityCard, { backgroundColor: themeColors.card }]}
                onPress={() => parentNavigation?.navigate('ActivityDetails', {
                  selectedActivity: {
                    ...activity,
                    offset: activity.carbonImpact?.co2Offset || `${(activity.credits * 0.02).toFixed(2)} kg CO₂`,
                  }
                })}
                activeOpacity={0.7}
              >
                <View style={[styles.activityIcon, { backgroundColor: themeColors.primaryLight }]}>
                  <MaterialIcons name={activity.icon as any} size={20} color={themeColors.primary} />
                </View>
                <View style={styles.activityDetails}>
                  <Text style={[styles.activityMerchant, { color: themeColors.text }]}>{activity.merchant}</Text>
                  <Text style={[styles.activityDate, { color: themeColors.textSecondary }]}>{activity.date}</Text>
                  {activity.amount && (
                    <Text style={[styles.activityAmount, { color: themeColors.text }]}>₹{activity.amount}</Text>
                  )}
                </View>
                <View style={styles.activityImpact}>
                  <View style={styles.creditsEarned}>
                    <MaterialIcons name="eco" size={16} color={themeColors.primary} />
                    <Text style={[styles.creditsText, { color: themeColors.primary }]}>+{activity.credits}</Text>
                  </View>
                  <Text style={[styles.offsetText, { color: themeColors.textSecondary }]}>
                    {activity.carbonImpact?.co2Offset || `${(activity.credits * 0.02).toFixed(2)} kg CO₂`}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: themeColors.card }]}>
              <MaterialIcons name="eco" size={48} color={themeColors.textTertiary} />
              <Text style={[styles.emptyStateText, { color: themeColors.textSecondary }]}>No activities yet</Text>
              <Text style={[styles.emptyStateSubtext, { color: themeColors.textTertiary }]}>Start making eco-friendly payments to earn credits!</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Environmental Education</Text>

          <TouchableOpacity
            style={styles.educationCard}
            onPress={() => parentNavigation?.navigate('EnvironmentalEducation')}
            activeOpacity={0.8}
          >
            <LinearGradient colors={isDark ? ['#1A3A2E', '#0F2A1F'] : ['#E8F8F5', '#D1F2EB']} style={styles.educationGradient}>
              <MaterialIcons name="lightbulb" size={32} color={themeColors.primary} />
              <Text style={[styles.educationTitle, { color: themeColors.text }]}>Did You Know?</Text>
              <Text style={[styles.educationText, { color: themeColors.textSecondary }]}>
                Tap to explore how your carbon credits are making a real environmental impact!
              </Text>
              <View style={styles.learnMoreButton}>
                <Text style={styles.learnMoreText}>Learn More</Text>
                <MaterialIcons name="arrow-forward" size={16} color="white" />
              </View>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  themeToggle: {
    padding: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  statsContainer: {
    marginTop: 20,
  },
  mainStat: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  mainStatNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  mainStatLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  subStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subStat: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
  },
  subStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  subStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    textAlign: 'center',
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
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
    lineHeight: 18,
  },
  seeAllText: {
    fontSize: 14,
    color: '#00C896',
    fontWeight: '600',
  },
  goalCard: {
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
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8,
  },
  goalProgress: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
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
  badgeProgressContainer: {
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
  viewAllBadgesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  viewAllBadgesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00C896',
    marginRight: 8,
  },
  activityCard: {
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
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F8F5',
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
    color: '#333333',
  },
  activityDate: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  activityAmount: {
    fontSize: 14,
    color: '#999999',
    marginTop: 2,
  },
  activityImpact: {
    alignItems: 'flex-end',
  },
  creditsEarned: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  creditsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00C896',
    marginLeft: 4,
  },
  offsetText: {
    fontSize: 10,
    color: '#666666',
    marginTop: 4,
  },
  educationCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 4,
  },
  educationGradient: {
    padding: 28,
    alignItems: 'center',
  },
  educationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 12,
  },
  educationText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#00C896',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  bottomSpacing: {
    height: 100,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default CarbonCreditsScreen;