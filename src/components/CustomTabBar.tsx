import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, descriptors, navigation }) => {
  const currentRouteName = state?.routes?.[state.index]?.name;
  if (currentRouteName === 'Scan') {
    return null;
  }
  const tabs = [
    { name: 'Home', icon: 'home', label: 'Home' },
    { name: 'Payments', icon: 'payment', label: 'Payments' },
    { name: 'Scan', icon: 'qr-code-scanner', label: 'Scan' },
    { name: 'Rewards', icon: 'card-giftcard', label: 'Rewards' },
    { name: 'Carbon', icon: 'eco', label: 'Carbon' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isFocused = state.index === index;
          const isMiddle = index === 2; // Scan button

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: state.routes[index].key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(tab.name);
            }
          };

          if (isMiddle) {
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.scanButtonContainer}
                onPress={onPress}
              >
                <LinearGradient
                  colors={['#00C896', '#00A876']}
                  style={styles.scanButton}
                >
                  <MaterialIcons
                    name={tab.icon as any}
                    size={28}
                    color="white"
                  />
                </LinearGradient>
                <Text style={styles.scanLabel}>{tab.label}</Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabButton}
              onPress={onPress}
            >
              <MaterialIcons
                name={tab.icon as any}
                size={24}
                color={isFocused ? '#00C896' : '#999999'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? '#00C896' : '#999999' }
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  scanButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -25,
  },
  scanButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scanLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00C896',
    marginTop: 8,
  },
});

export default CustomTabBar;