import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

type Props = {
  id: string;
  /** kept for compatibility but ignored so it stays centered on chicken */
  leftPct: number;
  text: string;
  kind?: 'normal' | 'golden';
  /** how high to float upward in px (from the chicken center) */
  maxRise?: number; // default ~110
  onDone?: (id: string) => void;

  /** ⤵️ new: small right tilt & shift */
  tiltDeg?: number;      // default 8 (clockwise)
  shiftRight?: number;   // default 12 px
};

export default function AnimatedFloatText({
  id,
  leftPct, // ignored
  text,
  kind = 'normal',
  maxRise = 110,
  onDone,
  tiltDeg = 8,
  shiftRight = 12,
}: Props) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const anim = Animated.parallel([
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 140, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ]),
      Animated.timing(translateY, { toValue: -maxRise, duration: 1140, useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.15, duration: 160, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1.0, duration: 400, useNativeDriver: true }),
      ]),
    ]);

    anim.start(({ finished }) => finished && onDone?.(id));
    return () => anim.stop();
  }, [id, maxRise, onDone, opacity, scale, translateY]);

  return (
    <Animated.View
      style={[
        styles.fillCenter,
        {
          transform: [
            { translateX: shiftRight },              // ➡️ slight right shift
            { translateY },
            { scale },
            { rotate: `${tiltDeg}deg` },             // ↻ slight right tilt
          ],
          opacity,
        },
      ]}
      pointerEvents="none"
    >
      <Text style={[styles.text, kind === 'golden' && styles.golden]}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // covers the chicken wrapper and centers content
  fillCenter: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 44,
    fontWeight: '900',
    color: '#111827',
    textShadowColor: 'rgba(0,0,0,0.22)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 3,
  },
  golden: {
    fontSize: 50,
    color: '#FFD700',
    textShadowColor: 'rgba(161, 98, 7, .45)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 4,
  },
});
