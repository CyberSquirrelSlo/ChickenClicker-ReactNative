// src/components/GameBackground.tsx
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, Pattern, Rect, Circle } from 'react-native-svg';

type Props = {
  children?: React.ReactNode;
  onLayout?: ViewProps['onLayout'];
  /**
   * Optional intensity of dot overlay [0..1].
   * Default ~0.28 for large dots and ~0.16 for small ones.
   */
  intensity?: number;
};

export default function GameBackground({ children, onLayout, intensity = 1 }: Props) {
  // Opacity scales with provided intensity (you can tweak if needed)
  const bigDotOpacity = 0.28 * intensity;
  const smallDotOpacity = 0.16 * intensity;

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      {/* Warm orange gradient (subtle top highlight → deeper amber) */}
      <LinearGradient
        colors={['#fff7ed', '#ffedd5', '#fed7aa', '#f59e0b']} // cream → peach → light orange → amber
        locations={[0, 0.35, 0.75, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Dotted overlays (two layers for a more organic feel) */}
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
          {/* Big dots pattern (~28px) */}
          <Pattern id="dots-big" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            {/* Circle at top-left of tile (fills as a grid) */}
            <Circle cx="2" cy="2" r="1.5" fill={`rgba(255,255,255,${bigDotOpacity})`} />
          </Pattern>

          {/* Small dots pattern (offset & denser) */}
          <Pattern id="dots-small" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            {/* Slight offset so it doesn't align with the big grid */}
            <Circle cx="6" cy="5" r="1" fill={`rgba(255,255,255,${smallDotOpacity})`} />
          </Pattern>
        </Defs>

        {/* Two rects covering full area with different patterns */}
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#dots-big)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#dots-small)" />
      </Svg>

      {/* children (game content) */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    overflow: 'hidden', // keep falling eggs contained
  },
});
