import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';

type Props = {
  id: string;
  leftPct: number;     // 0..100
  delayMs?: number;
  durationMs?: number; // default 3200
  distance?: number;   // px to fall, default 500
  kind?: 'normal' | 'golden';
  containerWidth?: number;  // ⬅️ NEW
  onDone?: (id: string) => void;
};

export default function AnimatedEgg({
  id,
  leftPct,
  delayMs = 0,
  durationMs = 3200,
  distance = 500,
  kind = 'normal',
  containerWidth = 0,        // ⬅️ default
  onDone,
}: Props) {
  const translateY = useRef(new Animated.Value(-10)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.sequence([
      Animated.delay(delayMs),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: distance,
          duration: durationMs,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.95, duration: durationMs - 200, useNativeDriver: true }),
        ]),
      ]),
    ]);

    anim.start(({ finished }) => {
      if (finished && onDone) onDone(id);
    });

    return () => anim.stop();
  }, [delayMs, distance, durationMs, id, onDone, opacity, translateY]);

  const clamped = Math.max(5, Math.min(95, leftPct));
  const leftPx = Math.round((containerWidth * clamped) / 100);  // ⬅️ pixels

  return (
    <Animated.View
      style={[
        styles.egg,
        {
          left: leftPx,                         // ⬅️ number, not '%'
          transform: [{ translateY }],
          opacity,
        },
      ]}
      pointerEvents="none"
    >
      {kind === 'golden' ? (
        <Svg width={22} height={28} viewBox="0 0 22 28">
          <Defs>
            <RadialGradient id={`g-${id}`} cx="50%" cy="35%" r="70%">
              <Stop offset="0%" stopColor="#fde68a" />
              <Stop offset="55%" stopColor="#f59e0b" />
              <Stop offset="100%" stopColor="#b45309" />
            </RadialGradient>
          </Defs>
          <Ellipse cx={11} cy={15} rx={9} ry={12} fill={`url(#g-${id})`} stroke="#a16207" strokeWidth={1.2} />
        </Svg>
      ) : (
        <Text style={styles.emoji}>🥚</Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  egg: {
    position: 'absolute',
    top: 0,
  },
  emoji: {
    fontSize: 20,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
});
