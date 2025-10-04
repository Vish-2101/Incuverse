import React, { useState } from 'react';
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

const CarbonCreditsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const carbonStats = {
    totalCredits: 247,
    monthlyOffset: 2.4,
    yearlyOffset: 28.8,
    treesEquivalent: 12,
    rank: 'Eco Warrior',
  };

  const recentActivities = [
    {
      id: 1,
      type: 'payment',
      merchant: 'Starbucks',
      amount: '₹450',
      credits: 5,
      offset: '0.12 kg CO₂',
      date: 'Today, 2:30 PM',
      icon: 'payment',
    },
    {
      id: 2,
      type: 'payment',
      merchant: 'Zomato',
      amount: '₹680',
      credits: 8,
      offset: '0.18 kg CO₂',
      date: 'Yesterday, 7:45 PM',
      icon: 'restaurant',
    },
    {
      id: 3,
      type: 'bonus',
      merchant: 'Daily Check-in',
      amount: '',
      credits: 2,
      offset: '0.05 kg CO₂',
      date: 'Yesterday, 9:00 AM',
      icon: 'event-available',
    },
    {
      id: 4,
      type: 'payment',
      merchant: 'Amazon',
      amount: '₹1,200',
      credits: 12,
      offset: '0.25 kg CO₂',
      date: '2 days ago, 3:15 PM',
      icon: 'shopping-cart',
    },
  ];

  const impactGoals = [
    {
      id: 1,
      title: 'Monthly Target',
      current: 247,
      target: 300,
      unit: 'credits',
      color: '#00C896',
      icon: 'trending-up',
    },
    {
      id: 2,
      title: 'CO₂ Offset Goal',
      current: 2.4,
      target: 5.0,
      unit: 'kg CO₂',
      color: '#4ECDC4',
      icon: 'eco',
    },
    {
      id: 3,
      title: 'Tree Equivalent',
      current: 12,
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
      earned: true,
      description: 'Made your first eco-friendly payment',
      requirement: 'Complete 1 transaction',
      progress: '1/1 completed'
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
      earned: true,
      description: 'Earned 100+ carbon credits',
      requirement: 'Accumulate 100 carbon credits',
      progress: '247/100 credits earned'
    },
    {
      id: 4,
      title: 'Green Champion',
      icon: 'emoji-events',
      earned: false,
      description: 'Offset 10kg of CO₂ emissions',
      requirement: 'Reach 10kg CO₂ offset milestone',
      progress: '2.4/10 kg CO₂ offset'
    },
    {
      id: 5,
      title: 'Planet Hero',
      icon: 'public',
      earned: false,
      description: 'Plant equivalent of 50 trees',
      requirement: 'Achieve 50 tree planting equivalent',
      progress: '12/50 trees planted'
    },
  ];

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#00C896', '#00A876']} style={styles.header}>
        <Text style={styles.headerTitle}>Carbon Credits</Text>
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
          <Text style={styles.sectionTitle}>Impact Goals</Text>
          {impactGoals.map((goal) => (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalInfo}>
                  <MaterialIcons name={goal.icon as any} size={20} color={goal.color} />
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                </View>
                <Text style={styles.goalProgress}>
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
            <Text style={styles.sectionTitle}>Achievement Badges</Text>
            <TouchableOpacity onPress={() => navigation.navigate('BadgeDetails')}>
              <Text style={styles.seeAllText}>Know More</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>Complete challenges to unlock badges and earn bonus credits</Text>
          <View style={styles.badgesGrid}>
            {achievementBadges.slice(0, 3).map((badge) => (
              <TouchableOpacity
                key={badge.id}
                style={[
                  styles.badgeCard,
                  !badge.earned && styles.badgeCardLocked,
                ]}
                onPress={() => navigation.navigate('BadgeDetails', { selectedBadge: badge })}
                activeOpacity={0.7}
              >
                <View style={styles.badgeHeader}>
                  <View style={[
                    styles.badgeIconContainer,
                    { backgroundColor: badge.earned ? '#E8F8F5' : '#F5F5F5' }
                  ]}>
                    <MaterialIcons
                      name={badge.icon as any}
                      size={32}
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
            onPress={() => navigation.navigate('BadgeDetails')}
          >
            <Text style={styles.viewAllBadgesText}>View All Badges</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#00C896" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentActivities.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <MaterialIcons name={activity.icon as any} size={20} color="#00C896" />
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityMerchant}>{activity.merchant}</Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
                {activity.amount && (
                  <Text style={styles.activityAmount}>{activity.amount}</Text>
                )}
              </View>
              <View style={styles.activityImpact}>
                <View style={styles.creditsEarned}>
                  <MaterialIcons name="eco" size={16} color="#00C896" />
                  <Text style={styles.creditsText}>+{activity.credits}</Text>
                </View>
                <Text style={styles.offsetText}>{activity.offset}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Environmental Education</Text>

          <View style={styles.educationCard}>
            <LinearGradient colors={['#E8F8F5', '#D1F2EB']} style={styles.educationGradient}>
              <MaterialIcons name="lightbulb" size={32} color="#00C896" />
              <Text style={styles.educationTitle}>Did You Know?</Text>
              <Text style={styles.educationText}>
                Your carbon credits this month have offset the equivalent of driving 125 km in a gasoline car!
              </Text>
              <TouchableOpacity style={styles.learnMoreButton}>
                <Text style={styles.learnMoreText}>Learn More</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <View style={styles.tipsContainer}>
            <View style={styles.tipCard}>
              <MaterialIcons name="eco" size={24} color="#4CAF50" />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Carbon Footprint</Text>
                <Text style={styles.tipText}>Every transaction through eco-friendly merchants reduces your carbon footprint by supporting sustainable practices.</Text>
              </View>
            </View>

            <View style={styles.tipCard}>
              <MaterialIcons name="forest" size={24} color="#8BC34A" />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Tree Planting Impact</Text>
                <Text style={styles.tipText}>Your credits fund real environmental projects. Every 20 credits plants one tree through our verified partners.</Text>
              </View>
            </View>

            <View style={styles.tipCard}>
              <MaterialIcons name="recycling" size={24} color="#FF9800" />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Circular Economy</Text>
                <Text style={styles.tipText}>Supporting businesses with sustainable practices helps create a circular economy that benefits everyone.</Text>
              </View>
            </View>
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
  },
  educationGradient: {
    padding: 24,
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
  tipsContainer: {
    marginTop: 16,
    gap: 12,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default CarbonCreditsScreen;