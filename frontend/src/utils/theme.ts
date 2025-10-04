import { StyleSheet } from 'react-native';
import { ThemeMode } from '../contexts/ThemeContext';

export const colors = {
  light: {
    // Primary green colors (same in both themes)
    primary: '#00C896',
    primaryDark: '#00A876',
    primaryLight: '#E8F8F5',
    
    // Background colors
    background: '#F8F9FA',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    
    // Text colors
    text: '#333333',
    textSecondary: '#666666',
    textTertiary: '#999999',
    textInverse: '#FFFFFF',
    
    // Border and divider colors
    border: '#E0E0E0',
    divider: '#F0F0F0',
    
    // Status colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    
    // Shadow colors
    shadow: '#000000',
    
    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    // Primary green colors (same in both themes)
    primary: '#00C896',
    primaryDark: '#00A876',
    primaryLight: '#1A3A2E',
    
    // Background colors
    background: '#121212',
    surface: '#1E1E1E',
    card: '#2D2D2D',
    
    // Text colors
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#808080',
    textInverse: '#000000',
    
    // Border and divider colors
    border: '#333333',
    divider: '#2A2A2A',
    
    // Status colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    
    // Shadow colors
    shadow: '#000000',
    
    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};

export const getThemeColors = (theme: ThemeMode) => colors[theme];

export const createThemedStyles = (theme: ThemeMode) => {
  const themeColors = getThemeColors(theme);
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    surface: {
      backgroundColor: themeColors.surface,
    },
    card: {
      backgroundColor: themeColors.card,
      borderRadius: 12,
      shadowColor: themeColors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    text: {
      color: themeColors.text,
    },
    textSecondary: {
      color: themeColors.textSecondary,
    },
    textTertiary: {
      color: themeColors.textTertiary,
    },
    textInverse: {
      color: themeColors.textInverse,
    },
    primaryText: {
      color: themeColors.primary,
    },
    border: {
      borderColor: themeColors.border,
    },
    divider: {
      backgroundColor: themeColors.divider,
    },
  });
};
