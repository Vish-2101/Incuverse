import { Platform } from 'react-native';

// Platform-specific API base URLs
const API_CONFIG = {
  // For iOS devices (simulator and physical devices), use localhost
  ios: 'http://localhost:3000/api',
  // For Android devices, use the current IP address
  android: 'http://192.168.77.68:3000/api',
};

// Get the appropriate API base URL based on the platform
export const getApiBaseUrl = (): string => {
  return Platform.OS === 'ios' ? API_CONFIG.ios : API_CONFIG.android;
};

// Specific API endpoints
export const API_ENDPOINTS = {
  verify: `${getApiBaseUrl()}/verify`,
  users: `${getApiBaseUrl()}/users`,
};

// Export individual endpoint functions for convenience
export const getVerifyApiUrl = (): string => `${getApiBaseUrl()}/verify`;
export const getUsersApiUrl = (): string => `${getApiBaseUrl()}/users`;
