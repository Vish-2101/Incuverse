import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  Easing,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface TicketModalProps {
  visible: boolean;
  onClose: () => void;
  onRedeem: () => void;
  title: string;
  subtitle: string;
  value: string;
  credits: number;
  canRedeem: boolean;
  leftContent: React.ReactNode;
  rightContent?: React.ReactNode;
  type: 'giftcard' | 'eco';
}

const TicketModal: React.FC<TicketModalProps> = ({
  visible,
  onClose,
  onRedeem,
  title,
  subtitle,
  value,
  credits,
  canRedeem,
  leftContent,
  rightContent,
  type,
}) => {
  const [revealed, setRevealed] = useState(false);
  const cutProgress = useRef(new Animated.Value(0)).current;
  const scissorX = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0)).current;

  const ticketWidth = screenWidth - 40;
  const maxDrag = ticketWidth * 0.6;

  const reveal = useCallback(() => {
    if (revealed || !canRedeem) return;
    setRevealed(true);
    onRedeem();
  }, [revealed, canRedeem, onRedeem]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !revealed && canRedeem,
    onMoveShouldSetPanResponder: () => !revealed && canRedeem,
    onPanResponderMove: (_, gesture) => {
      if (revealed || !canRedeem) return;
      const x = Math.max(0, Math.min(gesture.dx, maxDrag));
      scissorX.setValue(x);
      cutProgress.setValue(x / maxDrag);
    },
    onPanResponderRelease: () => {
      if (revealed || !canRedeem) return;
      const current = (cutProgress as any)._value as number;
      if (current > 0.7) {
        Animated.parallel([
          Animated.timing(cutProgress, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }),
          Animated.timing(scissorX, {
            toValue: maxDrag,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          })
        ]).start(() => reveal());
      } else {
        Animated.parallel([
          Animated.spring(cutProgress, {
            toValue: 0,
            tension: 120,
            friction: 8,
            useNativeDriver: false,
          }),
          Animated.spring(scissorX, {
            toValue: 0,
            tension: 120,
            friction: 8,
            useNativeDriver: false,
          })
        ]).start();
      }
    },
  });

  const rightPanelTranslate = cutProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [ticketWidth * 0.35, 0],
    extrapolate: 'clamp',
  });

  const dashedOpacity = cutProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const leftContentOpacity = cutProgress.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [1, 1, 0.3],
    extrapolate: 'clamp',
  });

  React.useEffect(() => {
    if (visible) {
      setRevealed(false);
      cutProgress.setValue(0);
      scissorX.setValue(0);
      Animated.spring(modalScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(modalScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(modalScale, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      setRevealed(false);
      cutProgress.setValue(0);
      scissorX.setValue(0);
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={handleClose} />

        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ scale: modalScale }] }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>
                {type === 'giftcard' ? 'Gift Card' : 'Environmental Impact'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {canRedeem ? 'Swipe right to redeem' : 'Insufficient credits'}
              </Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Ticket */}
          <View style={styles.ticketContainer}>
            <LinearGradient colors={['#ffffff', '#f9fffc']} style={styles.ticket}>
              {/* Left content */}
              <Animated.View style={[styles.left, { opacity: leftContentOpacity }]}>
                {leftContent}
              </Animated.View>

              {/* Perforation */}
              <Animated.View style={[styles.perfContainer, { opacity: dashedOpacity }]}>
                {Array.from({ length: 14 }).map((_, i) => (
                  <View key={i} style={styles.dot} />
                ))}
              </Animated.View>

              {/* Right panel */}
              <View style={[styles.right, { width: ticketWidth * 0.35 }]}>
                <Animated.View style={[styles.rightContent, { transform: [{ translateX: rightPanelTranslate }] }]}>
                  {rightContent || (
                    <LinearGradient
                      colors={type === 'giftcard' ? ['#00C896', '#00A876'] : ['#4CAF50', '#2E7D32']}
                      style={styles.defaultRightContent}
                    >
                      <MaterialIcons
                        name={type === 'giftcard' ? "card-giftcard" : "favorite"}
                        size={40}
                        color="white"
                      />
                      <Text style={styles.redeemText}>
                        {revealed ? 'Redeemed!' : canRedeem ? 'Redeem Now!' : 'Locked'}
                      </Text>
                    </LinearGradient>
                  )}
                </Animated.View>
              </View>

              {/* Hidden touch area for swipe gestures */}
              {!revealed && canRedeem && (
                <Animated.View
                  style={[styles.touchArea, { transform: [{ translateX: scissorX }] }]}
                  {...panResponder.panHandlers}
                />
              )}
            </LinearGradient>
          </View>

          {/* Instructions */}
          {!revealed && (
            <View style={styles.instructions}>
              <MaterialIcons name="swipe" size={20} color="#666" />
              <Text style={styles.instructionText}>
                {canRedeem
                  ? 'Swipe right on the ticket to redeem'
                  : `You need ${credits} credits to redeem this reward`
                }
              </Text>
            </View>
          )}

          {revealed && (
            <View style={styles.successMessage}>
              <MaterialIcons name="check-circle" size={24} color="#00C896" />
              <Text style={styles.successText}>Successfully redeemed!</Text>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: screenWidth - 24,
    maxHeight: screenHeight * 0.75,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FAFAFA',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
    marginRight: -8,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  ticketContainer: {
    margin: 20,
  },
  ticket: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
    minHeight: 130,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  left: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  perfContainer: {
    width: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D0D0D0',
  },
  right: {
    overflow: 'hidden',
  },
  rightContent: {
    flex: 1,
    minHeight: 130,
  },
  defaultRightContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  redeemText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  touchArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 80,
    zIndex: 10,
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
    backgroundColor: '#FAFAFA',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    flex: 1,
    fontWeight: '500',
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
    backgroundColor: '#E8F8F5',
  },
  successText: {
    fontSize: 16,
    color: '#00C896',
    fontWeight: '700',
  },
});

export default TicketModal;