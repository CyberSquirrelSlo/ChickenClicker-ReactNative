import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

type P = { width?: number; height?: number; color?: string };

export const UpgradesIcon: React.FC<P> = ({ width = 24, height = 24, color = '#6b7280' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <Path d="M6 20V10M12 20V4M18 20v-7" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

export const CoopIcon: React.FC<P> = ({ width = 24, height = 24, color = '#6b7280' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <Path d="M3 10L12 3l9 7v9H3z" stroke={color} strokeWidth={2} fill="none" strokeLinejoin="round" />
    <Path d="M9 21v-6h6v6" stroke={color} strokeWidth={2} fill="none" />
  </Svg>
);

export const AchievementsIcon: React.FC<P> = ({ width = 24, height = 24, color = '#6b7280' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <Path d="M12 3l2.4 4.86L20 9l-4 3.9L17 19l-5-2.7L7 19l1-6.1L4 9l5.6-1.14L12 3z" stroke={color} strokeWidth={2} fill="none" />
  </Svg>
);

export const HelpIcon: React.FC<P> = ({ width = 24, height = 24, color = '#6b7280' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={2} fill="none" />
    <Path d="M9.5 9a2.5 2.5 0 114 2c0 1.5-2 1.5-2 3" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />
    <Circle cx={12} cy={17} r={1} fill={color} />
  </Svg>
);

export const SettingsIcon: React.FC<P> = ({ width = 24, height = 24, color = '#6b7280' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <Path
      d="M12 3l1.5 2.5 2.9-.4.8 2.8 2.6 1.2-1.2 2.6 1.8 2-1.8 2 1.2 2.6-2.6 1.2-.8 2.8-2.9-.4L12 21l-1.5 2.5-2.9-.4-.8-2.8-2.6-1.2L5.4 16 3.6 14l1.8-2-1.2-2.6 2.6-1.2.8-2.8 2.9.4L12 3z"
      stroke={color}
      strokeWidth={1.6}
      fill="none"
    />
    <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={2} fill="none" />
  </Svg>
);
