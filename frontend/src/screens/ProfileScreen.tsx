import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../utils/theme';
import ThemeToggle from '../components/ThemeToggle';
import { getUsersApiUrl } from '../config/api';

interface User {
  fullName: string;
  email?: string;
  phoneNumber?: string;
  joinDate: string;
}

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const themeColors = getThemeColors(theme);
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
          return;
        }

        const response = await fetch(`${getUsersApiUrl()}/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data);
        } else {
          throw new Error(data.message || 'Failed to fetch profile.');
        }
      } catch (error) {
        console.error('Fetch Profile Error:', error);
        Alert.alert('Error', 'Could not load your profile. Please try logging in again.');
        await AsyncStorage.removeItem('userToken');
        navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigation]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('userToken');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          },
        },
      ]
    );
  };
  
  const menuItems = [
    { id: 1, icon: 'edit', title: 'Edit Profile', subtitle: 'Update your personal information', onPress: () => Alert.alert('Edit Profile', 'Coming soon!')},
    { id: 2, icon: 'payment', title: 'Payment Methods', subtitle: 'Manage your payment options', onPress: () => Alert.alert('Payment Methods', 'Coming soon!')},
    { id: 3, icon: 'history', title: 'Transaction History', subtitle: 'View all your transactions', onPress: () => Alert.alert('Transaction History', 'Coming soon!')},
    { id: 4, icon: 'eco', title: 'Carbon Impact Report', subtitle: 'Detailed environmental impact', onPress: () => Alert.alert('Carbon Report', 'Coming soon!')},
    { id: 5, icon: 'help', title: 'Help & Support', subtitle: 'Get assistance', onPress: () => Alert.alert('Help & Support', 'Coming soon!')},
    { id: 6, icon: 'info', title: 'About EcoCred', subtitle: 'Learn more about our mission', onPress: () => Alert.alert('About EcoCred', 'Making payments sustainable!')},
  ];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00C896" />
      </View>
    );
  }

  if (!user) {
    return (
        <View style={styles.loadingContainer}>
            <Text>Could not load user data. Please login again.</Text>
        </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#00C896', '#00A876']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <ThemeToggle size={24} style={styles.themeToggle} />
        </View>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name="account-circle" size={80} color="white" />
          </View>
          <Text style={styles.userName}>{user.fullName}</Text>
          <Text style={styles.userEmail}>{user.email || user.phoneNumber}</Text>
          <Text style={styles.membershipLevel}>Eco Warrior</Text>
        </View>
      </LinearGradient>

       <View style={styles.content}>
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Your Impact</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: themeColors.card }]}>
              <MaterialIcons name="eco" size={24} color={themeColors.primary} />
              <Text style={[styles.statValue, { color: themeColors.text }]}>247</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Carbon Credits</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: themeColors.card }]}>
              <MaterialIcons name="receipt" size={24} color="#4ECDC4" />
              <Text style={[styles.statValue, { color: themeColors.text }]}>156</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Transactions</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: themeColors.card }]}>
              <MaterialIcons name="park" size={24} color="#96CEB4" />
              <Text style={[styles.statValue, { color: themeColors.text }]}>28.4 kg CO₂</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>CO₂ Offset</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Settings</Text>
          <View style={[styles.settingItem, { backgroundColor: themeColors.card }]}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="notifications" size={24} color={themeColors.textSecondary} />
              <View style={styles.settingText}><Text style={[styles.settingTitle, { color: themeColors.text }]}>Push Notifications</Text><Text style={[styles.settingSubtitle, { color: themeColors.textSecondary }]}>Receive transaction alerts</Text></View>
            </View>
            <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} trackColor={{ false: themeColors.border, true: themeColors.primary }} thumbColor={'#ffffff'}/>
          </View>
          <View style={[styles.settingItem, { backgroundColor: themeColors.card }]}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="fingerprint" size={24} color={themeColors.textSecondary} />
              <View style={styles.settingText}><Text style={[styles.settingTitle, { color: themeColors.text }]}>Biometric Security</Text><Text style={[styles.settingSubtitle, { color: themeColors.textSecondary }]}>Use fingerprint for payments</Text></View>
            </View>
            <Switch value={biometricEnabled} onValueChange={setBiometricEnabled} trackColor={{ false: themeColors.border, true: themeColors.primary }} thumbColor={'#ffffff'}/>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Account</Text>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={[styles.menuItem, { backgroundColor: themeColors.card }]} onPress={item.onPress}>
              <View style={styles.menuItemContent}><MaterialIcons name={item.icon as any} size={24} color={themeColors.textSecondary} /><View style={styles.menuItemText}><Text style={[styles.menuItemTitle, { color: themeColors.text }]}>{item.title}</Text><Text style={[styles.menuItemSubtitle, { color: themeColors.textSecondary }]}>{item.subtitle}</Text></View></View>
              <MaterialIcons name="chevron-right" size={24} color={themeColors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: themeColors.card, borderColor: themeColors.border }]} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color="#FF6B6B" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.versionInfo}>
          <Text style={[styles.versionText, { color: themeColors.textTertiary }]}>EcoCred v1.0.0</Text>
          <Text style={[styles.joinedText, { color: themeColors.textTertiary }]}>Member since {new Date(user.joinDate).toLocaleDateString()}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingTop: 50, paddingBottom: 30, paddingHorizontal: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center', flex: 1 },
  themeToggle: { padding: 8 },
  profileCard: { alignItems: 'center', marginTop: 20 },
  avatarContainer: { marginBottom: 16 },
  userName: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  userEmail: { fontSize: 16, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 8 },
  membershipLevel: { fontSize: 14, fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  content: { padding: 20 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333333', marginBottom: 16 },
  statsSection: { marginBottom: 30 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: { flex: 1, backgroundColor: 'white', borderRadius: 12, padding: 16, alignItems: 'center', marginHorizontal: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#333333', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#666666', marginTop: 4, textAlign: 'center' },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  settingInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingText: { marginLeft: 12, flex: 1 },
  settingTitle: { fontSize: 16, fontWeight: '600', color: '#333333' },
  settingSubtitle: { fontSize: 14, color: '#666666', marginTop: 2 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  menuItemContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  menuItemText: { marginLeft: 12, flex: 1 },
  menuItemTitle: { fontSize: 16, fontWeight: '600', color: '#333333' },
  menuItemSubtitle: { fontSize: 14, color: '#666666', marginTop: 2 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: 12, padding: 16, marginTop: 20, marginBottom: 20, borderWidth: 1, borderColor: '#FFE5E5' },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#FF6B6B', marginLeft: 8 },
  versionInfo: { alignItems: 'center', paddingBottom: 20 },
  versionText: { fontSize: 14, color: '#999999' },
  joinedText: { fontSize: 12, color: '#CCCCCC', marginTop: 4 },
});

export default ProfileScreen;