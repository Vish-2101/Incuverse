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

const EnvironmentalEducationScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const quickFacts = [
    {
      id: 1,
      fact: 'If everyone reduced their carbon footprint by just 10%, global emissions would drop by 3.6 billion tons annually.',
      icon: 'lightbulb',
    },
    {
      id: 2,
      fact: 'A single tree can absorb up to 22 kg of CO₂ per year, equivalent to driving 100 km in a car.',
      icon: 'nature',
    },
    {
      id: 3,
      fact: 'Sustainable businesses generate 25% less waste and use 30% less energy on average.',
      icon: 'business',
    },
    {
      id: 4,
      fact: 'Every rupee spent on eco-friendly products creates a market incentive for more sustainable production.',
      icon: 'attach-money',
    },
  ];

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
          <Text style={styles.headerTitle}>Environmental Education</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.headerContent}>
          <MaterialIcons name="school" size={48} color="white" />
          <Text style={styles.headerSubtitle}>
            Learn how your actions make a difference
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Did You Know?</Text>
          <View style={styles.factsContainer}>
            {quickFacts.map((item) => (
              <View key={item.id} style={styles.factCard}>
                <View style={styles.factIconContainer}>
                  <MaterialIcons name={item.icon as any} size={28} color="#00C896" />
                </View>
                <Text style={styles.factText}>{item.fact}</Text>
              </View>
            ))}
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
  headerContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 12,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  factsContainer: {
    gap: 16,
  },
  factCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  factIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8F8F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  factText: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default EnvironmentalEducationScreen;
