import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { VoiceOrbState } from '../../types/session';

export interface VoiceOrbProps {
  state: VoiceOrbState;
  size?: number;
  onPress?: () => void;
  disabled?: boolean;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  state = 'IDLE',
  size = 140,
  onPress,
  disabled = false,
}) => {
  const { colors } = useTheme();

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    pulseAnim.stopAnimation();
    glowAnim.stopAnimation();
    rotateAnim.stopAnimation();

    let loopAnim: Animated.CompositeAnimation | null = null;

    if (state === 'IDLE') {
      // Gentle breathing pulse
      loopAnim = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1.05,
              duration: 1800,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0.6,
              duration: 1800,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1.0,
              duration: 1800,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0.3,
              duration: 1800,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      loopAnim.start();
    } else if (state === 'LISTENING') {
      // Active responsive pulse
      loopAnim = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1.18,
              duration: 600,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0.85,
              duration: 600,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1.0,
              duration: 700,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0.4,
              duration: 700,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      loopAnim.start();
    } else if (state === 'USER_SPEAKING') {
      // Fast rhythmic pulse
      loopAnim = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1.25,
              duration: 350,
              easing: Easing.out(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0.95,
              duration: 350,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 0.98,
              duration: 350,
              easing: Easing.in(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0.5,
              duration: 350,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      loopAnim.start();
    } else if (state === 'THINKING') {
      // Subtle rotation + gentle rhythm
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      loopAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.96,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      loopAnim.start();
    } else if (state === 'AI_SPEAKING') {
      // Energetic voice speech wave
      loopAnim = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1.2,
              duration: 450,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0.9,
              duration: 450,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1.02,
              duration: 500,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0.45,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      loopAnim.start();
    }

    return () => {
      pulseAnim.stopAnimation();
      glowAnim.stopAnimation();
      rotateAnim.stopAnimation();
    };
  }, [state, pulseAnim, glowAnim, rotateAnim]);

  const getOrbColor = () => {
    switch (state) {
      case 'LISTENING':
        return colors.orbListening;
      case 'USER_SPEAKING':
        return colors.orbUserSpeaking;
      case 'THINKING':
        return colors.orbThinking;
      case 'AI_SPEAKING':
        return colors.orbAiSpeaking;
      case 'IDLE':
      default:
        return colors.orbIdle;
    }
  };

  const getStatusLabel = () => {
    switch (state) {
      case 'LISTENING':
        return 'Listening...';
      case 'USER_SPEAKING':
        return 'Speaking...';
      case 'THINKING':
        return 'Sarah is thinking...';
      case 'AI_SPEAKING':
        return 'Sarah is speaking...';
      case 'IDLE':
      default:
        return 'Tap to speak';
    }
  };

  const orbColor = getOrbColor();
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        disabled={disabled || !onPress}
        style={[styles.wrapper, { width: size * 1.5, height: size * 1.5 }]}
        accessibilityRole="button"
        accessibilityLabel={`Voice Orb: ${getStatusLabel()}`}
      >
        {/* Outer Halo Glow */}
        <Animated.View
          style={[
            styles.halo,
            {
              width: size * 1.4,
              height: size * 1.4,
              borderRadius: (size * 1.4) / 2,
              backgroundColor: orbColor,
              opacity: glowAnim,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />

        {/* Secondary Ripple */}
        <Animated.View
          style={[
            styles.ripple,
            {
              width: size * 1.15,
              height: size * 1.15,
              borderRadius: (size * 1.15) / 2,
              borderColor: orbColor,
              opacity: glowAnim,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />

        {/* Core Animated Orb */}
        <Animated.View
          style={[
            styles.core,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: orbColor,
              transform: [{ scale: pulseAnim }, { rotate: spin }],
              shadowColor: orbColor,
            },
          ]}
        >
          {/* Inner Light Gradient Effect */}
          <View style={[styles.innerCore, { width: size * 0.75, height: size * 0.75, borderRadius: (size * 0.75) / 2 }]} />
        </Animated.View>
      </TouchableOpacity>

      <Text style={[styles.statusText, { color: colors.textSecondary }]}>{getStatusLabel()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  halo: {
    position: 'absolute',
  },
  ripple: {
    position: 'absolute',
    borderWidth: 2,
  },
  core: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 12,
  },
  innerCore: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  statusText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
