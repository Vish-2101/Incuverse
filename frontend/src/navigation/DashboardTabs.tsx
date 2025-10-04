import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import DashboardScreen from '../screens/DashboardScreen';
import PaymentsScreen from '../screens/PaymentsScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import RewardsScreen from '../screens/RewardsScreen';
import CarbonCreditsScreen from '../screens/CarbonCreditsScreen';
import CustomTabBar from '../components/CustomTabBar';

const Tab = createBottomTabNavigator();

const DashboardTabs: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home">
        {(props) => <DashboardScreen {...props} parentNavigation={navigation} />}
      </Tab.Screen>
      <Tab.Screen name="Payments">
        {(props) => <PaymentsScreen {...props} parentNavigation={navigation} />}
      </Tab.Screen>
      <Tab.Screen name="Scan">
        {(props) => <QRScannerScreen {...props} parentNavigation={navigation} />}
      </Tab.Screen>
      <Tab.Screen name="Rewards">
        {(props) => <RewardsScreen {...props} parentNavigation={navigation} />}
      </Tab.Screen>
      <Tab.Screen name="Carbon">
        {(props) => <CarbonCreditsScreen {...props} parentNavigation={navigation} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default DashboardTabs;