# Dark Mode Implementation

This document describes the dark mode implementation for the EcoCred app.

## Features

- **Complete Dark Mode Support**: The app now supports both light and dark themes
- **Persistent Theme Storage**: User's theme preference is saved and restored on app restart
- **Theme Toggle**: Easy-to-use toggle button available in key screens
- **Consistent Green Branding**: The signature green color (#00C896) is maintained in both themes
- **Smooth Theme Transitions**: Instant theme switching without app restart

## Implementation Details

### 1. Theme Context (`src/contexts/ThemeContext.tsx`)
- Provides theme state management across the entire app
- Handles theme persistence using AsyncStorage
- Exports `useTheme` hook for easy theme access

### 2. Theme Utilities (`src/utils/theme.ts`)
- Defines color schemes for both light and dark modes
- Provides helper functions for creating theme-aware styles
- Maintains consistent green branding across themes

### 3. Theme Toggle Component (`src/components/ThemeToggle.tsx`)
- Reusable toggle button component
- Shows appropriate icon (sun/moon) based on current theme
- Styled to match the app's design language

### 4. Updated Screens
- **DashboardScreen**: Full dark mode support with theme toggle in header
- **ProfileScreen**: Complete theme integration with toggle in header
- **LoginScreen**: Theme-aware form elements and styling

### 5. Storage Integration (`src/utils/storage.ts`)
- Added theme storage functions
- Theme preference persists across app sessions
- Integrated with existing storage system

## Color Scheme

### Light Mode
- Background: `#F8F9FA`
- Surface: `#FFFFFF`
- Text: `#333333`
- Text Secondary: `#666666`
- Primary: `#00C896` (Green - maintained)

### Dark Mode
- Background: `#121212`
- Surface: `#1E1E1E`
- Card: `#2D2D2D`
- Text: `#FFFFFF`
- Text Secondary: `#B0B0B0`
- Primary: `#00C896` (Green - maintained)

## Usage

### Using the Theme Hook
```typescript
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../utils/theme';

const MyComponent = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const themeColors = getThemeColors(theme);
  
  return (
    <View style={{ backgroundColor: themeColors.background }}>
      <Text style={{ color: themeColors.text }}>Hello World</Text>
    </View>
  );
};
```

### Adding Theme Toggle
```typescript
import ThemeToggle from '../components/ThemeToggle';

// In your component's render method
<ThemeToggle size={24} style={styles.themeToggle} />
```

## Files Modified

1. `src/contexts/ThemeContext.tsx` - New theme context
2. `src/components/ThemeToggle.tsx` - New toggle component
3. `src/utils/theme.ts` - New theme utilities
4. `src/utils/storage.ts` - Added theme storage
5. `App.tsx` - Added theme provider
6. `src/screens/DashboardScreen.tsx` - Added dark mode support
7. `src/screens/ProfileScreen.tsx` - Added dark mode support
8. `src/screens/LoginScreen.tsx` - Added dark mode support
9. `src/types/navigation.ts` - Updated navigation types

## Future Enhancements

- Add system theme detection (follow device theme)
- Add more theme customization options
- Implement theme-specific animations
- Add theme preview in settings
