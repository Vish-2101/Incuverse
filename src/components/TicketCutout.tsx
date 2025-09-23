import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, PanResponder, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

interface TicketCutoutProps {
  title?: string;
  subtitle?: string;
  rewardText?: string;
  onReveal?: () => void;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  [key: string]: any;
}

const TicketCutout: React.FC<TicketCutoutProps> = ({ title, subtitle, rewardText, onReveal, leftContent, rightContent }) => {
  const [revealed, setRevealed] = useState(false);
  const ticketWidth = screenWidth - 40;
  const cutProgress = useRef(new Animated.Value(0)).current;
  const scissorX = useRef(new Animated.Value(0)).current;

  const reveal = useCallback(() => {
    if (revealed) return;
    setRevealed(true);
    onReveal?.();
  }, [revealed, onReveal]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !revealed,
    onMoveShouldSetPanResponder: () => !revealed,
    onPanResponderMove: (_, gesture) => {
      if (revealed) return;
      const maxDrag = ticketWidth * 0.6;
      const x = Math.max(0, Math.min(gesture.dx, maxDrag));
      scissorX.setValue(x);
      cutProgress.setValue(x / maxDrag);
    },
    onPanResponderRelease: () => {
      if (revealed) return;
      const current = (cutProgress as any)._value as number;
      if (current > 0.7) {
        Animated.parallel([
          Animated.timing(cutProgress, {
            toValue: 1,
            duration: 250,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }),
          Animated.timing(scissorX, {
            toValue: ticketWidth * 0.6,
            duration: 250,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          })
        ]).start(() => reveal());
      } else {
        Animated.parallel([
          Animated.spring(cutProgress, {
            toValue: 0,
            tension: 120,
            friction: 7,
            useNativeDriver: false,
          }),
          Animated.spring(scissorX, {
            toValue: 0,
            tension: 120,
            friction: 7,
            useNativeDriver: false,
          })
        ]).start();
      }
    },
  });

  const rightPanelWidthValue = ticketWidth * 0.35;

  const rightPartTranslate = cutProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [rightPanelWidthValue, 0],
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


  return (
    <View style={styles.wrapper}>
      <LinearGradient colors={['#ffffff', '#f9fffc']} style={styles.ticket}>
        {/* Left content */}
        <Animated.View style={[styles.left, { opacity: leftContentOpacity }]}>
          {leftContent ? (
            leftContent
          ) : (
            <>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
              <View style={styles.row}>
                <MaterialIcons name={"eco" as any} size={18} color="#00C896" />
                <Text style={styles.hint}>Swipe right to cut and reveal</Text>
              </View>
            </>
          )}
        </Animated.View>

        {/* Perforation */}
        <Animated.View style={[styles.perfContainer, { opacity: dashedOpacity }]}>
          {Array.from({ length: 12 }).map((_, i) => (
            <View key={i} style={styles.dot} />
          ))}
        </Animated.View>

        {/* Right hidden reward panel */}
        <View style={[styles.right, { width: rightPanelWidthValue }]}>
          <Animated.View style={[styles.rightContent, { transform: [{ translateX: rightPartTranslate }] }]}>
            {rightContent ? (
              rightContent
            ) : (
              <LinearGradient colors={['#00C896', '#00A876']} style={styles.revealPanel}>
                <Text style={styles.revealText}>{rewardText}</Text>
              </LinearGradient>
            )}
          </Animated.View>
        </View>

        {/* Hidden touch area for swipe gestures */}
        {!revealed && (
          <Animated.View
            style={[styles.touchArea, { transform: [{ translateX: scissorX }] }]}
            {...panResponder.panHandlers}
          />
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignSelf: 'center',
  },
  ticket: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
    minHeight: 110,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  left: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  hint: {
    marginLeft: 6,
    color: '#666',
    fontWeight: '500',
    fontSize: 12,
  },
  perfContainer: {
    width: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
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
    minHeight: 110,
  },
  revealPanel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  revealText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  touchArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 60,
    zIndex: 10,
  },
});

export default TicketCutout;