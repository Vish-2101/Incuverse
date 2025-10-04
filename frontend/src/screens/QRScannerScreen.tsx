import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
  Vibration,
  Animated,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { CameraType, BarcodeScanningResult } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../utils/theme';
import ThemeToggle from '../components/ThemeToggle';

const { width, height } = Dimensions.get('window');

interface QRScannerScreenProps {
  navigation?: any;
}

const QRScannerScreen: React.FC<QRScannerScreenProps> = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const themeColors = getThemeColors(theme);
  
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    // Request permissions on mount if not yet determined
    if (!permission?.granted && permission?.canAskAgain !== false) {
      requestPermission();
    }
    startScanAnimation();
  }, [permission]);

  const getCameraPermissions = async () => {
    try {
      console.log('Requesting camera permissions...');
      const res = await requestPermission();
      console.log('Permission status:', res?.granted ? 'granted' : 'denied');
    } catch (error) {
      console.log('Permission request failed:', error);
    }
  };

  const startScanAnimation = () => {
    const scanAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    scanAnimation.start();
    return () => scanAnimation.stop();
  };

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    if (scanned) return;
    
    console.log('QR Code scanned!', { type, data });
    setScanned(true);

    // Haptic feedback
    if (Platform.OS !== 'web') {
      Vibration.vibrate(100);
    }

    Alert.alert(
      'QR Code Scanned!',
      `QR Code Data: ${data}`,
      [
        {
          text: 'Cancel',
          onPress: () => setScanned(false),
          style: 'cancel',
        },
        {
          text: 'Process',
          onPress: () => {
            Alert.alert(
              'QR Code Processed!',
              'You earned 5 carbon credits for this eco-friendly transaction!',
              [{
                text: 'Done',
                onPress: () => setScanned(false),
              }]
            );
          },
        },
      ]
    );
  };


  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const requestPermissionAgain = async () => {
    await getCameraPermissions();
  };

  // Permission loading state
  if (!permission) {
    return (
      <View style={[styles.permissionContainer, { backgroundColor: themeColors.background }]}>
        <MaterialIcons name={"camera-alt" as any} size={80} color={themeColors.primary} />
        <Text style={[styles.permissionText, { color: themeColors.text }]}>Requesting Camera Access...</Text>
        <Text style={[styles.permissionSubtext, { color: themeColors.textSecondary }]}>
          Please allow camera permission to scan QR codes
        </Text>
        <View style={styles.loadingDots}>
          <Text style={[styles.loadingText, { color: themeColors.textSecondary }]}>Loading...</Text>
        </View>
      </View>
    );
  }

  // Permission denied state
  if (!permission.granted) {
    return (
      <View style={[styles.permissionContainer, { backgroundColor: themeColors.background }]}>
        <MaterialIcons name={"camera-off" as any} size={80} color="#FF6B6B" />
        <Text style={[styles.permissionText, { color: themeColors.text }]}>Camera Access Denied</Text>
        <Text style={[styles.permissionSubtext, { color: themeColors.textSecondary }]}>
          Please enable camera permission in your device settings to use QR scanner
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: themeColors.primary }]}
          onPress={requestPermissionAgain}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
          onPress={() => {
            Alert.alert(
              'Settings',
              'Go to Settings > Apps > EcoCredApp > Permissions > Camera and enable it.',
              [{ text: 'OK' }]
            );
          }}
        >
          <Text style={[styles.settingsButtonText, { color: themeColors.text }]}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Scan QR Code</Text>
          <Text style={styles.headerSubtitle}>Point camera at QR code to make payment</Text>
        </View>
        <ThemeToggle size={24} style={styles.themeToggle} />
      </View>

      {/* Camera Container */}
      <View style={styles.scannerContainer}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing={facing}
          enableTorch={flashOn}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          onCameraReady={() => {
            console.log('Camera is ready!');
            setIsCameraReady(true);
          }}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417', 'ean13', 'ean8', 'code128', 'code39'],
          }}
        />

        {/* Overlay */}
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            {/* Corner indicators */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            {/* Animated scanning line */}
            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [
                    {
                      translateY: scanLineAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 220],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>

          {/* Instructions */}
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              Align QR code within the frame
            </Text>
            {!isCameraReady && (
              <Text style={styles.cameraStatusText}>
                Initializing camera...
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setFlashOn(!flashOn)}
        >
          <MaterialIcons
            name={(flashOn ? 'flash-on' : 'flash-off') as any}
            size={24}
            color="white"
          />
          <Text style={styles.controlText}>Flash</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setScanned(false)}
        >
          <MaterialIcons name={"refresh" as any} size={24} color="white" />
          <Text style={styles.controlText}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton}
          onPress={toggleCameraFacing}
        >
          <MaterialIcons name={"flip-camera-android" as any} size={24} color="white" />
          <Text style={styles.controlText}>Flip</Text>
        </TouchableOpacity>
      </View>

      {/* Scan Again Button */}
      {scanned && (
        <View style={styles.rescaneButton}>
          <TouchableOpacity
            style={[styles.scanAgainButton, { backgroundColor: themeColors.primary }]}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.scanAgainText}>Tap to scan again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 40,
  },
  permissionText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    marginTop: 20,
  },
  permissionSubtext: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  loadingDots: {
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerPlaceholder: {
    width: 40,
  },
  themeToggle: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00C896',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    fontWeight: '600',
  },
  cameraStatusText: {
    fontSize: 14,
    color: '#00C896',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30,
    paddingHorizontal: 40,
    paddingBottom: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  controlButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  controlText: {
    fontSize: 12,
    color: 'white',
    marginTop: 4,
    fontWeight: '600',
  },
  rescaneButton: {
    position: 'absolute',
    bottom: 140,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scanAgainButton: {
    backgroundColor: '#00C896',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scanAgainText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '700',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#00C896',
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
  },
  retryButton: {
    backgroundColor: '#00C896',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  settingsButton: {
    backgroundColor: '#6C757D',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 12,
  },
  settingsButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
});

export default QRScannerScreen;