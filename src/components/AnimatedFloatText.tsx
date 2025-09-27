import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

type Props = {
  id: string;
  leftPct: number;
  text: string;
  kind?: 'normal' | 'golden';
  containerWidth?: number;   // ⬅️ NEW
  onDone?: (id: string) => void;
};

export default function AnimatedFloatText({
  id,
  leftPct,
  text,
  kind = 'normal',
  containerWidth = 0,        // ⬅️ default
  onDone,
}: Props) {
  const translateY = useRef(new Animated.Value(10)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.parallel([
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 980, useNativeDriver: true }),
      ]),
      Animated.timing(translateY, { toValue: -40, duration: 1100, useNativeDriver: true }),
    ]);

    anim.start(({ finished }) => {
      if (finished && onDone) onDone(id);
    });

    return () => anim.stop();
  }, [id, onDone, opacity, translateY]);

  const clamped = Math.max(5, Math.min(95, leftPct));
  const leftPx = Math.round((containerWidth * clamped) / 100);  // ⬅️ pixels

  return (
    <Animated.View
      style={[
        styles.wrap,
        { left: leftPx, transform: [{ translateY }], opacity },  // ⬅️ number
      ]}
      pointerEvents="none"
    >
      <Text style={[styles.text, kind === 'golden' && styles.golden]}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: '45%',
  },
  text: {
    fontWeight: '800',
    color: '#111827',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  golden: {
    color: '#a16207',
    textShadowColor: 'rgba(161, 98, 7, .35)',
    textShadowRadius: 3,
  },
});
